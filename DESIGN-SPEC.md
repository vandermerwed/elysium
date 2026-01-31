# Elysium Design Update Specification

## Vision

**Minimal Futuristic** — A design language that feels like a well-crafted spacecraft interface: functional, sparse, warm, and human. Every element earns its place. No decoration for decoration's sake.

**Guiding Principles:**
- **Intentional Whitespace** — Generous breathing room creates focus and calm
- **Typographic Hierarchy** — Structure communicated through type, not decoration
- **Subtle Systemicity** — Consistent patterns that reveal themselves gradually
- **Warm Technical** — Terminal aesthetics softened by human touches
- **Content-First** — Different content types deserve different treatments

---

## 1. Color System

### 1.1 Revised Palette

The current dark mode has inconsistencies (card-muted and border-muted are identical brown values). This revision creates a more cohesive system.

```css
:root {
  /* Light Theme */
  --light-fill: 252, 251, 250;        /* Warm off-white background */
  --light-text-base: 43, 40, 49;      /* Deep charcoal (kept) */
  --light-color: 107, 114, 128;       /* Muted gray for secondary text */
  --light-accent: 232, 84, 37;        /* Burnt orange (unified) */
  --light-accent-secondary: 16, 163, 127; /* Softer teal */
  --light-card: 245, 244, 242;        /* Subtle warm gray */
  --light-card-muted: 235, 234, 232;  /* Slightly darker for depth */
  --light-border: 229, 228, 226;      /* Very subtle separator */
  --light-border-muted: 214, 213, 211; /* More visible when needed */

  /* Dark Theme */
  --dark-fill: 24, 24, 27;            /* Deeper, richer black */
  --dark-text-base: 244, 244, 245;    /* Soft white (less blue) */
  --dark-color: 161, 161, 170;        /* Muted for secondary text */
  --dark-accent: 239, 103, 55;        /* Slightly warmer orange */
  --dark-accent-secondary: 45, 180, 140; /* Brighter teal for visibility */
  --dark-card: 39, 39, 42;            /* Subtle card elevation */
  --dark-card-muted: 50, 50, 54;      /* For nested/grouped elements */
  --dark-border: 63, 63, 70;          /* Visible but not harsh */
  --dark-border-muted: 82, 82, 91;    /* For emphasis */
}
```

### 1.2 Semantic Color Usage

| Purpose | Variable | Usage |
|---------|----------|-------|
| Primary text | `--text-base` | Headings, body text, important content |
| Secondary text | `--color` | Metadata, dates, descriptions, muted labels |
| Background | `--fill` | Page background |
| Primary accent | `--accent` | Links, active states, important highlights |
| Secondary accent | `--accent-secondary` | Status badges, success states, secondary CTAs |
| Card surface | `--card` | Elevated content areas |
| Card muted | `--card-muted` | Nested elements, hover states |
| Borders | `--border` | Subtle separators |
| Borders muted | `--border-muted` | More prominent separators |

### 1.3 Accent Color Application

- **Primary Orange** — Navigation hover, links, section prefixes, hero accent, active states
- **Secondary Teal** — Active project status, success indicators, nexus score highlights
- Use sparingly: accents should draw the eye to the most important elements

modDatetime: 2026-01-31T04:52:36Z
---

## 2. Typography

### 2.1 Font Stack

```css
:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', ui-monospace, monospace;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

**Rationale:**
- **Monospace primary** — Reinforces the technical, terminal-like aesthetic
- **Sans-serif prose** — Optional for long-form reading if monospace fatigues readers
- JetBrains Mono has excellent legibility and programming ligatures

### 2.2 Type Scale

```css
/* Modular scale: 1.25 (Major Third) */
--text-xs: 0.75rem;      /* 12px - labels, badges */
--text-sm: 0.875rem;     /* 14px - metadata, captions */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - lead paragraphs */
--text-xl: 1.25rem;      /* 20px - h4, subtitles */
--text-2xl: 1.5rem;      /* 24px - h3 */
--text-3xl: 1.875rem;    /* 30px - h2 */
--text-4xl: 2.25rem;     /* 36px - h1 */
--text-5xl: 3rem;        /* 48px - hero display */
```

### 2.3 Typography Treatments

| Element | Style |
|---------|-------|
| Hero name | `text-4xl sm:text-5xl`, monospace, normal weight |
| Section headers | `text-sm`, monospace, uppercase, tracking-widest |
| Card titles | `text-xl`, monospace, semibold |
| Body text | `text-base`, monospace or sans, normal |
| Metadata | `text-sm`, monospace, `--color` (muted) |
| Badges | `text-xs`, monospace, uppercase, tracking-wide |
| Code blocks | Monospace, syntax highlighting preserved |

### 2.4 Line Height & Spacing

```css
--leading-tight: 1.25;   /* Headings */
--leading-snug: 1.375;   /* Subheadings */
--leading-normal: 1.5;   /* Short text */
--leading-relaxed: 1.75; /* Long-form prose */

