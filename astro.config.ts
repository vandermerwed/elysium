import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import { getPermalinks } from "./src/plugins/wiki-link/getPermalinks.ts";
import rehypeExternalLinks from 'rehype-external-links';
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkWordCount } from './src/plugins/remark-word-count.mjs';
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    mdx()
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkModifiedTime,
      remarkReadingTime,
      remarkWordCount,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
      // https://github.com/datopian/portaljs/tree/main/packages/remark-wiki-link
      [remarkWikiLink, { 
        permalinks: getPermalinks("src/content/"),
        pathFormat: 'obsidian-absolute', 
        // generate url of the linked page.
        // here `slug` would be "Page Name" for wiki link [[Page Name]].
        // TODO: This needs refactoring to be more robust
        wikiLinkResolver: (slug: string) => {
          if (slug.startsWith("tags/")) {
            return [`tags/${slug.replace("tags/", "")}`];
          } else if (slug.startsWith("projects/")) {
            return [`projects/${slug.replace("projects/", "")}`];
          } else {
            if (slug.endsWith(".mdx")) {
              slug = slug.replace(".mdx", "");
            }
            return [`notes/${slug}`];
          }
        } 
      }]
    ],
    rehypePlugins: [
      [
        // https://github.com/rehypejs/rehype-external-links
        rehypeExternalLinks,
        {
          // content: { type: 'text', value: ' 🔗' },
          properties: { className: ['external-link'] },
          target: '_blank',
          rel: ['noopener', 'nofollow']
        }
      ],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      // theme: "one-dark-pro",
      themes: { light: "one-light", dark: "one-dark-pro" },
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});
