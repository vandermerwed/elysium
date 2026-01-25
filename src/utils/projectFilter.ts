import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

const postFilter = ({ data }: CollectionEntry<"projects">) => {
  if (data.hidden) return false;
  const isPublishTimePassed =
    Date.now() >
    new Date(data.startDate ?? data.pubDatetime ?? Date.now()).getTime() -
      SITE.scheduledPostMargin;
  const allowedStatuses = new Set(["active", "stable", "archived"]);
  const statusOk = !data.status || allowedStatuses.has(data.status);
  return statusOk && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