/* Letter spacing */
--tracking-tight: -0.025em;  /* Large headings */
--tracking-normal: 0;        /* Body text */
--tracking-wide: 0.05em;     /* Uppercase labels */
--tracking-widest: 0.1em;    /* Section headers */
```

---

## 3. Layout & Spacing

### 3.1 Container System

```css
--container-prose: 65ch;     /* Reading content (~680px) */
--container-content: 48rem;  /* Listings, cards (768px) */
--container-wide: 64rem;     /* Full-width sections (1024px) */

--gutter: clamp(1rem, 5vw, 2rem);  /* Responsive horizontal padding */
```

### 3.2 Vertical Rhythm

```css
/* Section spacing */
--space-section: clamp(4rem, 10vh, 8rem);  /* Between major sections */
--space-block: 2rem;                        /* Between content blocks */
--space-element: 1rem;                      /* Within components */
--space-tight: 0.5rem;                      /* Related elements */
```

### 3.3 Grid System

```
┌─────────────────────────────────────────────────────────────────┐
│                          --gutter                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              --container-content (48rem)                │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │           --container-prose (65ch)              │   │   │
│  │  │       For reading content, centered             │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Symbolic Language

### 4.1 Core Symbol Set

| Symbol | Unicode | Name | Usage |
|--------|---------|------|-------|
| `◆` | U+25C6 | Black diamond | Logo/home link |
| `◇` | U+25C7 | White diamond | Projects (hover fills) |
| `▸` | U+25B8 | Right pointer | List bullets, expandable items |
| `▫` | U+25AB | Small square | Inline list items |
| `─` | U+2500 | Box horizontal | Horizontal rules |
| `│` | U+2502 | Box vertical | Visual separators (rare) |
| `→` | U+2192 | Right arrow | Navigation, links, status |
| `←` | U+2190 | Left arrow | Back navigation |
| `::` | ASCII | Double colon | Section prefixes |
| `//` | ASCII | Double slash | Inline separators |
| `·` | U+00B7 | Middle dot | Inline separators (alt) |
| `[ ]` | ASCII | Brackets | Tags, interactive elements |
| `>` | ASCII | Greater than | Hero prefix (command prompt feel) |

### 4.2 Symbol Colors

- `◆` and `>` — Always `--accent` (orange)
- `::` — `--color` (muted gray)
- `─` rules — `--border`
- `→` — Inherits parent text color, or `--accent` for CTAs

---

## 5. Component Specifications

### 5.1 Navigation

**Desktop Layout:**
```
◆ elysium                           /journal  /writing  /projects  /about  ⌕
────────────────────────────────────────────────────────────────────────────
```

**Specifications:**
- Logo: `◆` in `--accent`, links to home
- Site name: "elysium" in `--text-base`, lowercase
- Links: Prefixed with `/`, monospace, `--color` default, `--accent` on hover
- Active link: `--text-base` with subtle underline
- Search icon: `⌕` or magnifying glass SVG
- Separator: 1px line in `--border`, full width
- Height: ~64px with centered content
- No background, no shadow — floats on page background

