import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET() {
  const posts = await getCollection("journal", ({ data }) => data.status && data.status === "published");

  return rss({
    title: `${SITE.title} - Journal`,
    description: "Personal updates, themes, and life logs",
    site: SITE.website,
    items: posts.map(({ data, body, id }) => ({
      link: `journal/${id}`,
      title: data.title,
      description: data.description,
      content: sanitizeHtml(parser.render(body)),
      categories: data.tags,
      pubDate: new Date(data.pubDatetime),
    })),
  });
}
