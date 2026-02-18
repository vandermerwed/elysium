# Elysium Design Overhaul — Implementation Plan

> Generated from DESIGN-SPEC.md with user input on 2026-02-10.
> Branch: `feature/design-overhaul`

---

## Decisions & Constraints

| Decision | Choice |
|---|---|
| Scope | Full spec, all phases |
| Fonts | Self-hosted woff2 (JetBrains Mono + Inter) |
| Marginalia | All real data (position index, content hash, revision count) |
| Tag browser | Visual update only — no interactive filter rebuild |
| Cards | Migrate from React `.tsx` to Astro `.astro`, one per content type |
| Garden Status | Yes, include on `/notes` page |
| About page | Keep current MDX prose, apply new tokens only |
| Logo | Switch to `◆` diamond unicode symbol |
| Note graph | Introduce `graphology` at build time — fix NexusScore bug, replace brute-force link scanning, enable real centrality metrics |

### Architecture Constraints (preserve)

- Keep `skin-*` Tailwind token pattern with `withOpacity()` helper
- Keep all content collection schemas unchanged
- Keep NexusScore SVGs as-is (topology icons)
- Keep margin notes system (restyle, don't restructure)
- Keep view transitions (`transition:name` on titles)
- Keep `[data-theme]` toggle mechanism

### Known Bug (fixed in this overhaul)

The current `remarkNexusScore` plugin computes NexusScore per-post during remark rendering. At that point it only has access to outgoing links (from the AST). Incoming links are computed separately by `getIncomingLinks()` at the page level via brute-force regex scanning — but that data **never feeds back into the NexusScore calculation**. This means:
- `incomingLinks` is always `[]` during scoring
- Topology classification (Hub/Relay/Terminal) based on in/out ratio is broken — everything defaults to `H_` (hybrid) or `T_` (terminal)
- The fix: build a full graph with `graphology` at build time, compute real in-degree/out-degree, then derive NexusScore from the graph

modDatetime: 2026-02-17T11:08:13Z
---

## Phase 1 — Foundation (Design Tokens, Fonts, Config)

**Goal**: New colours, fonts, and spacing tokens. Site looks "different" but structure is identical.

### 1.1 Download self-hosted font files

Create `public/fonts/` and add:

```
public/fonts/JetBrainsMono-Regular.woff2   (400)
public/fonts/JetBrainsMono-Medium.woff2    (500)
public/fonts/JetBrainsMono-SemiBold.woff2  (600)
public/fonts/Inter-Regular.woff2           (400)
public/fonts/Inter-Medium.woff2            (500)
```

Source: JetBrains Mono GitHub releases, Inter GitHub releases — extract woff2 from release zips.

### 1.2 Add `@font-face` declarations

**File**: `src/styles/base.css` — add at the very top, before `@tailwind base;`:

```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}
```

**File**: `src/layouts/Layout.astro` — add font preloads in `<head>`:

```html
<link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin />
```

Remove all commented-out Google Font `<link>` tags.

### 1.3 Update colour tokens

**File**: `src/styles/base.css` — replace all RGB values in `:root`:

| Variable | Light (current) | Light (new) |
|---|---|---|
| `--light-fill` | `255, 255, 254` | `252, 251, 250` |
| `--light-color` | `55, 65, 81` | `107, 114, 128` |
| `--light-text-base` | `43, 40, 49` | `43, 40, 49` *(keep)* |
| `--light-accent` | `231, 93, 14` | `232, 84, 37` |
| `--light-accent-secondary` | `0, 166, 113` | `16, 163, 127` |
| `--light-card` | `230, 230, 230` | `245, 244, 242` |
| `--light-card-muted` | `205, 205, 205` | `235, 234, 232` |
| `--light-border` | `236, 233, 233` | `229, 228, 226` |
| `--light-border-muted` | `205, 205, 205` | `214, 213, 211` |

| Variable | Dark (current) | Dark (new) |
|---|---|---|
| `--dark-fill` | `37, 36, 38` | `24, 24, 27` |
| `--dark-color` | `240, 246, 248` | `161, 161, 170` |
| `--dark-text-base` | `240, 246, 248` | `244, 244, 245` |
| `--dark-accent` | `232, 84, 37` | `239, 103, 55` |
| `--dark-accent-secondary` | `0, 161, 96` | `45, 180, 140` |
| `--dark-card` | `59, 58, 60` | `39, 39, 42` |
| `--dark-card-muted` | `138, 51, 2` | `50, 50, 54` |
| `--dark-border` | `80, 82, 83` | `63, 63, 70` |
| `--dark-border-muted` | `138, 51, 2` | `82, 82, 91` |

> Note: `--dark-card-muted` and `--dark-border-muted` are currently brown — likely a bug. Fixing to neutral grays.

### 1.4 Add new CSS custom properties

**File**: `src/styles/base.css` — add after `--breakpoint-margin-notes`:

```css
/* Font stacks */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', ui-monospace, monospace;
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* Spacing tokens */
--space-section: clamp(4rem, 10vh, 8rem);
--space-block: 2rem;
--space-element: 1rem;
--space-tight: 0.5rem;

/* Container widths */
--container-prose: 65ch;
--container-content: 48rem;
--container-wide: 64rem;
--gutter: clamp(1rem, 5vw, 2rem);

/* Transition tokens */
--transition-fast: 100ms ease;
--transition-base: 150ms ease;
--transition-slow: 300ms ease;
```

### 1.5 Update Tailwind config

**File**: `tailwind.config.cjs`

- **Font families**: `mono` → `["JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", "ui-monospace", "monospace"]`, `sans` → `["Inter", "system-ui", "-apple-system", "sans-serif"]`
- **Breakpoints**: Add `md: "768px"` and `xl: "1280px"` to `screens`
- Keep all existing `skin-*` token definitions unchanged

### 1.6 Update global link styles

**File**: `src/styles/base.css` — replace `a { ... }` block:

```css
a {
  text-decoration-line: underline;
  text-decoration-style: dashed;
  text-decoration-color: rgb(var(--color-border-muted));
  text-underline-offset: 4px;
  transition: color var(--transition-base), text-decoration-color var(--transition-base);
}
a:hover {
  color: rgb(var(--color-accent));
  text-decoration-color: rgb(var(--color-accent));
}
a:focus-visible {
  outline: 2px dashed rgb(var(--color-accent));
  outline-offset: 2px;
  text-decoration: none;
}
```

Update `.prose a` styles to not conflict.

### 1.7 Make heading uppercase contextual

**File**: `src/styles/base.css` — change `h1, h2, h3, h4, h5, h6 { @apply font-mono uppercase; }` to `h1, h2, h3, h4, h5, h6 { @apply font-mono; }`. Uppercase will be applied contextually via section headers.

### 1.8 Enable `remarkWordCount` plugin

**File**: `astro.config.ts` — uncomment the `remarkWordCount` import and add it to the remark plugins array. This populates `remarkPluginFrontmatter.wordCount` for marginalia.

### Testing checkpoint

Run `npm run dev`. Verify: new colours/fonts render, dark mode toggle works, margin notes display, NexusScore icons appear. Structural layout unchanged.

---

## Phase 2 — Utility Functions

**Goal**: Build-time helpers consumed by cards, footer, and detail pages. Zero visual impact — pure prerequisites.

### 2.1 Create `src/utils/marginalia.ts`

```typescript
import type { CollectionEntry } from "astro:content";

type CollectionName = "notes" | "writing" | "journal" | "projects";

/** Position in date-sorted collection. Newest = :001. */
export function getPositionIndex(
  postId: string,
  sortedPosts: CollectionEntry<CollectionName>[]
): string {
  const index = sortedPosts.findIndex(p => p.id === postId);
  if (index === -1) return ":000";
  return `:${String(index + 1).padStart(3, "0")}`;
}

/** First 4 hex chars of a simple content hash. */
export function getContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = ((hash << 5) - hash) + content.charCodeAt(i);
    hash |= 0;
  }
  return `#${Math.abs(hash).toString(16).slice(0, 4)}`;
}

