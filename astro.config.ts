import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import { remarkNexusScore } from "./src/plugins/nexus-score/index.ts";
import { getPermalinks } from "./src/plugins/wiki-link/getPermalinks.ts";
import rehypeExternalLinks from 'rehype-external-links';
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkTufteFootnotes } from "./src/plugins/remark-tufte-footnotes.mjs";
// import { remarkWordCount } from './src/plugins/remark-word-count.mjs';
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
      // remarkWordCount,
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
        wikiLinkResolver: (id: string) => {
          if (id.startsWith("tags/")) {
            return [`tags/${id.replace("tags/", "")}`];
          } else if (id.startsWith("projects/")) {
            return [`projects/${id.replace("projects/", "")}`];
          } else {
            if (id.endsWith(".mdx")) {
              id = id.replace(".mdx", "");
            }
            return [`notes/${id}`];
          }
        } 
      }],
      remarkNexusScore,
      remarkTufteFootnotes,
    ],
    rehypePlugins: [
      [
        // https://github.com/rehypejs/rehype-external-links
        rehypeExternalLinks,
        {
          // content: { type: 'text', value: ' ⎋' },
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
      // themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentIntellisense: true,
  },
});
