import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

type CollectionName = "notes" | "writing" | "journal" | "projects";

const postFilter = (
  post: CollectionEntry<CollectionName>,
  contentTypes?: readonly string[]
): boolean => {
  const { data } = post;
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;

  // Determine if content should be included based on type field
  // type only exists on notes and journal collections
  const type = (data as { type?: string }).type;
  let isContent = true;
  if (Array.isArray(contentTypes) && contentTypes.length > 0) {
    // Check type field (notes: exploration, journal: loadout/theme)
    isContent = type ? contentTypes.includes(type) : false;
  }

  return isContent && data.status && data.status === "published" && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