/** 2847 → "2.8k words", 532 → "532 words" */
export function formatWordCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k words`;
  return `${count} words`;
}

/** "5 min read" → "5 min" */
export function formatReadingTime(readingTime: string): string {
  return readingTime.replace(" read", "");
}

/** Date → "YYYY.MM.DD" */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** startDate → "2y4m" age string */
export function formatProjectAge(startDate: Date): string {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years > 0) return `${years}y${months}m`;
  return `${months}m`;
}
```

### 2.2 Create `src/utils/buildInfo.ts`

```typescript
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

/** Git short hash. Falls back to "dev". */
export function getGitHash(): string {
  try { return execSync("git rev-parse --short HEAD").toString().trim(); }
  catch { return "dev"; }
}

/** package.json version string. */
export function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf-8"));
    return pkg.version ?? "0.0.0";
  } catch { return "0.0.0"; }
}

/** "YYYY.MM.DD HH:MM UTC" build timestamp. */
export function getBuildTimestamp(): string {
  const n = new Date();
  return `${n.getUTCFullYear()}.${String(n.getUTCMonth()+1).padStart(2,"0")}.${String(n.getUTCDate()).padStart(2,"0")} ${String(n.getUTCHours()).padStart(2,"0")}:${String(n.getUTCMinutes()).padStart(2,"0")} UTC`;
}
```

### 2.3 Create `src/utils/gardenStats.ts`

Aggregates NexusScore data for the Garden Status panel.

```typescript
import type { CollectionEntry } from "astro:content";

export interface GardenStats {
  total: number;
  byStage: { developed: number; emerging: number; seedling: number };
  byTopology: { hubs: number; relays: number; terminals: number };
  totalLinks: number;
  avgLinksPerNote: number;
  mostConnected: { title: string; linkCount: number } | null;
  lastUpdated: { title: string; date: Date } | null;
}

export function computeGardenStats(notes: CollectionEntry<"notes">[]): GardenStats {
  // Maps NexusScore strings to stage/topology buckets
  // Fragment/Basic → seedling, Developed → emerging, Advanced/Integrated → developed
  // H_ → hubs, R_ → relays, T_ → terminals
  // Counts total links from incomingLinks + outgoingLinks arrays
  // Tracks most-connected note and most-recently-modified note
  // ... (full implementation in step)
}
```

### Testing checkpoint

Import utilities in a test page frontmatter — verify they resolve and return expected data.

---

## Phase 2.5 — Note Graph (graphology)

**Goal**: Replace the brute-force link scanning system with a proper directed graph built once at build time. Fix the NexusScore bug where incoming links are always empty during scoring. Enable real graph metrics for topology classification, GardenStatus, and future features.

### Why graphology

- **Zero bundle impact** — runs only at build time in Node, never shipped to browser
- **~15KB gzipped** core library — lightweight
- **Rich algorithm ecosystem** — `graphology-metrics` for centrality/PageRank, `graphology-communities-louvain` for cluster detection
- **Handles scale** — trivial for ~31 notes, but ready if the garden grows to hundreds

### 2.5.1 Install dependencies

```bash
npm install graphology graphology-metrics graphology-types
```

