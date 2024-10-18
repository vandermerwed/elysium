import type { CollectionEntry } from "astro:content";
import getPostsWithEnrichedFrontmatter from "./getPostsWithEnrichedFrontmatter";
import postFilter from "./postFilter";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

const getEnrichedSortedPosts = async <T extends "blog" | "projects">(posts: CollectionEntry<T>[]) => {
  // make sure that this func is async
  const enrichedPosts = await getPostsWithEnrichedFrontmatter(posts); // enrich the frontmatter

  return enrichedPosts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export { getSortedPosts, getEnrichedSortedPosts };
