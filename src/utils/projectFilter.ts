import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

const postFilter = ({ data }: CollectionEntry<"projects">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return data.status && data.status === "active" && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