Optional (can add later): `graphology-communities-louvain` for auto-topic-clustering.

### 2.5.2 Create `src/utils/noteGraph.ts`

**New file**: Central module that builds and queries the note graph.

```typescript
import Graph from "graphology";
import { degreeCentrality, betweennessCentrality } from "graphology-metrics/centrality";
import pagerank from "graphology-metrics/centrality/pagerank";
import type { CollectionEntry } from "astro:content";

type AnyPost = CollectionEntry<"notes" | "writing" | "journal" | "projects">;

export interface NodeMetrics {
  inDegree: number;          // number of posts linking TO this post
  outDegree: number;         // number of posts this post links TO
  externalLinkCount: number; // non-internal links
  betweenness: number;       // how often this node bridges shortest paths
  pageRank: number;          // importance based on who links to you
  topology: "H" | "R" | "T"; // Hub / Relay / Terminal
  wordCount: number;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  density: number;           // actual edges / possible edges
  components: number;        // number of connected components
  orphans: number;           // nodes with degree 0
}

/**
 * Build a directed graph from all content collections.
 *
 * Nodes = all posts (keyed by `{collection}/{id}`)
 * Edges = wikilink references ([[target]]) extracted from post bodies
 *
 * This runs ONCE at build time and the resulting graph is queried
 * by pages, cards, NexusScore, and GardenStatus.
 */
export function buildNoteGraph(allPosts: AnyPost[]): Graph {
  const graph = new Graph({ type: "directed", multi: false });

  // 1. Add all posts as nodes
  for (const post of allPosts) {
    const nodeId = `${post.collection}/${post.id}`;
    graph.addNode(nodeId, {
      title: post.data.title,
      collection: post.collection,
      id: post.id,
      wordCount: post.data.wordCount ?? 0,
    });
  }

  // 2. Parse wikilinks from each post's body and add edges
  for (const post of allPosts) {
    const sourceId = `${post.collection}/${post.id}`;
    const body = post.body ?? "";

    // Extract [[wikilink]] and [[wikilink|alias]] references
    const wikilinks = body.match(/(?<=\[\[)(.*?)(?=\]\])/g) ?? [];
    for (const raw of wikilinks) {
      const target = normalizeWikilink(raw);
      // Resolve target to a node in the graph
      const targetNodeId = resolveTarget(target, allPosts, graph);
      if (targetNodeId && targetNodeId !== sourceId && !graph.hasEdge(sourceId, targetNodeId)) {
        graph.addEdge(sourceId, targetNodeId);
      }
    }

    // Count external links (stored as node attribute, not graph edges)
    const externalLinks = body.match(/\[.*?\]\(https?:\/\/[^)]+\)/g) ?? [];
    graph.setNodeAttribute(sourceId, "externalLinkCount", externalLinks.length);
  }

  return graph;
}

/**
 * Normalize a raw wikilink string: strip alias, path prefixes, extensions.
 */
function normalizeWikilink(raw: string): string {
  return raw
    .split("|")[0]
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\.\//, "")
    .replace(/\.mdx?$/, "")
    .replace(/^\//, "")
    .trim();
}

/**
 * Resolve a wikilink target to a graph node ID.
 * Tries: exact match, collection-prefixed match, bare id match.
 */
function resolveTarget(target: string, allPosts: AnyPost[], graph: Graph): string | null {
  // Try direct: "notes/my-note"
  if (graph.hasNode(target)) return target;

  // Try with each collection prefix
  for (const collection of ["notes", "writing", "journal", "projects"]) {
    const candidate = `${collection}/${target}`;
    if (graph.hasNode(candidate)) return candidate;
  }

  // Try bare id match against all nodes
  for (const post of allPosts) {
    if (post.id === target || post.id.endsWith(`/${target}`)) {
      return `${post.collection}/${post.id}`;
    }
  }

  return null; // Broken link — target doesn't exist
}

/**
 * Get metrics for a single node.
 */
export function getNodeMetrics(graph: Graph, nodeId: string): NodeMetrics {
  const inDeg = graph.inDegree(nodeId);
  const outDeg = graph.outDegree(nodeId);
  const externalLinkCount = graph.getNodeAttribute(nodeId, "externalLinkCount") ?? 0;
  const wordCount = graph.getNodeAttribute(nodeId, "wordCount") ?? 0;

  // Compute betweenness and pagerank for this node
  // (These are computed across the full graph — cached on first call)
  const bCentrality = betweennessCentrality(graph);
  const pr = pagerank(graph);

  const totalDegree = inDeg + outDeg;
  let topology: "H" | "R" | "T" = "H";
  if (totalDegree > 0) {
    const inRatio = inDeg / totalDegree;
    if (inRatio > 0.6) topology = "R";       // Receiver — mostly linked TO
    else if (inRatio < 0.4) topology = "T";  // Transmitter — mostly links OUT
    else topology = "H";                      // Hub — balanced
  }

  return {
    inDegree: inDeg,
    outDegree: outDeg,
    externalLinkCount,
    betweenness: bCentrality[nodeId] ?? 0,
    pageRank: pr[nodeId] ?? 0,
    topology,
    wordCount,
  };
}

/**
 * Get incoming link post IDs for a node (replaces getIncomingLinks utility).
 */
export function getIncomingLinkIds(graph: Graph, nodeId: string): string[] {
  if (!graph.hasNode(nodeId)) return [];
  return graph.inNeighbors(nodeId);
}

/**
 * Get outgoing link post IDs for a node.
 */
export function getOutgoingLinkIds(graph: Graph, nodeId: string): string[] {
  if (!graph.hasNode(nodeId)) return [];
  return graph.outNeighbors(nodeId);
}

/**
 * Compute aggregate stats for the full graph (for GardenStatus / footer).
 */
export function getGraphStats(graph: Graph): GraphStats {
  const nodeCount = graph.order;
  const edgeCount = graph.size;
  const orphans = graph.filterNodes((_, attr) =>
    graph.degree(_) === 0
  ).length;

  return {
    nodeCount,
    edgeCount,
    avgDegree: nodeCount > 0 ? Math.round((edgeCount * 2 / nodeCount) * 10) / 10 : 0,
    density: nodeCount > 1 ? edgeCount / (nodeCount * (nodeCount - 1)) : 0,
    components: 0, // Can compute with graphology-components if needed
    orphans,
  };
}
```

