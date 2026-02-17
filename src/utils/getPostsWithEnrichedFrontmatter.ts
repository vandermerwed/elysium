import { render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type Graph from "graphology";
import { getNodeMetrics, getIncomingLinkIds, getOutgoingLinkIds, getNormContext } from "./noteGraph";
import { computeNexusScore } from "./getNexusScore";

type CollectionName = "notes" | "writing" | "journal" | "projects";

/**
 * Render posts and merge remark plugin frontmatter.
 * When a graph is provided, computes real NexusScore and link data from the graph.
 */
const getPostsWithEnrichedFrontmatter = async <T extends CollectionName>(
    posts: CollectionEntry<T>[],
    graph?: Graph
) => {
    const normCtx = graph ? getNormContext(graph) : undefined;

    return Promise.all(
        posts.map(async post => {
            const { remarkPluginFrontmatter } = await render(post);

            // Only include keys from remarkPluginFrontmatter that exist in post.data
            const filteredFrontmatter = remarkPluginFrontmatter
                ? Object.fromEntries(
                    Object.entries(remarkPluginFrontmatter).filter(([key]) =>
                        key in post.data
                    )
                )
                : {};

            let graphData: Record<string, unknown> = {};

            if (graph) {
                const nodeId = `${post.collection}/${post.id}`;
                const metrics = getNodeMetrics(graph, nodeId);
                const nexusScore = computeNexusScore(metrics, normCtx!);
                const incoming = getIncomingLinkIds(graph, nodeId);
                const outgoing = getOutgoingLinkIds(graph, nodeId);

                graphData = {
                    nexusScore,
                    incomingLinks: incoming.map(id => ({ id })),
                    outgoingLinks: outgoing.map(id => ({ id })),
                };
            }

            const enrichedData: CollectionEntry<T>["data"] = {
                ...post.data,
                ...filteredFrontmatter,
                ...graphData,
            };

            const enrichedPost: CollectionEntry<T> = {
                ...post,
                data: enrichedData,
            };

            return enrichedPost;
        })
    );
};

export default getPostsWithEnrichedFrontmatter;
