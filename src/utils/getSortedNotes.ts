import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

type CollectionName = "notes";
type SortField = "pubDatetime" | "modDatetime";
type SortOrder = "asc" | "desc";

const getSortedNotes = <T extends CollectionName>(
  posts: CollectionEntry<T>[],
  contentTypes?: readonly string[],
  sortField: SortField = "modDatetime",
  sortOrder: SortOrder = "desc"
): CollectionEntry<T>[] => {
  return posts
    .filter(post => postFilter(post, contentTypes))
    .sort((a, b) => {
      const getDate = (post: CollectionEntry<T>) =>
        sortField === "modDatetime"
          ? new Date(post.data.modDatetime ?? post.data.pubDatetime)
          : new Date(post.data.pubDatetime ?? post.data.modDatetime);

      const diff =
        Math.floor(getDate(b).getTime() / 1000) -
        Math.floor(getDate(a).getTime() / 1000);

      return sortOrder === "asc" ? -diff : diff;
    });
};

export { getSortedNotes };
