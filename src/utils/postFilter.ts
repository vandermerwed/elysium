import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

const postFilter = (
  post: CollectionEntry<"blog">,
  contentTypes?: readonly string[]
): boolean => {
  const { data } = post;
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;

  // Determine if content should be included
  const isContent = Array.isArray(contentTypes) && data.type
    ? contentTypes.includes(data.type)
    : true;

  return isContent && !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
