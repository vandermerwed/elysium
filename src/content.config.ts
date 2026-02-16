import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Content status - draft/ready/release used by deploy script, published is live
const contentStatusEnum = z.enum(["draft", "ready", "release", "published"]);
const projectStatusEnum = z.enum(["active", "stable", "archived"]);

// Collection-specific types (folder determines main classification)
const notesTypeEnum = z.enum(["exploration"]); // Expandable for future note types
const journalTypeEnum = z.enum(["loadout", "theme", "life"]); // Sub-types for journal entries

const baseContentSchema = ({ image }: { image: any }) =>
  z.object({
    author: z.string().default(SITE.author),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    title: z.string(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    aiUsage: z.array(z.string()).default(["none"]),
    ogImage: image()
      .refine((img: any) => img.width >= 1200 && img.height >= 630, {
        message: "OpenGraph image must be at least 1200 X 630 pixels!",
      })
      .or(z.string())
      .optional(),
    description: z.string(),
    canonicalURL: z.string().optional(),
    status: contentStatusEnum.optional(),
    readingTime: z.string().optional(),
    wordCount: z.number().default(0),
    inspiration: z
      .object({
        title: z.string(),
        url: z.string(),
        author: z.string().optional(),
      })
      .optional(),
    prototypeUrl: z.string().optional(),
    prototypeType: z.enum(["v0", "codepen", "figma", "custom"]).optional(),
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
  });

// Notes: Digital garden content - NexusScore handles progression automatically
// Type field for special UI treatment (e.g., explorations with prototypes)
const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: ({ image }: { image: any }) =>
    baseContentSchema({ image }).extend({
      type: notesTypeEnum.optional(), // exploration, or omit for regular notes
    }),
});

// Writing: Published articles - no type/progression needed
const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: baseContentSchema,
});

// Journal: Life stuff - optional sub-type for loadouts, themes, etc.
const journal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/journal" }),
  schema: ({ image }: { image: any }) =>
    baseContentSchema({ image }).extend({
      type: journalTypeEnum.optional(), // loadout, theme, or omit for general journal
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }: { image: any }) =>
    baseContentSchema({ image }).extend({
      pubDatetime: z.date().optional(),
      status: projectStatusEnum.optional(),
      startDate: z.date(),
      endDate: z.date().optional().nullable(),
      hidden: z.boolean().optional(),
      year: z.number().optional(),
      techStack: z.array(z.string()).optional(),
      category: z
        .array(z.enum(["open-source", "tool", "theme", "experiment", "podcast"]))
        .optional(),
      links: z
        .object({
          demo: z.string().optional(),
          github: z.string().optional(),
          website: z.string().optional(),
          spotify: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { notes, writing, journal, projects };
