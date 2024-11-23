import type { CollectionEntry } from "astro:content";
import projectFilter from "./projectFilter";

const getSortedProjects = (posts: CollectionEntry<"projects">[]) => {
  return posts
    .filter(projectFilter)
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

export { getSortedProjects };
