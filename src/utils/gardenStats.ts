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
  lastUpdated: { title: string; date: Date } | null;
}

/**
 * Compute aggregate garden statistics from the note graph.
 * Filters to nodes in the given collection prefix (default "notes").
 */
export function computeGardenStats(
  graph: Graph,
  collection: string = "notes"
): GardenStats {
  const stats = getGraphStats(graph);
  const prefix = `${collection}/`;

  const byStage = { developed: 0, emerging: 0, seedling: 0 };
  const byTopology = { bridges: 0, authorities: 0, hubs: 0, relays: 0, terminals: 0 };
  let totalLinks = 0;
  let mostConnected: { title: string; linkCount: number } | null = null;
  let lastUpdated: { title: string; date: Date } | null = null;
  let noteCount = 0;

  graph.forEachNode((nodeId, attrs) => {
    if (!nodeId.startsWith(prefix)) return;
    noteCount++;

    const metrics = getNodeMetrics(graph, nodeId);
    const normCtx = getNormContext(graph);
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

    // Link counts
    const linkCount = metrics.inDegree + metrics.outDegree;
    totalLinks += linkCount;

    if (!mostConnected || linkCount > mostConnected.linkCount) {
      mostConnected = {
        title: attrs.title ?? nodeId,
        linkCount,
      };
    }
  });

  return {
    total: noteCount,
    byStage,
    byTopology,
    totalLinks,
    avgLinksPerNote:
      noteCount > 0
        ? Math.round((totalLinks / noteCount) * 10) / 10
        : 0,
    mostConnected,
    lastUpdated, // Will be populated when consuming pages pass date info
  };
}
