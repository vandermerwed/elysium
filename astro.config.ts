import { defineConfig } from "astro/config";
import fs from "fs";
import path from "path";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import remarkWikiLink from "./src/plugins/wiki-link/index.ts";
import { remarkNexusScore } from "./src/plugins/nexus-score/index.ts";
import { getPermalinks, getTitleMap } from "./src/plugins/wiki-link/getPermalinks.ts";
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from "unist-util-visit";
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkTufteFootnotes } from "./src/plugins/remark-tufte-footnotes.mjs";
import remarkGfm from "remark-gfm";
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
      // Ensure GFM features (including footnotes) are parsed first
      remarkGfm,
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
        titleMap: getTitleMap("src/content/"),
        pathFormat: 'obsidian-absolute',
        // generate url of the linked page.
        // here `slug` would be "Page Name" for wiki link [[Page Name]].
        // TODO: This needs refactoring to be more robust
        wikiLinkResolver: (id: string) => {
          const normalizedId = id.replace(/\\/g, "/");
          const cleanedId = path.posix
            .normalize(normalizedId)
            .replace(/^(\.\.\/)+/, "")
            .replace(/^\.\//, "");
          if (cleanedId.startsWith("tags/")) {
            return [`tags/${cleanedId.replace("tags/", "")}`];
          }
          if (cleanedId.startsWith("projects/")) {
            return [`projects/${cleanedId.replace("projects/", "")}`];
          }
          let resolvedId = cleanedId;
          if (resolvedId.endsWith(".mdx")) {
            resolvedId = resolvedId.replace(".mdx", "");
          }
          return [`notes/${resolvedId}`];
        }
      }],
      remarkNexusScore,
      remarkTufteFootnotes,
    ],
    rehypePlugins: [
      () => (tree) => {
        visit(tree, "element", (node) => {
          if (node.tagName !== "img") return;
          const src = node.properties?.src;
          if (typeof src !== "string") return;
          if (!src.startsWith("/notes/media/")) return;
          node.properties.src = src.replace(/^\/notes\/media\//, "/media/");
        });
      },
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
    plugins: [
      (() => {
        const mediaDir = path.resolve("src/content/media");
        const mimeTypes: Record<string, string> = {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".webp": "image/webp",
          ".svg": "image/svg+xml",
          ".avif": "image/avif",
          ".bmp": "image/bmp",
          ".ico": "image/x-icon",
          ".pdf": "application/pdf",
        };

        let outDir = "dist";

        return {
          name: "astro-media-proxy",
          configResolved(config: { build?: { outDir?: string } }) {
            if (config.build?.outDir) {
              outDir = config.build.outDir;
            }
          },
          configureServer(server: { middlewares: any }) {
            server.middlewares.use("/media", (req: { url?: string }, res: any, next: () => void) => {
              const url = req.url ? new URL(req.url, "http://localhost").pathname : "/";
              const filePath = path.resolve(mediaDir, "." + decodeURIComponent(url));

              if (!filePath.startsWith(mediaDir)) return next();
              if (!fs.existsSync(filePath)) return next();
              if (fs.statSync(filePath).isDirectory()) return next();

              const ext = path.extname(filePath).toLowerCase();
              const mime = mimeTypes[ext] ?? "application/octet-stream";
              res.setHeader("Content-Type", mime);
              res.setHeader("Cache-Control", "no-cache");
              fs.createReadStream(filePath).pipe(res);
            });
          },
          closeBundle() {
            if (!fs.existsSync(mediaDir)) return;
            const destDir = path.resolve(outDir, "media");
            fs.mkdirSync(destDir, { recursive: true });
            fs.cpSync(mediaDir, destDir, { recursive: true });
          },
        };
      })(),
    ],
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentIntellisense: true,
  },
});