### 2.5.3 Refactor `getNexusScore.ts` to use graph metrics

**File**: `src/utils/getNexusScore.ts`

Current function takes a `NexusScoreInput` with link arrays and word count. Refactor to accept `NodeMetrics` from the graph instead:

```typescript
import type { NodeMetrics } from "./noteGraph";

export function computeNexusScore(metrics: NodeMetrics): string {
  const {
    inDegree, outDegree, externalLinkCount, wordCount, topology,
    betweenness, pageRank,
  } = metrics;

  // Weighted score — now uses REAL incoming links
  const incomingScore = inDegree * 10;
  const outgoingScore = outDegree * 5;
  const externalScore = externalLinkCount * 2;
  const wordScore = wordCount * 0.02;
  const betweennessBonus = betweenness * 50;  // Reward bridge nodes
  const pageRankBonus = pageRank * 100;        // Reward important nodes

  const totalScore = incomingScore + outgoingScore + externalScore
    + wordScore + betweennessBonus + pageRankBonus;

  // Map score to maturity stage
  let stage: string;
  if (totalScore <= 10) stage = "Fragment";
  else if (totalScore <= 26) stage = "Basic";
  else if (totalScore <= 42) stage = "Developed";
  else if (totalScore <= 68) stage = "Advanced";
  else stage = "Integrated";

  return `${topology}_${stage}`;
}
```

Keep the old `getNexusScore` function as a fallback / for backward compat during transition.

### 2.5.4 Refactor `remarkNexusScore` plugin

**File**: `src/plugins/nexus-score/index.ts`

The remark plugin currently tries to compute NexusScore per-post during rendering — but it can't see incoming links. Two options:

**Option A (recommended)**: Simplify the remark plugin to only extract outgoing links, external links, and word count. Store them in frontmatter. Compute NexusScore separately AFTER building the graph. This means NexusScore is no longer set by the remark plugin — it's computed in `getPostsWithEnrichedFrontmatter` or in a new build step.

**Option B**: Keep the remark plugin as-is for outgoing/external/wordcount, but override `nexusScore` later when graph data is available.

Recommended approach (Option A):
1. Rename plugin to `remarkContentMetrics` — it extracts `wordCount`, `outgoingLinks`, `externalLinks`
2. Remove NexusScore computation from the plugin
3. NexusScore is computed post-graph-build and injected via `getPostsWithEnrichedFrontmatter`

### 2.5.5 Update `getPostsWithEnrichedFrontmatter.ts`

**File**: `src/utils/getPostsWithEnrichedFrontmatter.ts`

Extend to accept the graph and compute NexusScore per-post:

```typescript
import { buildNoteGraph, getNodeMetrics } from "./noteGraph";
import { computeNexusScore } from "./getNexusScore";

const getPostsWithEnrichedFrontmatter = async <T extends CollectionName>(
  posts: CollectionEntry<T>[],
  graph: Graph  // <-- new parameter
) => {
  return Promise.all(
    posts.map(async post => {
      const { remarkPluginFrontmatter } = await render(post);

      // Get graph-based metrics
      const nodeId = `${post.collection}/${post.id}`;
      const metrics = getNodeMetrics(graph, nodeId);
      const nexusScore = computeNexusScore(metrics);

      const enrichedData = {
        ...post.data,
        ...filteredFrontmatter,
        nexusScore,
        incomingLinks: getIncomingLinkIds(graph, nodeId),
        outgoingLinks: getOutgoingLinkIds(graph, nodeId),
      };

      return { ...post, data: enrichedData };
    })
  );
};
```

### 2.5.6 Update page-level `getIncomingLinks` calls

**Files**: `src/pages/notes/[id]/index.astro`, `src/pages/writing/[id]/index.astro`, `src/pages/journal/[id]/index.astro`, `src/pages/projects/[id]/index.astro`

Replace:
```typescript
import getIncomingLinks from "@utils/getIncomingLinks";
const incomingLinks = getIncomingLinks(backlinkSources, post.id, "notes");
```

With:
```typescript
import { buildNoteGraph, getIncomingLinkIds } from "@utils/noteGraph";
const graph = buildNoteGraph(allPosts);
const incomingNodeIds = getIncomingLinkIds(graph, `notes/${post.id}`);
const backlinks = incomingNodeIds.map(nodeId => {
  const [collection, ...idParts] = nodeId.split("/");
  const id = idParts.join("/");
  const post = allPosts.find(p => p.collection === collection && p.id === id);
  return { title: post.data.title, url: `/${collection}/${id}/`, ... };
});
```

> **Performance note**: `buildNoteGraph()` should ideally be called once and shared. In Astro SSG, each page's frontmatter runs independently. For ~31 notes this is fine — the graph builds in <50ms. If the garden grows large, consider caching the graph in a Vite virtual module or a shared build step.

### 2.5.7 Update `gardenStats.ts` to use graph

