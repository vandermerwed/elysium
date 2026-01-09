import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET() {
  const posts = await getCollection("writing", ({ data }) => data.status && data.status === "published");

  return rss({
    title: `${SITE.title} - Writing`,
    description: "Longer pieces on productivity, technology, and software development",
    site: SITE.website,
    items: posts.map(({ data, body, id }) => ({
      link: `writing/${id}`,
      title: data.title,
      description: data.description,
      content: sanitizeHtml(parser.render(body)),
      categories: data.tags,
      pubDate: new Date(data.pubDatetime),
    })),
  });
}
