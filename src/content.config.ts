import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const contentStatusEnum = z.enum(["draft", "ready", "release", "published"]);
const projectStatusEnum = z.enum(["active", "stable", "archived"]);
const contentTypeEnum = z.enum([
  "project",
  "exploration",
  "essay",
  "note",
  "journal",
  "loadout",
  "theme",
  "fragment",
]);

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
    type: contentTypeEnum.optional(),
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

const createContentSchema = (statusEnum: z.ZodEnum<any>) => {
  return ({ image }: { image: any }) =>
    baseContentSchema({ image }).extend({ status: statusEnum.optional() });
};

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: createContentSchema(contentStatusEnum),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: createContentSchema(contentStatusEnum),
});

const journal = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/journal" }),
  schema: createContentSchema(contentStatusEnum),
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
        .array(z.enum(["open-source", "tool", "theme", "experiment"]))
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
