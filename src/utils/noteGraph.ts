import Graph from "graphology";
import betweennessCentrality from "graphology-metrics/centrality/betweenness";
import pagerank from "graphology-metrics/centrality/pagerank";
import closenessCentrality from "graphology-metrics/centrality/closeness";
import hits from "graphology-metrics/centrality/hits";
import { singleSourceLength } from "graphology-shortest-path/unweighted";
import louvain from "graphology-communities-louvain";
import type { CollectionEntry } from "astro:content";

type AnyPost = CollectionEntry<"notes" | "writing" | "journal" | "projects">;

export interface NodeMetrics {
  inDegree: number;
  outDegree: number;
  externalLinkCount: number;
  betweenness: number;
  pageRank: number;
  closeness: number;
  hubScore: number;
  authorityScore: number;
  eccentricity: number;
  reachability: number;
  reciprocity: number;
  communityId: number;
  topology: "B" | "A" | "H" | "R" | "T";
  wordCount: number;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  density: number;
  orphans: number;
  diameter: number;
  communityCount: number;
}

export interface NormContext {
  maxBetweenness: number;
  maxPageRank: number;
  maxCloseness: number;
  maxAuthority: number;
  maxHub: number;
  maxInDegree: number;
  graphOrder: number;
}

// Cache for expensive graph-wide computations
let cachedBetweenness: Record<string, number> | null = null;
let cachedPageRank: Record<string, number> | null = null;
let cachedCloseness: Record<string, number> | null = null;
let cachedHITS: { authorities: Record<string, number>; hubs: Record<string, number> } | null = null;
let cachedCommunities: Record<string, number> | null = null;
let cachedCommunityCount: number = 0;
let cachedClusterLabels: Record<number, string> = {};
let cachedDiameter: number = 0;
let cachedEccentricity: Record<string, number> = {};
let cachedReachability: Record<string, number> = {};
let cachedNormContext: NormContext | null = null;
let cachedGraphRef: Graph | null = null;

function ensureMetricsCache(graph: Graph) {
  if (cachedGraphRef === graph) return;
  cachedBetweenness = betweennessCentrality(graph);
  cachedPageRank = pagerank(graph, { getEdgeWeight: null });
  cachedCloseness = closenessCentrality(graph, { wassermanFaust: true });
  cachedHITS = hits(graph, { normalize: true });

  // Louvain community detection (works on directed graphs)
  try {
    const details = louvain.detailed(graph, { getEdgeWeight: null });
    cachedCommunities = details.communities;
    cachedCommunityCount = details.count;
  } catch {
    cachedCommunities = {};
    cachedCommunityCount = 0;
  }

  // Derive cluster labels from most common tag per community
  cachedClusterLabels = {};
  if (cachedCommunities) {
    const communityTags: Record<number, Record<string, number>> = {};
    for (const [node, cId] of Object.entries(cachedCommunities)) {
      if (!communityTags[cId]) communityTags[cId] = {};
      const tags: string[] = graph.getNodeAttribute(node, "tags") ?? [];
      for (const tag of tags) {
        communityTags[cId][tag] = (communityTags[cId][tag] ?? 0) + 1;
      }
    }
    for (const [cId, tagCounts] of Object.entries(communityTags)) {
      let bestTag = "";
      let bestCount = 0;
      for (const [tag, count] of Object.entries(tagCounts)) {
        if (count > bestCount) { bestTag = tag; bestCount = count; }
      }
      if (bestTag) cachedClusterLabels[Number(cId)] = bestTag;
    }
  }

  // Compute diameter, eccentricity, and reachability via BFS for all nodes
  let maxEcc = 0;
  cachedEccentricity = {};
  cachedReachability = {};
  const totalNodes = graph.order;
  graph.forEachNode(node => {
    try {
      const dists = singleSourceLength(graph, node);
      const vals = Object.values(dists);
      if (vals.length > 1) {
        const ecc = Math.max(...vals);
        cachedEccentricity[node] = ecc;
        if (ecc > maxEcc) maxEcc = ecc;
      } else {
        cachedEccentricity[node] = 0;
      }
      cachedReachability[node] = totalNodes > 1 ? (vals.length - 1) / (totalNodes - 1) : 0;
    } catch {
      cachedEccentricity[node] = 0;
      cachedReachability[node] = 0;
    }
  });
  cachedDiameter = maxEcc;

  // Compute normalization context from cached metrics
  const bVals = Object.values(cachedBetweenness!);
  const prVals = Object.values(cachedPageRank!);
  const cVals = Object.values(cachedCloseness!);
  const aVals = Object.values(cachedHITS!.authorities);
  const hVals = Object.values(cachedHITS!.hubs);
  let maxInDeg = 0;
  graph.forEachNode(node => { maxInDeg = Math.max(maxInDeg, graph.inDegree(node)); });

  cachedNormContext = {
    maxBetweenness: bVals.length > 0 ? Math.max(...bVals) : 0,
    maxPageRank: prVals.length > 0 ? Math.max(...prVals) : 0,
    maxCloseness: cVals.length > 0 ? Math.max(...cVals) : 0,
    maxAuthority: aVals.length > 0 ? Math.max(...aVals) : 0,
    maxHub: hVals.length > 0 ? Math.max(...hVals) : 0,
    maxInDegree: maxInDeg,
    graphOrder: graph.order,
  };

  cachedGraphRef = graph;
}

