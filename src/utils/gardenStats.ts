import type Graph from "graphology";
import { getNodeMetrics, getGraphStats, getNormContext } from "./noteGraph";
import { computeNexusScore } from "./getNexusScore";

export interface GardenStats {
  total: number;
  byStage: { developed: number; emerging: number; seedling: number };
  byTopology: { bridges: number; authorities: number; hubs: number; relays: number; terminals: number };
  totalLinks: number;
  avgLinksPerNote: number;
  mostConnected: { title: string; linkCount: number } | null;
  orphans: number;
  density: number;
  communityCount: number;
  diameter: number;
  totalWords: number;
  externalLinks: number;
  mutualLinks: number;
}

/**
 * Compute aggregate garden statistics from the note graph.
 * Filters to nodes in the given collection prefix (default "notes").
 */
export function computeGardenStats(
  graph: Graph,
  collection: string = "notes"
): GardenStats {
  const graphStats = getGraphStats(graph);
  const prefix = `${collection}/`;

  const byStage = { developed: 0, emerging: 0, seedling: 0 };
  const byTopology = { bridges: 0, authorities: 0, hubs: 0, relays: 0, terminals: 0 };
  let mostConnected: { title: string; linkCount: number } | null = null;
  let noteCount = 0;
  let collectionEdges = 0;
  let collectionOrphans = 0;
  let totalWords = 0;
  let totalExternalLinks = 0;
  let totalReciprocity = 0;
  const collectionCommunities = new Set<number>();

  const normCtx = getNormContext(graph);

  graph.forEachNode((nodeId, attrs) => {
    if (!nodeId.startsWith(prefix)) return;
    noteCount++;

    const metrics = getNodeMetrics(graph, nodeId);
    const score = computeNexusScore(metrics, normCtx);

    // Parse stage from score string (e.g. "H_Developed")
    const stage = score.split("_")[1];
    if (stage === "Advanced" || stage === "Integrated") {
      byStage.developed++;
    } else if (stage === "Developed") {
      byStage.emerging++;
    } else {
      // Fragment, Basic
      byStage.seedling++;
    }

    // Topology
    const topo = score.split("_")[0];
    if (topo === "B") byTopology.bridges++;
    else if (topo === "A") byTopology.authorities++;
    else if (topo === "H") byTopology.hubs++;
    else if (topo === "R") byTopology.relays++;
    else byTopology.terminals++;

    // Count outgoing edges from this collection node (avoids double-counting)
    collectionEdges += metrics.outDegree;
    totalWords += metrics.wordCount;
    totalExternalLinks += metrics.externalLinkCount;
    totalReciprocity += metrics.reciprocity;

    // Track orphans within this collection
    if (metrics.inDegree === 0 && metrics.outDegree === 0) {
      collectionOrphans++;
    }

    // Track distinct communities this collection's notes belong to
    if (metrics.communityId >= 0) {
      collectionCommunities.add(metrics.communityId);
    }

    // Most connected by total degree
    const linkCount = metrics.inDegree + metrics.outDegree;
    if (!mostConnected || linkCount > mostConnected.linkCount) {
      mostConnected = {
        title: attrs.title ?? nodeId,
        linkCount,
      };
    }
  });

  // Collection-scoped density: edges among collection nodes / possible edges
  const collectionDensity =
    noteCount > 1 ? collectionEdges / (noteCount * (noteCount - 1)) : 0;

  return {
    total: noteCount,
    byStage,
    byTopology,
    totalLinks: collectionEdges,
    avgLinksPerNote:
      noteCount > 0
        ? Math.round((collectionEdges / noteCount) * 10) / 10
        : 0,
    mostConnected,
    orphans: collectionOrphans,
    density: collectionDensity,
    communityCount: collectionCommunities.size,
    diameter: graphStats.diameter,
    totalWords,
    externalLinks: totalExternalLinks,
    mutualLinks: Math.floor(totalReciprocity / 2),
  };
}
