---
pubDatetime: 2026-02-18T03:53:45Z
pubDatetime: 2026-02-18T03:53:45Z
title: "Nexus Score v2: Teaching Notes to Know Their Place"
featured: false
status: published
tags:
  - astro
  - digital-garden
  - graph-theory
description: "How I rebuilt the Nexus Score system from the ground up using graph theory algorithms, replacing arbitrary weights with betweenness centrality, PageRank, community detection, and Chladni-inspired visual patterns."
aiUsage:
  - research
  - proofreading
  - code-assistance
  - system-design
---

In my [[nexus-score|original Nexus Score post]] I described a system for scoring notes based on link counts and word length. It worked, sort of. But I was never fully satisfied with it. The scores felt arbitrary, the topology classification was too simplistic, and the whole thing couldn't account for incoming links because of how remark plugins work.

So I threw it all out and rebuilt it from scratch using actual graph theory. Here's how Nexus Score v2 works.

## What Was Wrong With v1

The original system had a few fundamental problems that kept nagging at me:

- **No incoming link data at build time.** Remark plugins process each file independently, so a note has no way of knowing which other notes link to it. This meant the "Receiver" classification was effectively broken.
- **Arbitrary weightings.** I openly admitted in the original post that the weights were based on gut feel. That's fine for a first pass, but it meant the scores didn't really capture what I wanted them to.
- **Flat scoring.** Adding up weighted link counts and word counts into a single number loses all the nuance. A note with 5000 words and zero links scored similarly to a note with 200 words and many links, even though they play completely different roles in the garden.
- **Three topology types weren't enough.** Receiver, Hub, and Transmitter captured the direction of links but nothing about structural importance. A note that bridges two clusters is fundamentally different from a note that just has a lot of outgoing links.

## The Graph Approach

The fix was to stop thinking about notes as isolated documents and start treating them as nodes in a directed graph. I'm using [Graphology](https://graphology.github.io/) to build the graph at build time, which gives me access to proper graph algorithms rather than hand-rolled arithmetic.

```typescript
const graph = new Graph({ type: "directed", multi: false });

// Every post becomes a node
for (const post of allPosts) {
  graph.addNode(`${post.collection}/${post.id}`, {
    title, collection, id, wordCount, externalLinkCount: 0, tags,
  });
}

// Wikilinks become directed edges
const wikilinks = body.match(/(?<=\[\[)(.*?)(?=\]\])/g) ?? [];
for (const raw of wikilinks) {
  const targetNodeId = resolveTarget(normalizeWikilink(raw), idToNode);
  if (targetNodeId && targetNodeId !== sourceId && !graph.hasEdge(sourceId, targetNodeId)) {
    graph.addEdge(sourceId, targetNodeId);
  }
}
```

By building the full graph before computing any scores, the incoming links problem goes away entirely. Every node knows its in-degree because the graph tracks all edges bidirectionally.

## Six Algorithms, One Cache

Once the graph is built I run six algorithms across all nodes and cache the results. This is the expensive part, so it only runs once per build.

```typescript
cachedBetweenness = betweennessCentrality(graph);
cachedPageRank = pagerank(graph, { getEdgeWeight: null });
cachedCloseness = closenessCentrality(graph, { wassermanFaust: true });
cachedHITS = hits(graph, { normalize: true });
```

