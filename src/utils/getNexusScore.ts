import type { NodeMetrics } from "./noteGraph";

const scoreRanges: [number, string][] = [
  [10, "Fragment"],
  [26, "Basic"],
  [42, "Developed"],
  [68, "Advanced"],
  [Infinity, "Integrated"],
];

/**
 * Compute NexusScore from graph-derived NodeMetrics.
 * Now uses REAL incoming links, betweenness centrality, and PageRank.
 */
export function computeNexusScore(metrics: NodeMetrics): string {
  const {
    inDegree,
    outDegree,
    externalLinkCount,
    wordCount,
    topology,
    betweenness,
    pageRank,
  } = metrics;

  const incomingScore = inDegree * 10;
  const outgoingScore = outDegree * 5;
  const externalScore = externalLinkCount * 2;
  const wordScore = wordCount * 0.02;
  const betweennessBonus = betweenness * 50;
  const pageRankBonus = pageRank * 100;

  const totalScore =
    incomingScore +
    outgoingScore +
    externalScore +
    wordScore +
    betweennessBonus +
    pageRankBonus;

  let stage = "Fragment";
  for (const [threshold, name] of scoreRanges) {
    if (totalScore <= threshold) {
      stage = name;
      break;
    }
  }

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

/** @deprecated Use computeNexusScore with NodeMetrics instead */
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
  for (const [threshold, name] of scoreRanges) {
    if (totalScore <= threshold) {
      stage = name;
      break;
    }
  }

  return `${dominanceState}_${stage}`;
};

export default getNexusScore;