/**
 * Build a directed graph from all content collections.
 *
 * Nodes = all posts (keyed by `{collection}/{id}`)
 * Edges = wikilink references ([[target]]) extracted from post bodies
 */
export function buildNoteGraph(allPosts: AnyPost[]): Graph {
  const graph = new Graph({ type: "directed", multi: false });

  // Reset cache when building a new graph
  cachedBetweenness = null;
  cachedPageRank = null;
  cachedCloseness = null;
  cachedHITS = null;
  cachedCommunities = null;
  cachedCommunityCount = 0;
  cachedClusterLabels = {};
  cachedDiameter = 0;
  cachedEccentricity = {};
  cachedReachability = {};
  cachedNormContext = null;
  cachedGraphRef = null;

  // 1. Add all posts as nodes
  for (const post of allPosts) {
    const nodeId = `${post.collection}/${post.id}`;
    graph.addNode(nodeId, {
      title: post.data.title,
      collection: post.collection,
      id: post.id,
      wordCount: post.body ? post.body.trim().split(/\s+/).length : 0,
      externalLinkCount: 0,
      tags: (post.data as Record<string, unknown>).tags ?? [],
    });
  }

  // Build a lookup map for fast target resolution
  const idToNode = new Map<string, string>();
  for (const post of allPosts) {
    const nodeId = `${post.collection}/${post.id}`;
    idToNode.set(nodeId, nodeId);
    idToNode.set(post.id, nodeId);
    // Also map bare filename for obsidian-style links
    const parts = post.id.split("/");
    const basename = parts[parts.length - 1];
    if (!idToNode.has(basename)) {
      idToNode.set(basename, nodeId);
    }
  }

  // 2. Parse wikilinks from each post's body and add edges
  for (const post of allPosts) {
    const sourceId = `${post.collection}/${post.id}`;
    const body = post.body ?? "";

    const wikilinks = body.match(/(?<=\[\[)(.*?)(?=\]\])/g) ?? [];
    let externalCount = 0;

    for (const raw of wikilinks) {
      const target = normalizeWikilink(raw);
      const targetNodeId = resolveTarget(target, idToNode);
      if (
        targetNodeId &&
        targetNodeId !== sourceId &&
        !graph.hasEdge(sourceId, targetNodeId)
      ) {
        graph.addEdge(sourceId, targetNodeId);
      }
    }

    // Count markdown-style external links
    const externalMatches = body.match(/\[.*?\]\(https?:\/\/[^)]+\)/g);
    if (externalMatches) externalCount = externalMatches.length;
    graph.setNodeAttribute(sourceId, "externalLinkCount", externalCount);
  }

  return graph;
}

