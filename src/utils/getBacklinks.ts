import type { CollectionEntry } from "astro:content";
import type Graph from "graphology";
import { getIncomingLinkIds } from "./noteGraph";

type AnyPost = CollectionEntry<"notes" | "writing" | "journal" | "projects">;

export interface Backlink {
  title: string;
  url: string;
  type: string | undefined;
  description: string;
}

export function getBacklinks(
  graph: Graph,
  nodeId: string,
  allPosts: AnyPost[]
): Backlink[] {
  const incomingNodeIds = getIncomingLinkIds(graph, nodeId);
  return incomingNodeIds.map(id => {
    const [collection, ...idParts] = id.split("/");
    const postId = idParts.join("/");
    const source = allPosts.find(
      p => p.collection === collection && p.id === postId
    );
    const entryBasePath = collection === "projects" ? "projects" : collection;
    return {
      title: source?.data.title ?? postId,
      url: `/${entryBasePath}/${postId}/`,
      type:
        source?.data && "type" in source.data
          ? ((source.data as Record<string, unknown>).type as
              | string
              | undefined)
          : undefined,
      description: source?.data.description ?? "",
    };
  });
}
