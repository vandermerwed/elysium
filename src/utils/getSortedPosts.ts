import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

const getSortedPosts = (
  posts: CollectionEntry<"notes">[],
  contentTypes?: readonly string[]
) => {
  return posts
    .filter(post => postFilter(post, contentTypes))
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.pubDatetime ?? b.data.modDatetime).getTime() / 1000
        ) - 
        Math.floor(
          new Date(a.data.pubDatetime ?? a.data.modDatetime).getTime() / 1000
        )
    );
};

export { getSortedPosts };