**Mobile Layout:**
```
┌─────────────────────────────────────────────┐
│  ◆ elysium                             ☰   │
├─────────────────────────────────────────────┤
│                                             │
│  /journal                                   │
│  /writing                                   │
│  /projects                                  │
│  /about                                     │
│                                             │
│  ⌕ search                                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Mobile Specifications:**
- Hamburger menu (3 lines, no animation needed)
- Full-screen overlay or slide-down panel
- Large touch targets (48px minimum)
- Stacked links with generous spacing

### 5.2 Hero Section

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                                                                 │
│  > Daniel van der Merwe                                         │
│                                                                 │
│  Builder and systems thinker.                                   │
│  Technical Director at Rokkit.                                  │
│                                                                 │
│  This is where I tinker, iterate,                               │
│  and share what might be useful.                                │
│                                                                 │
│  ─────────────────                                              │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- `>` prefix: `--accent`, same font size as name
- Name: `text-4xl sm:text-5xl`, `--text-base`, normal weight
- Tagline: `text-xl`, `--color` (muted)
- Description: `text-base`, `--color`
- Rule: `─` repeated, width ~200px, `--border`
- Vertical padding: `--space-section` top and bottom
- No card, no background — pure typography on page fill

### 5.3 Section Headers

```
:: Writing ─────────────────────────────────────────────────────────────────
```

**Specifications:**
- Prefix: `::` in `--color` (muted)
- Title: `text-sm`, uppercase, `tracking-widest`, `--text-base`
- Rule: `─` extending to edge, `--border`
- Spacing: `margin-bottom: var(--space-block)`
- Optional count: `[04]` after title in `--color`

**Alternative for subsections:**
```
▸ Recent Notes
```

### 5.4 Content Cards

#### 5.4.1 Writing Card (Rich)

For essays and long-form content that benefits from context.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  AI and the Agency Paradox                                              │
│  ─────────────────────────────                                          │
│  2024.11.23 // updated 2025.10.31                              Essay    │
│                                                                         │
│  Artificial Intelligence is everywhere. A look at how it's             │
│  reshaping our world, the risks to agency, and how I plan              │
│  to use it responsibly.                                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Border: 1px `--border`
- Background: `--card`
- Padding: `1.5rem`
- Title: `text-xl`, `--text-base`, semibold, hover → `--accent`
- Rule: Short `─` (width: 6ch), `--border-muted`
- Metadata: `text-sm`, monospace, `--color`
- Date format: `YYYY.MM.DD`
- Separator: `//`
- Type badge: Right-aligned, `text-xs`, uppercase, `--color`
- Description: `text-base`, `--color`, max 3 lines
- Hover: Subtle border color shift to `--border-muted`

#### 5.4.2 Journal Card (Contextual)

For personal updates, emphasizing timeline and themes.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  2024 Theme: Year of Systems                                            │
│  Reflections on building better processes and frameworks.               │
│                                                                         │
│  2024.12.15                                                    Journal  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Similar to Writing but:
  - Description comes before metadata (emphasizes theme/content)
  - No short rule under title
  - Lighter visual weight overall
  - Date in YYYY format more prominent for year themes

#### 5.4.3 Notes Card (Minimal with Nexus)

For digital garden notes — compact, scannable, with nexus score.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  [◎]  Digital Gardens                              2026.01.24    Note   │
│       A collection of thoughts on cultivating ideas over time.          │
│                                                                         │
│  [◉]  On Craftsmanship                             2025.10.31  Fragment │
│       The difference between making and crafting.                       │
│                                                                         │
│  [○]  Friction                                     2025.10.31  Fragment │
│       Why some resistance is valuable.                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Nexus Score Icon**: Left-aligned, `[icon]` visual treatment
  - Uses existing topology icons (R_, H_, T_ variants)
  - Subtle, consistent sizing
  - `--accent-secondary` for developed/integrated, `--color` for basic/fragment
- Layout: Icon | Title | Date | Type (inline, single row per note)
- Description: Indented to align with title, `--color`, single line or truncated
- Border: Optional — can be borderless list or grouped in container
- More compact than Writing cards
- **Type badges**: "Note", "Fragment", "Exploration" — differentiated by position/color

#### 5.4.4 Notes (Ultra-Minimal List)

For dense lists without descriptions.

```
  ▫ Digital Gardens                                    2026.01.24   Note
  ▫ On Craftsmanship                                   2025.10.31   Fragment
  ▫ Friction                                           2025.10.31   Fragment
  ▫ Interstitial Journaling                            2025.10.31   Fragment
```

**Specifications:**
- `▫` bullet in `--color`
- Title in `--text-base`, hover → `--accent`
- Date right-aligned, `text-sm`, `--color`
- Type right-aligned, `text-xs`, uppercase, `--color`
- No borders, no backgrounds — pure list
- Optionally show Nexus icon instead of `▫` for notes

#### 5.4.5 Project Card