On top of these I also run [Louvain community detection](https://en.wikipedia.org/wiki/Louvain_method) to identify clusters of related notes, and Breadth-First Search (BFS) from every node to compute eccentricity and reachability. [^1]

[^1]: Community clusters derived from link structure could eventually augment or even replace manually assigned [tags](/tags) as a way of organizing the garden.

Here's what each algorithm contributes:

- **Betweenness centrality:** How often does this note sit on the shortest path between two other notes? High betweenness means it's a structural bridge.
- **PageRank:** The classic Google algorithm. Notes that are linked to by other highly-linked notes score higher. It's a recursive measure of importance.
- **Closeness centrality:** How close is this note to all other notes in the graph? Notes at the center of the garden score higher than notes at the periphery.
- **HITS (Hyperlink-Induced Topic Search):** Produces two scores: authority (a note that many hubs link to) and hub (a note that links to many authorities). This captures the curator-vs-reference dynamic.
- **Louvain community detection:** Groups notes into communities based on link density. I derive a label for each community from the most common tag among its members.
- **BFS eccentricity & reachability:** How far can you get from this note, and what fraction of the garden can you reach? A well-integrated note can reach most of the garden in a few hops.

## Five Topology Roles

The old system had three topology types based on link direction ratios. The new system has five, classified using the normalized algorithm outputs:

```typescript
let topology: "B" | "A" | "H" | "R" | "T" = "T";

if (betweennessN > 0.3 && (inDeg + outDeg) > 2) {
  topology = "B"; // Bridge: structural connector between clusters
} else if (authorityN > 0.3 && inDeg >= outDeg && inDeg > 0) {
  topology = "A"; // Authority: well-referenced canonical note
} else if (hubN > 0.3 && outDeg > inDeg) {
  topology = "H"; // Hub: curates and links to authorities
} else if (reachability > 0.4 && reciprocity >= 1) {
  topology = "R"; // Relay: well-integrated, bidirectional exchange
}
// else T (Terminal): leaf or low-connectivity note
```

- **Bridge (B):** A note that connects otherwise separate parts of the garden. High betweenness centrality with multiple connections.
- **Authority (A):** A canonical reference note that many other notes point to. High HITS authority score.
- **Hub (H):** A note that curates and links out to many authoritative notes. High HITS hub score.
- **Relay (R):** A well-integrated note with bidirectional links and broad reach. It's embedded in the fabric of the garden.
- **Terminal (T):** A leaf node or note with low connectivity. Not a bad thing, just means it's standalone.

## Four-Dimensional Scoring

Instead of a single weighted sum, Nexus Score v2 uses four normalized dimensions, each capturing a different aspect of a note's character:

```typescript
// Substance: content depth (25%)
const substance = 0.7 * (wordCount / 3000) + 0.3 * (externalLinks / 8);

// Position: structural importance (30%)
const position = 0.4 * betweennessNorm + 0.3 * pageRankNorm + 0.3 * closenessNorm;

// Integration: embeddedness (25%)
const integration = 0.6 * reachability + 0.4 * (reciprocity / 5);

// Authority: recognition (20%)
const authority = 0.5 * authorityNorm + 0.5 * inDegreeNorm;

const composite = 0.25 * substance + 0.30 * position + 0.25 * integration + 0.20 * authority;
```

Position gets the highest weight because I care most about how a note fits into the broader structure of the garden. Substance and Integration share second place. Authority gets the lowest weight because I don't want notes to score highly just because they happen to be linked to a lot; they need to earn it through structural importance and content depth too.

Each dimension is normalized to 0–1 using the graph's own maximums as the ceiling. This means scores are relative to the garden's current state rather than against arbitrary thresholds.

The composite score maps to a maturity stage:

| Composite | Stage |
| --------- | ---------- |
| < 0.12    | Fragment   |
| < 0.25    | Basic      |
| < 0.45    | Developed  |
| < 0.65    | Advanced   |
| ≥ 0.65    | Integrated |

The final Nexus Score is a combination of topology and stage, e.g., `B_Advanced` or `T_Fragment`.

## Chladni Patterns: A New Visual Language

The original Nexus Score used Tabler SVG icons to represent scores. They worked but they felt arbitrary. There was no visual logic connecting a topology-ring icon to the concept of a hub note.

For v2 I replaced them with something I find far more satisfying: ASCII patterns inspired by [Chladni figures](https://en.wikipedia.org/wiki/Chladni_figure). These are the patterns that emerge when you vibrate a metal plate covered in sand. Different resonant frequencies produce different nodal line patterns, and they happen to map beautifully to the concept of increasing connectivity and complexity.

Each Nexus Score is encoded as a 3×3 dot grid. The spatial pattern of "active" cells encodes the topology role, while the character weight encodes the maturity stage.

```
Role masks (increasing nodal-line complexity):

T (Terminal)    R (Relay)      B (Bridge)     A (Authority)   H (Hub)
· · ·           · · ·          • · •          · • ·           • • •
· • ·           • • •          · • ·          • • •           • • •
· · ·           · · ·          • · •          · • ·           • • •
```

For stage encoding, I use a character cascade where each stage's active character becomes the next stage's inactive character. This creates a visual progression of increasing intricacy:

```typescript
const CHAR_PAIRS: [active, inactive][] = [
  ["·", "·"],   // Fragment    — uniform, undifferentiated
  ["•", "·"],   // Basic       — first contrast appears
  ["○", "•"],   // Developed   — hollow forms emerge
  ["●", "○"],   // Advanced    — solid forms dominate
  ["◆", "●"],   // Integrated  — diamond apex
];
```

A `T_Fragment` is just nine identical dots. An `A_Integrated` is a cardinal cross of diamonds against a field of filled circles. The visual complexity grows with the note's actual complexity. I like that.

## Garden-Wide Stats

With a proper graph in place I could also compute aggregate stats for the garden as a whole. Things like graph density, diameter (longest shortest path), community count, orphan nodes, and mutual link counts.

These get surfaced on the [[/|notes listing page]] so I can keep an eye on the health of the garden at a glance. A high orphan count tells me I have disconnected notes that need linking. A low density tells me there's room for more cross-pollination between topics.

## Was It Worth It?

The original Nexus Score was a weekend project driven by curiosity. The v2 rebuild was a much larger effort, but it gave me something the original never could: scores that actually mean something.

When I see a note classified as a Bridge, I know it genuinely sits between two clusters of ideas. When a note reaches Integrated status, it's because it's deeply embedded in the garden's structure, not because it happens to be long.

There are still improvements to be made. The stage thresholds are still somewhat arbitrary, and the dimension weights could use more tuning as the garden grows. But the foundation is solid now, and the scores tell me things about my notes that I wouldn't have noticed otherwise.

If you're curious about how a specific note scores, click on the `[+]` icon at the top of any note to expand the full metrics panel. It shows all fourteen metrics across five rows, everything from PageRank to community labels.

---

## Future Considerations

- **Temporal decay:** older notes that haven't been updated could have their scores attenuated
- **Cross-collection weighting:** a link from a writing post might carry different weight than a link from a journal entry
- **Interactive graph explorer:** visualize the communities and bridges in a force-directed layout
- **Score history:** track how a note's Nexus Score evolves over time as the garden grows
