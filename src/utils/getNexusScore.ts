import type { NodeMetrics, NormContext } from "./noteGraph";

/**
 * Compute NexusScore from graph metrics with multi-dimensional scoring.
 *
 * Four dimensions (each normalized 0–1):
 *   Substance  — content depth (word count, external references)
 *   Position   — structural importance (betweenness, pageRank, closeness)
 *   Integration — embeddedness (reachability, reciprocity)
 *   Authority  — recognition (HITS authority, inDegree)
 *
 * Composite = weighted blend → stage bucket.
 * Topology role comes directly from NodeMetrics (classified in noteGraph.ts).
 */
export function computeNexusScore(metrics: NodeMetrics, norm: NormContext): string {
  const { topology } = metrics;

  // --- Substance: content depth ---
  const wordNorm = Math.min(metrics.wordCount / 3000, 1);
  const extNorm = Math.min(metrics.externalLinkCount / 8, 1);
  const substance = 0.7 * wordNorm + 0.3 * extNorm;

  // --- Position: structural importance ---
  const betweennessNorm = norm.maxBetweenness > 0 ? metrics.betweenness / norm.maxBetweenness : 0;
  const pageRankNorm = norm.maxPageRank > 0 ? metrics.pageRank / norm.maxPageRank : 0;
  const closenessNorm = norm.maxCloseness > 0 ? metrics.closeness / norm.maxCloseness : 0;
  const position = 0.4 * betweennessNorm + 0.3 * pageRankNorm + 0.3 * closenessNorm;

  // --- Integration: embeddedness ---
  const reachabilityNorm = metrics.reachability;
  const reciprocityNorm = Math.min(metrics.reciprocity / 5, 1);
  const integration = 0.6 * reachabilityNorm + 0.4 * reciprocityNorm;

  // --- Authority: recognition ---
  const authorityNorm = norm.maxAuthority > 0 ? metrics.authorityScore / norm.maxAuthority : 0;
  const inDegreeNorm = norm.maxInDegree > 0 ? metrics.inDegree / norm.maxInDegree : 0;
  const authority = 0.5 * authorityNorm + 0.5 * inDegreeNorm;

  // --- Composite ---
  const composite = 0.25 * substance + 0.30 * position + 0.25 * integration + 0.20 * authority;

  // --- Stage ---
  let stage: string;
  if (composite < 0.12) stage = "Fragment";
  else if (composite < 0.25) stage = "Basic";
  else if (composite < 0.45) stage = "Developed";
  else if (composite < 0.65) stage = "Advanced";
  else stage = "Integrated";

  return `${topology}_${stage}`;
}

// --- Legacy API for backward compat during transition ---

interface NexusScoreInput {
  data: {
    title?: string;
    wordCount: number;
    incomingLinks: string[] | { id: string }[];
    outgoingLinks: string[] | { id: string }[];
    externalLinks: string[];
  };
}

/** @deprecated Use computeNexusScore with NodeMetrics + NormContext instead */
const getNexusScore = (post: NexusScoreInput) => {
  const incomingLinkCount = post.data.incomingLinks.length;
  const outgoingLinkCount = post.data.outgoingLinks.length;
  const totalLinkCount = incomingLinkCount + outgoingLinkCount;

  let dominanceState: "H" | "R" | "T" = "H";
  if (totalLinkCount > 0) {
    const incomingLinkRatio = incomingLinkCount / totalLinkCount;
    if (incomingLinkRatio > 0.6) dominanceState = "R";
    else if (incomingLinkRatio < 0.4) dominanceState = "T";
  }

  const totalScore =
    incomingLinkCount * 10 +
    outgoingLinkCount * 5 +
    post.data.externalLinks.length * 2 +
    post.data.wordCount * 0.02;

  let stage = "Fragment";
  const scoreRanges: [number, string][] = [
    [10, "Fragment"],
    [26, "Basic"],
    [42, "Developed"],
    [68, "Advanced"],
    [Infinity, "Integrated"],
  ];
  for (const [threshold, name] of scoreRanges) {
    if (totalScore <= threshold) {
      stage = name;
      break;
    }
  }

  return `${dominanceState}_${stage}`;
};

export default getNexusScore;