**File**: `src/utils/gardenStats.ts`

Instead of manually iterating notes and parsing NexusScore strings, `computeGardenStats` can now accept the graph directly:

```typescript
import type Graph from "graphology";
import { getGraphStats, getNodeMetrics } from "./noteGraph";

export function computeGardenStats(graph: Graph, notesCollection: string = "notes"): GardenStats {
  const stats = getGraphStats(graph);
  // Filter to notes collection nodes
  const noteNodes = graph.filterNodes((id) => id.startsWith(`${notesCollection}/`));
  // Compute per-node metrics and aggregate...
}
```

This gives access to betweenness centrality for identifying true hubs, orphan detection, and graph density — all real metrics instead of approximations.

### Files deprecated by graphology integration

| File | Status |
|---|---|
| `src/utils/getIncomingLinks.ts` | Replaced by `noteGraph.getIncomingLinkIds()` |
| `src/utils/getOutgoingLinks.ts` | Replaced by `noteGraph.getOutgoingLinkIds()` |
| `src/utils/getNexusScore.ts` | Refactored to accept `NodeMetrics` from graph |

### Testing checkpoint

1. Build the graph in a test page and log metrics for a few known notes
2. Verify incoming links are now non-empty for notes that are referenced by others
3. Verify NexusScore values change (they should — incoming links now contribute)
4. Verify backlinks still render correctly on detail pages
5. Run `npm run build` — no errors, graph builds successfully

---

## Phase 3 — Navigation & Footer

**Goal**: Redesign site chrome (header + footer). Affects every page immediately.

### 3.1 Redesign `src/components/Header.astro`

**Complete rewrite.** Key changes:

| Element | Current | New |
|---|---|---|
| Logo | Rocket SVG | `◆` unicode in `--accent` colour |
| Site name | "ELYSIUM" uppercase | "elysium" lowercase monospace |
| Nav links | `Journal`, `Writing` | `/journal`, `/writing` (prefixed, lowercase, mono) |
| Active state | Dashed underline | `color: --text-base` (inactive = `--color`) |
| Separator | `<Hr />` component | `1px solid --border` full-width line |
| Mobile menu | Dropdown grid | Full-screen overlay (`fixed inset-0 z-50 bg-fill`) |
| Height | Variable | ~64px, vertically centered |
| Background | None | None (keep) |

Preserve:
- `activeNav` prop interface
- `astro:after-swap` event listener
- Skip-to-content link
- Theme toggle (sun/moon SVGs)
- Search icon

### 3.2 Create `src/components/SectionHeader.astro`

Reusable `:: Title ─────────── [count]` pattern:

```astro
---
export interface Props {
  title: string;
  count?: number;
  lastUpdated?: Date;
}
---
<div class="section-header">
  <span class="section-prefix">::</span>
  <span class="section-title">{title}</span>
  <span class="section-rule" aria-hidden="true"></span>  <!-- CSS flex:1 + border-bottom -->
  {count !== undefined && <span class="section-count">[{count}]</span>}
</div>
```

Styling: monospace, uppercase, `--text-base`, rule fills remaining space via `flex: 1; border-bottom: 1px solid rgb(var(--color-border))`.

### 3.3 Redesign `src/components/Footer.astro`

**Complete rewrite.** New structure:

```
────────────────────────────────────────────────
  (c) 2026 Daniel van der Merwe

  changelog · source · tags · rss

  mail · github · linkedin · bsky
────────────────────────────────────────────────
  SYS ............ {N} notes · {N} essays · {N} projects
  BUILD .......... {timestamp} · v{version} · #{hash}
────────────────────────────────────────────────
```

Imports `getGitHash`, `getVersion`, `getBuildTimestamp` from `@utils/buildInfo`. Computes content counts via `getCollection()` in frontmatter.

Leader dots on SYS/BUILD lines via CSS: `flex: 1; border-bottom: 1px dotted` or repeated `·` characters.

### 3.4 Update `src/components/Hr.astro`

Keep `<hr>` for semantics. Update colour to `border-skin-line` consistently. Remove any `border-skin-line-muted` usage.

### Testing checkpoint

Every page gets new header/footer. Verify: mobile hamburger works, theme toggle works, SYS/BUILD lines show real data, view transitions fire after `astro:after-swap`.

---

## Phase 4 — Layout Components

**Goal**: Update container system and page-level layout primitives.

### 4.1 Update `src/layouts/Main.astro`

- Replace `<Breadcrumbs />` with nothing (breadcrumbs removed per spec)
- Replace `<h1>` + description pattern with `<SectionHeader>` component
- Keep `max-w-3xl` (= 48rem = `--container-content`)

### 4.2 Update list pages to pass count to SectionHeader

List pages (`writing/[...page].astro`, `notes/[...page].astro`, `journal/[...page].astro`) render `<SectionHeader title="Writing" count={totalPosts} />` directly rather than relying on Main's `pageTitle` prop.

### 4.3 Update `src/components/Pagination.astro`

- Replace SVG arrows with `←` / `→` unicode text
- Format: `← Previous` / `Page {current} of {total}` / `Next →`
- Monospace, minimal styling

### Testing checkpoint

List pages render with `:: Title ─── [count]` headers. Pagination navigates correctly.

---

## Phase 5 — Content Cards (React → Astro Migration)

**Goal**: Replace single `Card.tsx` with five content-type-specific Astro components.

### 5.1 Create `src/components/WritingCard.astro`

Per DESIGN-SPEC section 5.4.1.

```
Props: href, title, pubDatetime, modDatetime, description, wordCount, readingTime, positionIndex
```

