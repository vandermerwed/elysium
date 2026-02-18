import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { buildNoteGraph } from "./noteGraph";
import type Graph from "graphology";

type AnyPost = CollectionEntry<"notes" | "writing" | "journal" | "projects">;

let cachedGraph: Graph | null = null;
let cachedAllPosts: AnyPost[] | null = null;
let cachedCollections: {
  notes: CollectionEntry<"notes">[];
  writing: CollectionEntry<"writing">[];
  journal: CollectionEntry<"journal">[];
  projects: CollectionEntry<"projects">[];
} | null = null;

async function ensureBuild() {
  if (cachedGraph) return;

  const [notes, writing, journal, projects] = await Promise.all([
    getCollection("notes"),
    getCollection("writing"),
    getCollection("journal"),
    getCollection("projects"),
  ]);

  cachedCollections = { notes, writing, journal, projects };
  cachedAllPosts = [...notes, ...writing, ...journal, ...projects];
  cachedGraph = buildNoteGraph(cachedAllPosts);
}

export async function getSharedGraph(): Promise<Graph> {
  await ensureBuild();
  return cachedGraph!;
}

export async function getAllPosts(): Promise<AnyPost[]> {
  await ensureBuild();
  return cachedAllPosts!;
}

export async function getCollections() {
  await ensureBuild();
  return cachedCollections!;
}
