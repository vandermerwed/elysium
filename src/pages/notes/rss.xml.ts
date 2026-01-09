import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET() {
  const posts = await getCollection("notes", ({ data }) => data.status && data.status === "published");

  return rss({
    title: `${SITE.title} - Notes`,
    description: "Garden notes on mindful productivity, tools for thought, and software patterns",
    site: SITE.website,
    items: posts.map(({ data, body, id }) => ({
      link: `notes/${id}`,
      title: data.title,
      description: data.description,
      content: sanitizeHtml(parser.render(body)),
      categories: data.tags,
      pubDate: new Date(data.pubDatetime),
    })),
  });
}