Layout:
- Bordered card (`1px solid --border`, `bg --card`)
- Position index (`:003`) top-right, `text-xs`, `--color`
- Title `<h3>` monospace semibold
- Short `─` rule below title (~6ch)
- Metadata: `YYYY.MM.DD · mod YYYY.MM.DD · 2.8k words · 12 min` — monospace `text-sm --color`
- Description: max 3 lines with `line-clamp-3`
- Hover: `border-color` shifts to `--border-muted` only — no shadows/transforms
- `transition:name` on title for view transitions

### 5.2 Create `src/components/JournalCard.astro`

Per DESIGN-SPEC section 5.4.2. Similar to WritingCard but:
- Description BEFORE metadata
- No rule under title
- Lighter visual weight (thinner border or no background)
- Type badge: "Journal" or sub-type (Loadout, Theme)

### 5.3 Create `src/components/NoteCard.astro`

Per DESIGN-SPEC section 5.4.3. Compact single-row list item.

```
Props: href, title, pubDatetime, description, nexusScore, positionIndex, type, incomingLinks, outgoingLinks
```

Layout:
- Row: `[nexus icon] Title ......... Date :024 Note`
- Below: indented description (1 line, truncated), link counts `3↓ 5↑`
- NexusScore SVG icon at `scale-75`
- Type badge abbreviated: Note, Frag, Expl

### 5.4 Create `src/components/ProjectCard.astro`

Per DESIGN-SPEC section 5.4.4.

```
Props: href, title, description, status, techStack, startDate, version
```

Layout:
- `◇` prefix, title, leader dots → status indicator (`>>> ACTIVE` / `--- STABLE` / `... ARCHIVED`)
- Description below, indented
- Bottom: tech stack tags · age (`2y4m`) · revision
- `◇` fills to `◆` on hover
- Status colours: active=`--accent-secondary`, stable=`--color`, archived=`--color`+`opacity-60`

### 5.5 Create `src/components/ExplorationCard.astro`

Per DESIGN-SPEC section 5.4.5. Embed-first card:
- Prominent prototype area (`--card-muted` background)
- Title below embed area
- "Exploration" badge in `--accent-secondary`
- Reuses `EmbedPrototype.astro` or simplified version

### 5.6 Update all consuming pages

| Page | Old | New |
|---|---|---|
| `src/pages/index.astro` | `<Card>` everywhere | Appropriate card type per section |
| `src/pages/writing/[...page].astro` | `<Card>` | `<WritingCard>` |
| `src/pages/journal/[...page].astro` | `<Card>` | `<JournalCard>` |
| `src/pages/notes/[...page].astro` | `<Card>` | `<NoteCard>` |
| `src/layouts/Projects.astro` | `<Card>` | `<ProjectCard>` |

Each page computes `positionIndex` in frontmatter via `getPositionIndex(post.id, sortedPosts)`.

### 5.7 Deprecate `src/components/Card.tsx`

Add `@deprecated` JSDoc. Do NOT delete yet — remove after all pages are migrated and tested.

### Testing checkpoint

All list pages and homepage render with new card designs. Verify: pagination works, nexus icons show on notes, view transitions fire, content type filter on /notes functions, `data-content-type` attributes preserved on NoteCard.

---

## Phase 6 — Detail Pages

**Goal**: Redesign post/project detail page headers.

### 6.1 Update `src/layouts/PostDetails.astro`

Major changes:

| Element | Current | New |
|---|---|---|
| Back button | `<button onclick="history.back()">Go back</button>` | `<a href="/{basePath}/">← {basePath}</a>` (real link) |
| Position index | None | Top-right, computed via `getPositionIndex()` |
| Title | `text-4xl text-skin-accent` | `text-3xl --text-base` normal weight |
| Title underline | None | `═` double-line below (`border-bottom: 2px double`) |
| Metadata | `<Datetime>` component | Compact mono line: `PUB 2024.11.23 ··· MOD 2025.10.31 ··· 2.8k w / 12 min` |
| Tags | Current Tag component | Restyle, add type badge to right |
| Prev/Next | SVG chevrons | `← Previous: [Title]` / `Next: [Title] →` text links |
| Notes-specific | Inline NexusScore | `<NexusPanel>` bordered panel (step 6.3) |

Preserve: progress bar, copy code buttons, heading anchor links, back-to-top, margin notes toggle, view transitions on title.

### 6.2 Update `src/layouts/ProjectDetails.astro`

Similar header redesign plus:
- Status display: `>>> ACTIVE` / `--- STABLE` / `... ARCHIVED`
- Tech stack with leader dots: `astro · typescript · tailwind ..... 2y4m`
- Prev/next project navigation with text arrows

### 6.3 Create `src/components/NexusPanel.astro`

Bordered panel for note detail pages:

```
┌── NEXUS ──────────────────────────────────────────┐
│  topology: Hub          stage: Developed           │
│  incoming: 3            outgoing: 5   external: 2  │
└───────────────────────────────────────────────────-┘
```

```
Props: nexusScore (string), incomingCount, outgoingCount, externalCount
```

Parse `nexusScore` → topology (H/R/T → Hub/Relay/Terminal) + stage. Render in monospace `text-sm --color` with `1px solid --border` border.

### 6.4 Update `src/components/Backlinks.astro`

- Use `:: Backlinks ───────` section header pattern
- List items: `▫ [Linked note title]` style

### Testing checkpoint

Detail pages display new header format. Verify: view transitions animate title, progress bar works, copy buttons work, margin notes toggle on mobile, NexusPanel renders for notes.

---

## Phase 7 — Homepage Redesign

**Goal**: Overhaul homepage to match spec layout.

### 7.1 Redesign `src/pages/index.astro`