function normalizeWikilink(raw: string): string {
  return raw
    .split("|")[0]
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\.\//, "")
    .replace(/\.mdx?$/, "")
    .replace(/^\//, "")
    .trim();
}

function resolveTarget(
  target: string,
  idToNode: Map<string, string>
): string | null {
  // Direct match: "notes/my-note" or "my-note"
  const direct = idToNode.get(target);
  if (direct) return direct;

  // Try with each collection prefix
  for (const collection of ["notes", "writing", "journal", "projects"]) {
    const candidate = `${collection}/${target}`;
    const match = idToNode.get(candidate);
    if (match) return match;
  }

  return null;
}

/** Get metrics for a single node. */
export function getNodeMetrics(graph: Graph, nodeId: string): NodeMetrics {
  if (!graph.hasNode(nodeId)) {
    return {
      inDegree: 0,
      outDegree: 0,
      externalLinkCount: 0,
      betweenness: 0,
      pageRank: 0,
      closeness: 0,
      hubScore: 0,
      authorityScore: 0,
      eccentricity: 0,
      reachability: 0,
      reciprocity: 0,
      communityId: -1,
      topology: "T" as const,
      wordCount: 0,
    };
  }

  ensureMetricsCache(graph);

  const inDeg = graph.inDegree(nodeId);
  const outDeg = graph.outDegree(nodeId);
  const externalLinkCount =
    graph.getNodeAttribute(nodeId, "externalLinkCount") ?? 0;
  const wordCount = graph.getNodeAttribute(nodeId, "wordCount") ?? 0;

  const nodeEccentricity = cachedEccentricity[nodeId] ?? 0;
  const reachability = cachedReachability[nodeId] ?? 0;

  // Reciprocity: count of mutual (bidirectional) links
  let reciprocity = 0;
  const outNeighbors = graph.outNeighbors(nodeId);
  for (const neighbor of outNeighbors) {
    if (graph.hasEdge(neighbor, nodeId)) {
      reciprocity++;
    }
  }

  // Classify topology role using normalized metrics
  const nc = cachedNormContext!;
  const betweennessN = nc.maxBetweenness > 0 ? (cachedBetweenness?.[nodeId] ?? 0) / nc.maxBetweenness : 0;
  const authorityN = nc.maxAuthority > 0 ? (cachedHITS?.authorities[nodeId] ?? 0) / nc.maxAuthority : 0;
  const hubN = nc.maxHub > 0 ? (cachedHITS?.hubs[nodeId] ?? 0) / nc.maxHub : 0;

  let topology: "B" | "A" | "H" | "R" | "T" = "T";
  if (betweennessN > 0.3 && (inDeg + outDeg) > 2) {
    topology = "B"; // Bridge: high betweenness, structural connector
  } else if (authorityN > 0.3 && inDeg >= outDeg && inDeg > 0) {
    topology = "A"; // Authority: well-referenced canonical note
  } else if (hubN > 0.3 && outDeg > inDeg) {
    topology = "H"; // Hub: curates/links to authoritative notes
  } else if (reachability > 0.4 && reciprocity >= 1) {
    topology = "R"; // Relay: well-integrated, bidirectional exchange
  }
  // else T (Terminal): leaf or low-connectivity

  return {
    inDegree: inDeg,
    outDegree: outDeg,
    externalLinkCount,
    betweenness: cachedBetweenness?.[nodeId] ?? 0,
    pageRank: cachedPageRank?.[nodeId] ?? 0,
    closeness: cachedCloseness?.[nodeId] ?? 0,
    hubScore: cachedHITS?.hubs[nodeId] ?? 0,
    authorityScore: cachedHITS?.authorities[nodeId] ?? 0,
    eccentricity: nodeEccentricity,
    reachability,
    reciprocity,
    communityId: cachedCommunities?.[nodeId] ?? -1,
    topology,
    wordCount,
  };
}

/** Get incoming link node IDs (replaces getIncomingLinks utility). */
export function getIncomingLinkIds(graph: Graph, nodeId: string): string[] {
  if (!graph.hasNode(nodeId)) return [];
  return graph.inNeighbors(nodeId);
}

/** Get outgoing link node IDs. */
export function getOutgoingLinkIds(graph: Graph, nodeId: string): string[] {
  if (!graph.hasNode(nodeId)) return [];
  return graph.outNeighbors(nodeId);
}

/** Aggregate stats for the full graph. */
export function getGraphStats(graph: Graph): GraphStats {
  const nodeCount = graph.order;
  const edgeCount = graph.size;
  let orphans = 0;
  graph.forEachNode(node => {
    if (graph.degree(node) === 0) orphans++;
  });

  ensureMetricsCache(graph);

  return {
    nodeCount,
    edgeCount,
    avgDegree:
      nodeCount > 0
        ? Math.round(((edgeCount * 2) / nodeCount) * 10) / 10
        : 0,
    density:
      nodeCount > 1 ? edgeCount / (nodeCount * (nodeCount - 1)) : 0,
    orphans,
    diameter: cachedDiameter,
    communityCount: cachedCommunityCount,
  };
}

/** Get the cached graph diameter. Call after ensureMetricsCache. */
export function getGraphDiameter(graph: Graph): number {
  ensureMetricsCache(graph);
  return cachedDiameter;
}

/** Get community size for a given community ID. */
export function getCommunitySize(graph: Graph, communityId: number): number {
  ensureMetricsCache(graph);
  if (!cachedCommunities) return 0;
  return Object.values(cachedCommunities).filter(c => c === communityId).length;
}

/** Get the auto-derived label for a community (most common tag among its members). */
export function getClusterLabel(graph: Graph, communityId: number): string {
  ensureMetricsCache(graph);
  return cachedClusterLabels[communityId] ?? "";
}

/** Get the normalization context for multi-dimensional scoring. */
export function getNormContext(graph: Graph): NormContext {
  ensureMetricsCache(graph);
  return cachedNormContext!;
}