For showcasing work with status.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ◇ Astro Elysium                                             → Active   │
│    Minimal Astro theme for digital gardens and personal sites.          │
│    ─                                                                    │
│    astro · typescript · tailwind                                        │
│                                                                         │
│  ◇ Toggl Extension                                           → Stable   │
│    Time tracking integration for Roam Research power users.             │
│    ─                                                                    │
│    chrome extension · javascript                                        │
│                                                                         │
│  ◇ Relatively Productive                                     → Archived │
│    Productivity podcast exploring systems and workflows.                │
│    ─                                                                    │
│    podcast · audio                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- `◇` prefix: `--color`, fills to `◆` on hover
- Title: `text-lg`, `--text-base`, hover → `--accent`
- Status: Right-aligned with `→` prefix
  - Active: `--accent-secondary` (teal)
  - Stable: `--color` (muted)
  - Archived: `--color` with `opacity-60`
- Description: `--color`, 1-2 lines
- Tech stack: `text-xs`, `--color`, separated by `·`
- Short rule `─` between description and tech stack
- No heavy borders — subtle separator between projects or grouped in container

#### 5.4.6 Exploration Card

For interactive experiments and prototypes.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │                    [ Embedded Prototype ]                       │   │
│  │                         v0 / figma                              │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  AI HUD Exploration                                                     │
│  Experimenting with ambient AI interfaces.                              │
│                                                                         │
│  2025.10.31                                               Exploration   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Prototype embed area: Prominent, `--card-muted` background, centered label
- Title below embed (inverted from other cards)
- Type badge: "Exploration" in `--accent-secondary`
- Can include Nexus score if part of notes collection

### 5.5 Footer

```
────────────────────────────────────────────────────────────────────────────

                        © 2026 Daniel van der Merwe

                    changelog  ·  source  ·  tags  ·  rss

                      mail  ·  github  ·  linkedin  ·  bsky

────────────────────────────────────────────────────────────────────────────
```

**Specifications:**
- Top rule: `─` full width, `--border`
- Copyright: `text-sm`, `--color`, centered
- Navigation: `text-sm`, `--color`, separated by `·`, hover → `--accent`
- Social links: Same treatment, can be text or minimal icons
- Bottom rule: Same as top
- Vertical padding: `--space-section`
- No background color — transparent

**Alternative with icons:**
```
────────────────────────────────────────────────────────────────────────────

© 2026 Daniel van der Merwe

[ Changelog ]  [ Source ]  [ Tags ]  [ RSS ]

◈ mail   ◇ github   ▢ linkedin   ○ bsky

────────────────────────────────────────────────────────────────────────────
```

---

## 6. Content Type Differentiation

### 6.1 Visual Treatment Summary

| Content Type | Border | Background | Nexus Score | Layout | Primary Element |
|--------------|--------|------------|-------------|--------|-----------------|
| Writing | 1px solid | `--card` | No | Rich card | Title + excerpt |
| Journal | 1px solid | `--card` | No | Contextual | Theme + date |
| Notes | Optional | None/minimal | **Yes** | Compact list | Icon + title |
| Projects | None | Grouped | No | Status list | Name + status |
| Explorations | 1px solid | `--card` | Yes | Embed-first | Prototype preview |

### 6.2 Content Type Badges

```css
/* Base badge style */
.badge {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: rgb(var(--color));
}

/* Type-specific (optional color hints) */
.badge-essay { /* default */ }
.badge-journal { /* default */ }
.badge-note { /* default */ }
.badge-fragment { opacity: 0.7; }
.badge-exploration { color: rgb(var(--accent-secondary)); }
.badge-active { color: rgb(var(--accent-secondary)); }
.badge-archived { opacity: 0.6; }
```

### 6.3 Nexus Score Placement (Notes Only)

The Nexus Score system remains exclusive to Notes (including Fragments and Explorations). Display rules:

1. **Notes list view**: Icon appears left of title
2. **Note detail page**: Icon appears in header area near title
3. **Homepage notes section**: Icon appears inline with each note
4. **Never shown on**: Writing, Journal, Projects

**Icon Size:**
- List views: `scale-75` (smaller)
- Detail pages: `scale-100` (full size)

---

## 7. Interactive States

### 7.1 Links

```css
a {
  color: inherit;
  text-decoration-line: underline;
  text-decoration-style: dashed;
  text-decoration-color: rgb(var(--border-muted));
  text-underline-offset: 4px;
  transition: color 150ms ease, text-decoration-color 150ms ease;
}

a:hover {
  color: rgb(var(--accent));
  text-decoration-color: rgb(var(--accent));
}

a:focus-visible {
  outline: 2px dashed rgb(var(--accent));
  outline-offset: 2px;
}
```

