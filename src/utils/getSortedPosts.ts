import type { CollectionEntry } from "astro:content";
import getPostsWithEnrichedFrontmatter from "./getPostsWithEnrichedFrontmatter";

const getSortedPosts = async (posts: CollectionEntry<"blog">[]) => {
  // make sure that this func is async
  const postsWithRT = await getPostsWithEnrichedFrontmatter(posts); // add reading time

  return postsWithRT
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
    );
};

export default getSortedPosts;
