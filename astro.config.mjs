import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import rehypeExternalLinks from 'rehype-external-links';
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://danielvandermerwe.com/",
  // replace this with your deployed domain
  integrations: [
    tailwind({
        applyBaseStyles: false
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
      [remarkCollapse, {
        test: "Table of contents"
      }],
      // https://github.com/datopian/portaljs/tree/main/packages/remark-wiki-link
      [wikiLinkPlugin, { 
        pathFormat: 'obsidian-absolute', 
        // generate url of the linked page.
        // here `slug` would be "Page Name" for wiki link [[Page Name]].
        // TODO: This needs refactoring to be more robust
        wikiLinkResolver: (slug) => {
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
      theme: "one-dark-pro",
      wrap: true
    },
    extendDefaultPlugins: true
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"]
    }
  },
  scopedStyleStrategy: "where"
}); 
                      