| Element | Current | New |
|---|---|---|
| Hero `<h1>` | `<span class="text-skin-accent">Daniel</span><br>van der Merwe` | `> Daniel van der Merwe` — `>` in accent, name in `text-4xl sm:text-5xl` mono |
| Subtitle | `<CyclingWords>` component | Static tagline: "Builder and systems thinker. Technical Director at Rokkit." in `--color` |
| Description | None | "This is where I tinker, iterate, and share what might be useful." + short `─` rule |
| Section headers | `<h2>Latest Writing</h2>` | `<SectionHeader title="Writing" />` |
| Cards | `<Card>` everywhere | Type-specific card per section |
| "View all" links | `<LinkButton>` with SVG arrow | `<a>→ View all writing</a>` text link, monospace |
| Separators | `<Hr />` | Thinner `1px` rule or spacing only |

Compute marginalia (position indices) in frontmatter for each section.

### Decision note on CyclingWords

The spec shows a static tagline. `CyclingWords` is a nice interactive element but conflicts with the minimal aesthetic. Removing it per spec. If desired later, it can be re-added as a subtitle beneath the static tagline.

---

## Phase 8 — Specialized Features

### 8.1 Create `src/components/GardenStatus.astro`

Garden overview panel for `/notes` page, using `computeGardenStats()`:

```
┌── GARDEN STATUS ──────────────────────────────────┐
│  47 notes                                          │
│  ├─ Developed ........... 12                       │
│  ├─ Emerging ............ 18                       │
│  └─ Seedling ............ 17                       │
│                                                    │
│  Topology                                          │
│  ├─ Hubs ................ 4                        │
│  ├─ Relays .............. 15                       │
│  └─ Terminals ........... 28                       │
│                                                    │
│  156 total connections · 3.3 avg/note              │
│  Most connected: [Note Title] (12)                 │
│  Last updated: [Note Title] · 2026.01.28           │
└───────────────────────────────────────────────────-┘
```

### 8.2 Integrate into `src/pages/notes/[...page].astro`

Add `<GardenStatus />` above the notes list, below the section description.

### 8.3 Update `src/pages/tags/index.astro`

Visual update only:
- Use `<SectionHeader>` with tag count
- Monospace `#` prefix on tags
- Alphabetical column layout
- New colour palette applied

---

## Phase 9 — Polish & Accessibility

### 9.1 Button styles

**File**: `src/components/LinkButton.astro`
- Monospace font
- `1px solid --border-muted` border, transparent background
- Hover: `--accent` border and text colour

### 9.2 Card hover states

All card components: ONLY `border-color` transition on hover. No shadows, transforms, or scale effects.

### 9.3 Focus states

All interactive elements: `2px dashed outline in --accent` on `:focus-visible`. Update `.focus-outline` utility in `base.css`.

### 9.4 Responsive review

| Breakpoint | Behaviour |
|---|---|
| < 640px (mobile) | Full-width cards, hamburger nav, marginalia hidden |
| 768px (tablet) | Content max-width kicks in, nav may still be hamburger |
| 1024px+ (desktop) | Full desktop nav, margin notes show at 60rem+ |
| 1280px+ (wide) | Content centred with generous margins |

Hide decorative marginalia (hash, revision, position index) on mobile. Keep reading time and date.

### 9.5 Accessibility audit

- **Contrast**: Verify `--accent` against `--fill` meets WCAG AA (4.5:1)
- **Reduced motion**: Wrap CSS transitions in `@media (prefers-reduced-motion: no-preference)`
- **ARIA**: Labels on hamburger, theme toggle, search icon, social links
- **Skip-to-content**: Verify still functional with new header
- **Tab order**: Logical flow through header nav items

### 9.6 Update `src/config.ts`

Set `LOGO_IMAGE.enable = false` since we now render `◆` inline as unicode text.

### 9.7 Clean up deprecated files

After full migration is verified:
- Delete `src/components/Card.tsx` (replaced by 5 Astro card components)
- Delete `src/components/Breadcrumbs.astro` (replaced by `← {section}` back links)
- Consider removing `src/components/CyclingWords.astro` if hero is static
- Optionally simplify `src/components/Datetime.tsx` or inline its logic

---

## Files Summary

### Modified (27 files)

