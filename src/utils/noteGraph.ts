import Graph from "graphology";
import betweennessCentrality from "graphology-metrics/centrality/betweenness";
import pagerank from "graphology-metrics/centrality/pagerank";
import type { CollectionEntry } from "astro:content";

type AnyPost = CollectionEntry<"notes" | "writing" | "journal" | "projects">;

export interface NodeMetrics {
  inDegree: number;
  outDegree: number;
  externalLinkCount: number;
  betweenness: number;
  pageRank: number;
  topology: "H" | "R" | "T";
  wordCount: number;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  density: number;
  orphans: number;
}

// Cache for expensive graph-wide computations
let cachedBetweenness: Record<string, number> | null = null;
let cachedPageRank: Record<string, number> | null = null;
let cachedGraphRef: Graph | null = null;

function ensureMetricsCache(graph: Graph) {
  if (cachedGraphRef === graph) return;
  cachedBetweenness = betweennessCentrality(graph);
  cachedPageRank = pagerank(graph, { getEdgeWeight: null });
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
  cachedGraphRef = null;

  // 1. Add all posts as nodes
  for (const post of allPosts) {
    const nodeId = `${post.collection}/${post.id}`;
    graph.addNode(nodeId, {
      title: post.data.title,
      collection: post.collection,
      id: post.id,
      wordCount: post.data.wordCount ?? 0,
      externalLinkCount: 0,
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
      topology: "T",
      wordCount: 0,
    };
  }

  ensureMetricsCache(graph);

  const inDeg = graph.inDegree(nodeId);
  const outDeg = graph.outDegree(nodeId);
  const externalLinkCount =
    graph.getNodeAttribute(nodeId, "externalLinkCount") ?? 0;
  const wordCount = graph.getNodeAttribute(nodeId, "wordCount") ?? 0;

  const totalDegree = inDeg + outDeg;
  let topology: "H" | "R" | "T" = "H";
  if (totalDegree > 0) {
    const inRatio = inDeg / totalDegree;
    if (inRatio > 0.6) topology = "R";
    else if (inRatio < 0.4) topology = "T";
    else topology = "H";
  }

  return {
    inDegree: inDeg,
    outDegree: outDeg,
    externalLinkCount,
    betweenness: cachedBetweenness?.[nodeId] ?? 0,
    pageRank: cachedPageRank?.[nodeId] ?? 0,
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
  };
}
