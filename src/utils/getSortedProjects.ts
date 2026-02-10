import type { CollectionEntry } from "astro:content";
import projectFilter from "./projectFilter";

const getSortedProjects = (posts: CollectionEntry<"projects">[]) => {
  const resolveDate = (post: CollectionEntry<"projects">) =>
    post.data.startDate ?? post.data.pubDatetime ?? post.data.modDatetime;

  return posts
    .filter(projectFilter)
    .sort(
      (a, b) =>
        Math.floor(new Date(resolveDate(b) ?? 0).getTime() / 1000) -
        Math.floor(new Date(resolveDate(a) ?? 0).getTime() / 1000)
    );
};

export { getSortedProjects };
