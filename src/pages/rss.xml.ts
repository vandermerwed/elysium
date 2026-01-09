import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@utils/getSortedPosts";
import { SITE } from "@config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET() {
  // Get all collections
  const notes = await getCollection("notes", ({ data }) => data.status && data.status === "published");
  const writing = await getCollection("writing", ({ data }) => data.status && data.status === "published");
  const life = await getCollection("life", ({ data }) => data.status && data.status === "published");

  // Map each collection to RSS items with correct links
  const notesItems = notes.map(({ data, body, id }) => ({
    link: `notes/${id}`,
    title: data.title,
    description: data.description,
    content: sanitizeHtml(parser.render(body)),
    categories: data.tags,
    pubDate: new Date(data.pubDatetime),
  }));

  const writingItems = writing.map(({ data, body, id }) => ({
    link: `writing/${id}`,
    title: data.title,
    description: data.description,
    content: sanitizeHtml(parser.render(body)),
    categories: data.tags,
    pubDate: new Date(data.pubDatetime),
  }));

  const lifeItems = life.map(({ data, body, id }) => ({
    link: `life/${id}`,
    title: data.title,
    description: data.description,
    content: sanitizeHtml(parser.render(body)),
    categories: data.tags,
    pubDate: new Date(data.pubDatetime),
  }));

  // Combine and sort all items by date
  const allItems = [...notesItems, ...writingItems, ...lifeItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: allItems,
  });
}