### 7.2 Cards

```css
.card {
  border: 1px solid rgb(var(--border));
  background: rgb(var(--card));
  transition: border-color 150ms ease;
}

.card:hover {
  border-color: rgb(var(--border-muted));
}

/* No shadows, no transforms, no scaling */
```

### 7.3 Buttons

```css
.button {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: 0.5rem 1rem;
  border: 1px solid rgb(var(--border-muted));
  background: transparent;
  color: rgb(var(--text-base));
  transition: all 150ms ease;
}

.button:hover {
  border-color: rgb(var(--accent));
  color: rgb(var(--accent));
}

.button-primary {
  background: rgb(var(--accent));
  border-color: rgb(var(--accent));
  color: rgb(var(--fill));
}

.button-primary:hover {
  background: transparent;
  color: rgb(var(--accent));
}
```

---

## 8. Animation & Motion

### 8.1 Philosophy

Minimal motion. Movement should be functional, not decorative.

**Allowed:**
- Color transitions (150ms ease)
- Opacity transitions (150ms ease)
- Focus outlines appearing

**Not recommended:**
- Transform animations
- Loading spinners (prefer skeleton states)
- Entrance animations
- Parallax effects
- Hover lifts/scales

### 8.2 Transitions

```css
:root {
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
  --transition-slow: 300ms ease;
}

/* Apply to interactive elements */
a, button, .card, input, [role="button"] {
  transition: color var(--transition-base),
              background-color var(--transition-base),
              border-color var(--transition-base),
              opacity var(--transition-base);
}
```

---

## 9. Responsive Behavior

### 9.1 Breakpoints

```css
/* Mobile-first breakpoints */
--bp-sm: 640px;   /* Large phones, small tablets */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Laptops */
--bp-xl: 1280px;  /* Desktops */
```

### 9.2 Layout Shifts

| Element | Mobile | Desktop |
|---------|--------|---------|
| Navigation | Hamburger menu | Inline links |
| Hero text | `text-3xl` | `text-5xl` |
| Cards | Full width, stacked | Can be 2-column for some |
| Footer | Stacked | Inline with separators |
| Margin notes | Collapsed/toggleable | Float right |
| Container | 100% - gutter | Max-width constrained |

### 9.3 Touch Targets

All interactive elements: minimum 44x44px touch target on mobile.

---

## 10. Page-Specific Layouts

### 10.1 Homepage

```
┌───────────────────────────────────────────────────────────────────────┐
│  Navigation                                                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Hero Section                                                         │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  :: Writing ─────────────────────────────────────────────             │
│                                                                       │
│  [Featured writing cards - 2-3 items]                                 │
│                                                                       │
│  → View all writing                                                   │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  :: Notes ───────────────────────────────────────────────             │
│                                                                       │
│  [Compact notes list with nexus icons - 5-6 items]                    │
│                                                                       │
│  → Explore the garden                                                 │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  :: Projects ────────────────────────────────────────────             │
│                                                                       │
│  [Project list with status - 3-4 items]                               │
│                                                                       │
│  → All projects                                                       │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│  Footer                                                               │
└───────────────────────────────────────────────────────────────────────┘
```

### 10.2 Content List Page (e.g., /writing)

```
┌───────────────────────────────────────────────────────────────────────┐
│  Navigation                                                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  :: Writing ─────────────────────────────────────────────             │
│                                                                       │
│  Long-form essays and polished thinking.                              │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [Writing cards - full list, paginated if needed]                     │
│                                                                       │
│  ─────────────────────────────────────────────────────                │
│                                                                       │
│  ← Previous     Page 1 of 3     Next →                                │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│  Footer                                                               │
└───────────────────────────────────────────────────────────────────────┘
```

### 10.3 Content Detail Page (e.g., single essay)

```
┌───────────────────────────────────────────────────────────────────────┐
│  Navigation                                                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ← Back to writing                                                    │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  AI and the Agency Paradox                                            │
│  ═════════════════════════════                                        │
│                                                                       │
│  2024.11.23 // updated 2025.10.31 // 12 min read           Essay      │
│                                                                       │
│  #artificial-intelligence  #agency  #philosophy                       │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  [Article content - prose container width]                            │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  ▸ Share  ·  ▸ Copy link  ·  ▸ Edit on GitHub                         │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  ← Previous: [Title]           Next: [Title] →                        │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│  Footer                                                               │
└───────────────────────────────────────────────────────────────────────┘
```

