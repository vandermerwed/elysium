import type { CollectionEntry } from "astro:content";
// import getPostsWithEnrichedFrontmatter from "./getPostsWithEnrichedFrontmatter";
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
  // TODO: Need to figure out an efficient way to enrich the frontmatter for collections
  // const enrichedPosts = await getPostsWithEnrichedFrontmatter(posts); // enrich the frontmatter

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

export { getSortedPosts, getEnrichedSortedPosts };