| # | File | Phase | Change |
|---|---|---|---|
| 1 | `src/styles/base.css` | 1 | Colours, fonts, spacing tokens, link styles, heading uppercase |
| 2 | `tailwind.config.cjs` | 1 | Font families, breakpoints |
| 3 | `src/layouts/Layout.astro` | 1 | Font preloads, remove Google Font comments |
| 4 | `astro.config.ts` | 1 | Uncomment remarkWordCount |
| 5 | `src/plugins/nexus-score/index.ts` | 2.5 | Simplify to content metrics only (remove NexusScore computation) |
| 6 | `src/utils/getNexusScore.ts` | 2.5 | Refactor to accept `NodeMetrics` from graph |
| 7 | `src/utils/getPostsWithEnrichedFrontmatter.ts` | 2.5 | Accept graph param, inject graph-based NexusScore + links |
| 8 | `src/pages/notes/[id]/index.astro` | 2.5 | Use `noteGraph` instead of `getIncomingLinks` |
| 9 | `src/pages/writing/[id]/index.astro` | 2.5 | Use `noteGraph` instead of `getIncomingLinks` |
| 10 | `src/pages/journal/[id]/index.astro` | 2.5 | Use `noteGraph` instead of `getIncomingLinks` |
| 11 | `src/pages/projects/[id]/index.astro` | 2.5 | Use `noteGraph` instead of `getIncomingLinks` |
| 12 | `src/components/Header.astro` | 3 | Complete redesign |
| 13 | `src/components/Footer.astro` | 3 | Complete redesign with SYS/BUILD status |
| 14 | `src/components/Hr.astro` | 3 | Restyle |
| 15 | `src/layouts/Main.astro` | 4 | SectionHeader integration, remove breadcrumbs |
| 16 | `src/components/Pagination.astro` | 4 | Restyle with text arrows |
| 17 | `src/pages/index.astro` | 5+7 | New cards, homepage redesign |
| 18 | `src/pages/writing/[...page].astro` | 5 | WritingCard |
| 19 | `src/pages/journal/[...page].astro` | 5 | JournalCard |
| 20 | `src/pages/notes/[...page].astro` | 5+8 | NoteCard + GardenStatus |
| 21 | `src/layouts/Projects.astro` | 5 | ProjectCard |
| 22 | `src/layouts/PostDetails.astro` | 6 | Header redesign, metadata format, NexusPanel |
| 23 | `src/layouts/ProjectDetails.astro` | 6 | Header redesign, status display |
| 24 | `src/components/Backlinks.astro` | 6 | Restyle |
| 25 | `src/components/Tag.astro` | 6 | Restyle |
| 26 | `src/components/LinkButton.astro` | 9 | Restyle |
| 27 | `src/config.ts` | 9 | LOGO_IMAGE.enable = false |
| 28 | `src/pages/tags/index.astro` | 8 | Visual update |
| 29 | `src/layouts/Posts.astro` | 4 | SectionHeader integration |

### New (17 files)

| # | File | Phase |
|---|---|---|
| 1 | `public/fonts/JetBrainsMono-Regular.woff2` | 1 |
| 2 | `public/fonts/JetBrainsMono-Medium.woff2` | 1 |
| 3 | `public/fonts/JetBrainsMono-SemiBold.woff2` | 1 |
| 4 | `public/fonts/Inter-Regular.woff2` | 1 |
| 5 | `public/fonts/Inter-Medium.woff2` | 1 |
| 6 | `src/utils/marginalia.ts` | 2 |
| 7 | `src/utils/buildInfo.ts` | 2 |
| 8 | `src/utils/gardenStats.ts` | 2 |
| 9 | `src/utils/noteGraph.ts` | 2.5 |
| 10 | `src/components/SectionHeader.astro` | 3 |
| 11 | `src/components/WritingCard.astro` | 5 |
| 12 | `src/components/JournalCard.astro` | 5 |
| 13 | `src/components/NoteCard.astro` | 5 |
| 14 | `src/components/ProjectCard.astro` | 5 |
| 15 | `src/components/ExplorationCard.astro` | 5 |
| 16 | `src/components/NexusPanel.astro` | 6 |
| 17 | `src/components/GardenStatus.astro` | 8 |

### New dependencies

| Package | Purpose | Phase |
|---|---|---|
| `graphology` | Core directed graph library | 2.5 |
| `graphology-metrics` | Betweenness centrality, PageRank | 2.5 |
| `graphology-types` | TypeScript types for graphology | 2.5 |

### Deletable after migration (5-6 files)

- `src/components/Card.tsx` — replaced by 5 Astro card components
- `src/components/Breadcrumbs.astro` — replaced by `← {section}` back links
- `src/components/CyclingWords.astro` — if hero stays static
- `src/components/Datetime.tsx` — if logic fully inlined
- `src/utils/getIncomingLinks.ts` — replaced by `noteGraph.getIncomingLinkIds()`
- `src/utils/getOutgoingLinks.ts` — replaced by `noteGraph.getOutgoingLinkIds()`

---

## Dependency Graph

```
Phase 1 (Foundation) ──┬── Phase 2 (Utilities) ← can run in parallel
                       │
                       ├── Phase 2.5 (Note Graph) ← depends on Phase 2
                       │
                       ├── Phase 3 (Nav & Footer) ← depends on 1 + 2.5
                       │         │
                       │         └── Phase 4 (Layout Components)
                       │                   │
                       │         ┌─────────┴─────────┐
                       │         │                    │
                       │    Phase 5 (Cards)    Phase 6 (Detail Pages)
                       │         │                    │
                       │    Phase 7 (Homepage)  Phase 8 (Specialized)
                       │         │                    │
                       │         └────────┬───────────┘
                       │                  │
                       └───── Phase 9 (Polish & Accessibility)
```

**Recommended order**: 1 → 2 → 2.5 → 3 → 4 → 5 → 6 → 7 → 8 → 9
Phases 1+2 can parallel. Phase 2.5 depends on 2. Phases 5+6 can parallel after Phase 4.

---

## Risk Areas

| Risk | Mitigation |
|---|---|
| **View transitions break** | Preserve `transition:name={post.id}` on every card title link |
| **NexusScore values change** | Expected — incoming links now contribute. Compare before/after and verify scores make sense |
| **Graph build per-page** | For ~31 notes this is <50ms. If it becomes slow, cache graph in a Vite virtual module |
| **Content type filter breaks** | New NoteCard must preserve `data-content-type` attribute on `<li>` |
| **Margin notes break** | Don't touch `.margin-sidenote` / `.is-open` classes or `margin-notes.ts` |
| **Dark mode code blocks** | Preserve `--shiki-dark` CSS variable approach untouched |
| **OG image fonts** | `satori` templates use "Fira Code" — low-priority: update to JetBrains Mono later |
| **Colour contrast** | Test orange accent against new fill values for WCAG AA compliance |
| **Broken wikilinks** | Graph resolver returns `null` for unresolved targets — log warnings during build |
