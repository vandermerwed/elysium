import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@utils/getSortedPosts";
import { SITE } from "@config";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts, SITE.blogContentTypes);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, body, slug }) => ({
      link: `notes/${slug}`,
      title: data.title,
      description: data.description,
      // Note: this will not process components or JSX expressions in MDX files.
      content: sanitizeHtml(parser.render(body)),
      categories: data.tags,
      pubDate: new Date(data.pubDatetime),
    })),
  });
}