### 10.4 Notes Detail (with Nexus Score)

```
┌───────────────────────────────────────────────────────────────────────┐
│  Navigation                                                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ← Back to notes                                                      │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  [◎] Digital Gardens                                                  │
│      ════════════════                                                 │
│                                                                       │
│  2026.01.24 // 8 min read                                      Note   │
│                                                                       │
│  Nexus: Hub · Developed                                               │
│  3 incoming · 5 outgoing · 2 external                                 │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  [Note content]                                                       │
│                                                                       │
│  ─────────────────────────────────────────────────────────────        │
│                                                                       │
│  :: Backlinks ───────────────────────────────────                     │
│                                                                       │
│  ▫ [Linked note 1]                                                    │
│  ▫ [Linked note 2]                                                    │
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│  Footer                                                               │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 11. Implementation Notes

### 11.1 CSS Architecture

Recommend organizing styles as:

```
src/styles/
├── base.css          # Variables, resets, base elements
├── components.css    # Reusable component styles (or keep in components)
├── typography.css    # Type-specific utilities
└── utilities.css     # Custom utility classes
```

### 11.2 Component Migration Path

1. **Phase 1: Foundation**
   - Update color variables in base.css
   - Add new typography tokens
   - Update spacing scale

2. **Phase 2: Navigation & Footer**
   - Redesign Header.astro with new nav style
   - Redesign Footer.astro with simplified layout

3. **Phase 3: Layout Components**
   - Update Main.astro page headers
   - Update section header styles
   - Add new horizontal rule component

4. **Phase 4: Cards**
   - Create differentiated card variants for each content type
   - Update Card.tsx with new layouts
   - Ensure Nexus Score only appears on notes

5. **Phase 5: Detail Pages**
   - Update PostDetails.astro and ProjectDetails.astro
   - Add new typography treatments for article headers
   - Update backlinks sections

6. **Phase 6: Polish**
   - Review all pages for consistency
   - Test responsive behavior
   - Verify accessibility

### 11.3 Font Loading

```html
<!-- Preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Or self-host for better performance:

```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### 11.4 Accessibility Checklist

- [ ] Color contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Focus states visible on all interactive elements
- [ ] Skip-to-content link functional
- [ ] Semantic HTML throughout
- [ ] ARIA labels on icon-only buttons
- [ ] Reduced motion respected via `prefers-reduced-motion`
- [ ] Tab order logical
- [ ] Links distinguishable from surrounding text

---

## 12. Reference: Quick Symbol Chart

```
◆  Logo/home (filled)
◇  Projects (unfilled, fills on hover)
▸  Bullet/expand
▫  List item
─  Horizontal rule
→  Forward/link
←  Back
::  Section prefix
//  Inline separator
·   Alternate separator
[ ] Brackets for tags/actions
>   Hero prefix
```

---

## 13. Visual Mockup Prompt

For generating visual references:

```
UI mockup: Personal website "Elysium" — minimal futuristic.

Dark mode:
- Background: rgb(24,24,27) near-black
- Text: rgb(244,244,245) soft white
- Accent: rgb(239,103,55) burnt orange
- Secondary: rgb(45,180,140) teal
- Cards: rgb(39,39,42)
- Borders: rgb(63,63,70)

Layout: Single column, 65ch prose width, generous whitespace.

Components:
1. Nav: "◆ elysium" left, /journal /writing /projects /about right
2. Hero: "> Daniel van der Merwe" with orange >, gray subtitle
3. Section: ":: Writing ─────────────" header style
4. Writing cards: bordered, title, date/type, excerpt
5. Notes list: [icon] Title, date, type — compact rows with nexus icons
6. Project list: ◇ Name → Status, description, tech stack
7. Footer: horizontal rules, centered text links

Typography: JetBrains Mono throughout.
Symbols: ◆ ◇ ▸ ▫ ─ :: // → ←
Mood: Spacecraft log. Warm terminal. Functional, sparse, human.
No gradients. No shadows. No animations. Pure CSS.
```

---

*Last updated: 2026-01-31*
*Version: 1.0*
