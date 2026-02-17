export const changelog = [
  {
    version: "2.2.0",
    title: "Design Overhaul & Knowledge Graph",
    date: new Date("2026-02-17"),
    description:
      "Rebuilt the visual language around a brutalist monospace aesthetic with new NexusScore Chladni inspired pattern icons, graph-powered garden stats, and refined header styling.",
    changes: [
      "Replaced NexusScore with ASCII Chladni inspired pattern 3×3 grid system driven by topology role and maturity stage",
      "Added NexusPanel with collapsible per-note graph metrics, cluster info, and backlinks",
      "Built garden status panel with live graph stats: density, clusters, diameter, mutual links, word count",
      "Computed word count from raw markdown body instead of unpopulated frontmatter",
      "Scoped graph metrics (density, community count) to collection rather than full cross-collection graph",
      "Replaced filled header icons with stroke-based SVGs for search and theme toggle",
      "Swapped logo for terminal-style ~/ home mark with blinking cursor on hover",
      "Restyled NoteCard with sequence numbers, link indicators, and NexusScore gutter",
      "Added ContentTypeFilter component for notes listing",
      "Refined ExplorationCard, PostDetails layout, and base typography",
      "Switched body font from Inter to IBM Plex Sans for crisper readability",
      "Redesigned link styles: accent-colored with animated slide-in underline on hover, green underline for external links",
      "Rebuilt search with Fuse.js fuzzy matching, body text indexing, and graph-boosted ranking",
      "Search results show NexusScore badges, clickable tags, and inline backlinks from graph neighbors",
    ],
  },
  {
    version: "2.1.0",
    title: "Projects, Content & Homepage Refresh",
    date: new Date("2026-02-10"),
    description:
      "Overhauled projects layout with status grouping, refactored content types and templates, and enhanced the homepage with cycling words and improved wiki links.",
    changes: [
      "Refactored projects layout with active, stable, and archived grouping",
      "Enhanced project cards with dates, categories, and links",
      "Added backlinks and content type filter components",
      "Refactored content types and removed deprecated templates",
      "Added homepage cycling words for dynamic presentation",
      "Improved wiki link title resolution",
      "Refined nexus score calculation for new data structure",
      "Added new notes and writing content",
    ],
  },
  {
    version: "2.0.0",
    title: "Content Restructuring",
    date: new Date("2026-01-24"),
    description:
      "Unified Writing into a single stream with essays, notes, explorations, and life updates. Added exploration support, refreshed navigation, and introduced new homepage sections.",
    changes: [
      "Unified Writing section",
      "Added exploration content type",
      "Simplified navigation",
      "Updated homepage layout",
      "Added contact and changelog pages",
    ],
  },
  {
    version: "1.9.0",
    title: "Structure Improvements",
    date: new Date("2026-01-09"),
    description:
      "Refined homepage structure and navigation, updated branding and section organization, and resolved type compatibility issues after the structural changes.",
    changes: [
      "Improved homepage layout and navigation sections",
      "Restructured content into clearer sections",
      "Updated header styling and dependencies",
      "Resolved TypeScript compatibility issues",
    ],
  },
  {
    version: "1.8.0",
    title: "Publishing Workflow Updates",
    date: new Date("2025-10-31"),
    description:
      "Enhanced publishing workflow with release statuses, frontmatter enrichment, and homepage refinements alongside writing and layout improvements.",
    changes: [
      "Added release status to publishing workflow",
      "Improved frontmatter enrichment pipeline",
      "Enhanced Card component for richer metadata",
      "Refined homepage section styling",
    ],
  },
  {
    version: "1.7.0",
    title: "Margin Notes & Reading Experience",
    date: new Date("2025-10-31"),
    description:
      "Introduced and refined margin note behavior and styles to improve the long-form reading experience.",
    changes: [
      "Added margin note support",
      "Refined margin note handling and breakpoints",
      "Aligned styles for consistent reading flow",
    ],
  },
  {
    version: "1.6.0",
    title: "Writing Updates via Pages CMS",
    date: new Date("2025-11-14"),
    description:
      "Added and updated long-form posts and publishing metadata through Pages CMS.",
    changes: [
      "Created and updated new long-form posts",
      "Stamped publish datetimes",
      "Updated Pages CMS configuration",
    ],
  },
  {
    version: "1.3.0",
    title: "Nexus Score Introduced",
    date: new Date("2024-10-27"),
    description:
      "Added Nexus Score metadata to highlight knowledge density and linkage across posts.",
    changes: [
      "Introduced Nexus Score calculation",
      "Surface Nexus Score in content metadata",
    ],
  },
  {
    version: "1.0.0",
    title: "Initial Release",
    date: new Date("2023-10-02"),
    description:
      "Initial build of the Elysium theme based on AstroPaper.",
    changes: [
      "First public build of the site",
      "Baseline content structure and layout",
    ],
  },
];
