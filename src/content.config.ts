import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      publishStatus: z.enum(['draft', 'ready', 'published']).optional(),
      tags: z.array(z.string()).default(["others"]),
      aiUsage: z.array(z.string()).default(["none"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      readingTime: z.string().optional(),
      wordCount: z.number().default(0),
      incomingLinks: z
        .array(
          z.object({
            id: z.string(),
            frontmatter: z.object({}).optional(),
          })
        )
        .default([]),
      outgoingLinks: z
        .array(
          z.object({
            id: z.string(),
            frontmatter: z.object({}).optional(),
          })
        )
        .default([]),
      externalLinks: z.array(z.string()).default([]),
      nexusScore: z.string().default("A0"),
      editPost: z
        .object({
          disabled: z.boolean().optional(),
          url: z.string().optional(),
          text: z.string().optional(),
          appendFilePath: z.boolean().optional(),
        })
        .optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      aiUsage: z.array(z.string()).default(["none"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      type: z.string().optional(),
      status: z.enum(['future', 'active', 'archived']).optional(),
      readingTime: z.string().optional(),
      wordCount: z.number().default(0),
      incomingLinks: z
        .array(
          z.object({
            id: z.string(),
            frontmatter: z.object({}).optional(),
          })
        )
        .default([]),
      outgoingLinks: z
        .array(
          z.object({
            id: z.string(),
            frontmatter: z.object({}).optional(),
          })
        )
        .default([]),
      externalLinks: z.array(z.string()).default([]),
      nexusScore: z.string().default("A0"),
      editPost: z
        .object({
          disabled: z.boolean().optional(),
          url: z.string().optional(),
          text: z.string().optional(),
          appendFilePath: z.boolean().optional(),
        })
        .optional(),
    }),
});

export const collections = { blog, projects };
