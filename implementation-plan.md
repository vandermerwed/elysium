# Implementation Plan for Website Content & Structure Improvements

## Overview

This document provides a detailed, step-by-step implementation plan for the website content and structure improvements outlined in `claude-plan.md`. This plan is designed to be executed by an autonomous coding agent and includes specific file locations, code changes, and acceptance criteria for each task.

**Project Context:**
- Framework: Astro
- Current site has: Notes, Writing, Life, Projects content types
- Bi-directional wikilinks already implemented
- Goal: Restructure content organization and navigation without changing visual design

---

## Phase 1: Core Structure & Navigation

### Task 1.1: Simplify Navigation Structure

**Objective:** Consolidate navigation from 7+ items to 3 main items (Projects, Writing, About) plus Search.

**Files to Modify:**
- `src/components/Header.astro` - Main navigation component
- `src/config.ts` - Navigation configuration (if centralized)
- `src/layouts/Layout.astro` - Any layout-level navigation

**Implementation Steps:**

1. **Update navigation configuration:**
   ```typescript
   // Expected structure in config or Header component
   const navItems = [
     { name: 'Home', href: '/', external: false },
     { name: 'Projects', href: '/projects/', external: false },
     { name: 'Writing', href: '/writing/', external: false },
     { name: 'About', href: '/about/', external: false },
   ];
   ```

2. **Remove deprecated navigation items:**
   - Remove direct links to `/notes/`, `/life/` from main navigation
   - Keep `/tags/` and `/archives/` accessible but not in main nav
   - Maintain search functionality in header

3. **Add active page indicators:**
   - Implement logic to detect current page/section
   - Add appropriate CSS class for active state
   - Example logic:
   ```astro
   const currentPath = Astro.url.pathname;
   const isActive = (path: string) => currentPath.startsWith(path);
   ```

4. **Update mobile navigation:**
   - Ensure hamburger menu uses new navigation structure
   - Verify all items are accessible on mobile

**Acceptance Criteria:**
- [ ] Main navigation shows only: Projects, Writing, About, Search
- [ ] Current page is visually indicated in navigation
- [ ] Navigation works on both desktop and mobile
- [ ] No broken links
- [ ] Tags and Archives still accessible (via footer or within sections)

**Testing:**
- Navigate to each main section and verify active state
- Test on mobile viewport
- Verify all old URLs still work (via redirects if needed)

modDatetime: 2026-02-10T07:58:24Z
---

### Task 1.2: Update Hero Area Content

**Objective:** Clarify the purpose of the site in the hero area with more conversational tone.

**Files to Modify:**
- `src/pages/index.astro` - Homepage hero section

**Implementation Steps:**

1. **Restructure hero content into three tiers:**
   - Primary: Name and personal identity
   - Secondary: Brief professional context
   - Tertiary: What this site contains

2. **Update copy to be more conversational:**
   - Current tone: Professional, formal
   - Target tone: Conversational, welcoming, personal
   - Emphasize: Personal experiments, side projects, thinking
   - De-emphasize: Professional portfolio aspect
   - Example structure:
   ```
   Hi, I'm Daniel van der Merwe

   I'm a builder and systems thinker. By day, I'm Technical Director at Rokkit200.

   This is my personal digital space where I share side projects, experiments,
   and thinking about [topics]. It's not a portfolio—it's where I explore ideas,
   build tools for myself, and share what I'm learning.
   ```

3. **Ensure content structure is clear:**
   - Use semantic HTML (h1, h2, p tags appropriately)
   - Break up long paragraphs
   - Consider adding visual separation between tiers (without design changes, just structure)

**Acceptance Criteria:**
- [ ] Hero content has three clear tiers of information
- [ ] Tone is more conversational and welcoming
- [ ] Clear distinction between personal space vs. professional work
- [ ] Mentions Rokkit200 but doesn't make it the focus
- [ ] Explains what visitors will find on the site

**Testing:**
- Read through hero as a first-time visitor
- Verify it answers: Who are you? What is this site? Why should I explore?

---

### Task 1.3: Establish Content Hierarchy

**Objective:** Define and document the content hierarchy across the site.

**Files to Create/Modify:**
- `src/content/config.ts` - Content collections configuration
- Create `CONTENT-STRUCTURE.md` - Documentation of content organization

**Implementation Steps:**

1. **Document current content types:**
   ```markdown
   # Content Types

   ## Projects
   - Full projects only (complete, polished side projects)
   - Location: src/content/projects/

   ## Writing (Digital Garden)
   - Essays/Articles (polished long-form)
   - Notes (quick thoughts, TILs, technical discoveries)
   - Explorations (notes with embedded prototypes - special type of note)
   - Life (personal updates)
   - Location: src/content/writing/, src/content/notes/, src/content/life/

   ## Other
   - About page
   - Bookmarks (to be added)
   - Changelog (to be added)
   ```

2. **Update content collections schema:**
   - Ensure all content types have consistent frontmatter
   - Add fields needed for new features (status, connections, etc.)

3. **Create content type indicators:**
   - Add `contentType` or `type` field to frontmatter
   - Standardize values: 'project', 'exploration', 'essay', 'note', 'life'

**Acceptance Criteria:**
- [ ] Content hierarchy documented in CONTENT-STRUCTURE.md
- [ ] Content collections properly configured
- [ ] All content has type indicator in frontmatter
- [ ] Consistent metadata across content types

---

## Phase 2: Content Organization & Pages

### Task 2.1: Create Unified Writing Section

**Objective:** Consolidate Notes, Writing, and Life into a single /writing/ section with internal filtering.

**Files to Modify:**
- `src/pages/writing/[...page].astro` - Main writing index
- `src/pages/writing/[id]/index.astro` - Individual post pages
- Create `src/components/ContentTypeFilter.astro` - Filter component

**Implementation Steps:**

1. **Create unified writing index:**
   - Fetch all content from writing/, notes/, life/ collections
   - Combine and sort by date
   - Add type badges/indicators for each post

2. **Implement filtering:**
   ```astro
   // Filter options: All, Essays, Notes, Life
   <ContentTypeFilter types={['all', 'essay', 'note', 'life']} />
   ```

3. **Update individual post pages:**
   - Add type badge/indicator at top
   - Keep consistent layout across all types
   - Ensure wikilinks and backlinks work

4. **Add section descriptions:**
   - Brief explanation of each content type
   - Help visitors understand the difference

5. **Handle old URLs:**
   - Set up redirects from /notes/* to /writing/*
   - Set up redirects from /life/* to /writing/*
   - Or keep old URLs working with same content

**Acceptance Criteria:**
- [ ] /writing/ shows all content types (essays, notes, life)
- [ ] Clear type indicators on each piece of content
- [ ] Filtering works (client-side or via query params)
- [ ] Old URLs redirect appropriately or still work
- [ ] Pagination works for combined content

**Testing:**
- Verify all content appears in /writing/
- Test filtering by type
- Check old URLs redirect correctly
- Verify metadata (dates, tags) display correctly

---

### Task 2.2: Add Support for Exploration Notes

**Objective:** Enable notes to include embedded prototypes, creating "exploration" type notes in the digital garden.

**Files to Create/Modify:**
- `src/content/config.ts` - Update notes/writing schema to support exploration type
- Create `src/components/EmbedPrototype.astro` - Embedding component for prototypes
- `src/pages/writing/[id]/index.astro` - Ensure prototype embeds render
- Note card components - Add "Exploration" type badge support

**Implementation Steps:**

1. **Update notes/writing schema to support explorations:**
   ```typescript
   // In src/content/config.ts
   const notes = defineCollection({
     schema: z.object({
       title: z.string(),
       description: z.string(),
       pubDate: z.date(),
       type: z.enum(['note', 'exploration', 'essay', 'life']).optional(),
       inspiration: z.object({
         title: z.string(),
         url: z.string(),
         author: z.string().optional(),
       }).optional(), // For explorations
       prototypeUrl: z.string().optional(), // For explorations
       tags: z.array(z.string()).optional(),
       // ... other note fields
     }),
   });
   ```

2. **Create prototype embed component:**
   ```astro
   ---
   // EmbedPrototype.astro
   export interface Props {
     url: string;
     type: 'v0' | 'codepen' | 'figma' | 'custom';
     title?: string;
   }
   ---
   <div class="prototype-embed">
     {title && <h3>{title}</h3>}
     {type === 'v0' && <iframe src={url} title={title} />}
     {type === 'codepen' && <iframe src={url} title={title} />}
     {type === 'figma' && <iframe src={url} title={title} />}
     {type === 'custom' && <a href={url} target="_blank">View Prototype →</a>}
   </div>
   ```

3. **Update writing page filtering:**
   - Add "Exploration" to type filter options (Essay, Note, Exploration, Life)
   - Show "Exploration" badge on relevant notes
   - Explorations appear in main /writing/ feed

4. **Update note card component:**
   - Add support for "Exploration" type badge
   - Show inspiration source if present
   - Indicate prototype is embedded

5. **Ensure existing wikilinks work:**
   - Explorations are just notes, so existing wikilink resolution works automatically
   - No changes needed to wikilink system
   - Backlinks work automatically

**Acceptance Criteria:**
- [ ] Notes can have `type: exploration` in frontmatter
- [ ] Exploration notes appear in /writing/ feed
- [ ] "Exploration" type badge displays on cards
- [ ] Prototype embedding component works for common platforms
- [ ] Embedded prototypes render correctly in note pages
- [ ] Inspiration source is shown when present
- [ ] Wikilinks to/from exploration notes work (existing functionality)
- [ ] Backlinks include exploration notes (existing functionality)

**Testing:**
- Create test exploration note with embedded prototype
- Link exploration to project via wikilink
- Verify backlink appears on project page
- Test filtering by "Exploration" type in /writing/
- Verify prototype embeds render correctly
- Check that exploration notes integrate seamlessly with other notes

---

### Task 2.3: Enhance Project Pages Structure

**Objective:** Update project detail pages with new content structure focused on personal motivation and learning.

**Files to Modify:**
- `src/pages/projects/[id]/index.astro` - Project detail template
- Update existing project markdown files in `src/content/projects/`

**Implementation Steps:**

1. **Update project schema (if needed):**
   ```typescript
   const projects = defineCollection({
     schema: z.object({
       title: z.string(),
       description: z.string(),
       status: z.enum(['active', 'maintained', 'completed', 'archived']),
       year: z.number(),
       techStack: z.array(z.string()),
       category: z.enum(['open-source', 'tool', 'theme', 'experiment']),
       links: z.object({
         demo: z.string().optional(),
         github: z.string().optional(),
         website: z.string().optional(),
       }).optional(),
       // ... other fields
     }),
   });
   ```

2. **Create new project page template structure:**
   ```astro
   <article>
     <header>
       <h1>{title}</h1>
       <p class="description">{description}</p>
       <div class="meta">
         <span>{year}</span>
         <span>{status}</span>
         <span>{category}</span>
       </div>
     </header>

     <section class="why-i-built-this">
       <h2>Why I Built This</h2>
       <!-- Content from markdown -->
     </section>

     <section class="what-i-learned">
       <h2>What I Learned</h2>
       <!-- Content from markdown -->
     </section>

     <section class="tech-stack">
       <h2>Tech Stack</h2>
       <ul>{techStack.map(t => <li>{t}</li>)}</ul>
     </section>

     <section class="current-status">
       <h2>Current Status</h2>
       <!-- Status with explanation -->
     </section>

     <section class="links">
       {links.demo && <a href={links.demo}>View Demo</a>}
       {links.github && <a href={links.github}>View Source</a>}
     </section>

     <section class="related-explorations">
       <h2>Related Explorations</h2>
       <!-- Backlinks to explorations -->
     </section>
   </article>
   ```

3. **Update existing project files:**
   - Add headings: "Why I Built This", "What I Learned", etc.
   - Ensure consistent structure across all projects
   - Add missing metadata

4. **Add previous/next navigation:**
   - Get adjacent projects by date or manual ordering
   - Add navigation links at bottom of page

5. **Show related explorations:**
   - Query backlinks from exploration notes (notes with `type: exploration` that link to this project)
   - Display as list or cards
   - Show the connection/relationship
   - Title: "Related Explorations" or "Early Explorations"

**Acceptance Criteria:**
- [ ] Project pages use new structure with clear sections
- [ ] All sections render correctly
- [ ] Tech stack displays as list
- [ ] Status is clearly shown
- [ ] Links to demo/source work
- [ ] Related exploration notes appear via backlinks if they exist
- [ ] Previous/Next navigation works
- [ ] Existing projects updated with new structure

**Testing:**
- View several project pages
- Verify all sections present
- Test navigation between projects
- Check links work
- Verify related exploration notes appear when they wikilink to the project

---

### Task 2.4: Improve Homepage Layout

**Objective:** Reorganize homepage to feature different content types with distinct presentations.

**Files to Modify:**
- `src/pages/index.astro` - Homepage

**Implementation Steps:**

1. **Plan homepage sections:**
   ```
   - Hero (already updated in Task 1.2)
   - Featured Project (1 item, prominent)
   - Latest Thoughts (mixed: essays, notes, explorations, life - 5-6 items)
   - Recent Explorations (3-4 exploration notes specifically)
   - What I'm Reading (optional: recent bookmarks, future phase)
   ```

2. **Implement Featured section:**
   - Manually select or auto-select most recent project
   - Larger card with more detail
   - Clear CTA (View Project, View Source, etc.)

3. **Implement Latest Thoughts:**
   - Mix of all writing types (essays, notes, explorations, life)
   - Show type badge on each (including "Exploration")
   - Limit to 5-6 most recent
   - Link to /writing/ to see all

4. **Implement Recent Explorations:**
   - Show 3-4 most recent exploration notes (notes with `type: exploration`)
   - Smaller cards than Featured
   - Show they include embedded prototypes
   - Link to /writing/?filter=exploration to see all explorations

5. **Add section descriptions:**
   - Brief intro text for each section
   - Help visitors understand what they're looking at

6. **Remove old three-section layout:**
   - Remove separate "Recent Writing", "Recent Notes", "Recent Life"
   - Consolidate into new structure

**Acceptance Criteria:**
- [ ] Homepage has distinct sections: Featured Project, Latest Thoughts, Recent Explorations
- [ ] Each section has different layout/presentation
- [ ] Content types are clearly labeled (including "Exploration" badge)
- [ ] Latest Thoughts includes all writing types (essays, notes, explorations, life)
- [ ] Recent Explorations shows only exploration notes
- [ ] All sections link to appropriate archive pages
- [ ] No duplicate content across sections
- [ ] Responsive on mobile

**Testing:**
- View homepage on desktop and mobile
- Verify content loads from all types
- Test all links
- Ensure visual distinction between sections (without design changes)

---

## Phase 3: New Features & Sections

### Task 3.1: Create Contact Page

**Objective:** Add dedicated contact page with clear contact methods and context.

**Files to Create:**
- `src/pages/contact.astro` - Contact page

**Implementation Steps:**

1. **Create contact page structure:**
   ```astro
   ---
   import Layout from '@layouts/Layout.astro';

   const contactMethods = [
     {
       type: 'Email',
       handle: 'your-email@example.com',
       url: 'mailto:your-email@example.com',
       context: 'Best for: Project inquiries, collaborations',
       icon: 'email',
     },
     {
       type: 'GitHub',
       handle: '@yourusername',
       url: 'https://github.com/yourusername',
       context: 'Best for: Code, contributions, issues',
       icon: 'github',
     },
     // ... other methods
   ];
   ---

   <Layout title="Contact">
     <h1>Get in Touch</h1>
     <p>Interested in connecting? Here's how to reach me:</p>

     <div class="contact-methods">
       {contactMethods.map(method => (
         <article class="contact-method">
           <h2>{method.type}</h2>
           <a href={method.url}>{method.handle}</a>
           <p class="context">{method.context}</p>
         </article>
       ))}
     </div>

     <section class="availability">
       <h2>Response Time</h2>
       <p>I typically respond within [timeframe]. Feel free to follow up if you don't hear back.</p>
     </section>
   </Layout>
   ```

2. **Add contact methods:**
   - Email (primary)
   - GitHub
   - LinkedIn (if applicable)
   - Twitter/X (if applicable)
   - Any other relevant platforms

3. **Add context for each method:**
   - What each is best used for
   - Expected response time
   - Preferences

4. **Update navigation:**
   - Add Contact to main nav (already in Task 1.1)
   - Ensure it's in mobile menu

**Acceptance Criteria:**
- [ ] /contact/ page exists and is accessible
- [ ] All contact methods listed with working links
- [ ] Context provided for each method
- [ ] Page is in main navigation
- [ ] Responsive on mobile

**Testing:**
- Navigate to /contact/
- Test all contact links
- Verify on mobile

---

### Task 3.2: Create Changelog Page

**Objective:** Add changelog page to document site updates and evolution.

**Files to Create:**
- `src/pages/changelog.astro` - Changelog page
- `src/content/changelog/` - Changelog entries (or inline in page)
- Create `src/components/ChangelogItem.astro` - Individual changelog entry

**Implementation Steps:**

1. **Decide on changelog storage:**
   - Option A: Content collection (src/content/changelog/)
   - Option B: Data file (src/data/changelog.json or .ts)
   - Option C: Inline in changelog.astro
   - **Recommendation:** Option B for easy editing

2. **Create changelog data structure:**
   ```typescript
   // src/data/changelog.ts
   export const changelog = [
     {
       version: '2.0.0',
       title: 'Content Restructuring',
       date: new Date('2024-01-15'),
       description: `
         Major reorganization of content structure. Consolidated Notes, Writing,
         and Life into a unified Writing section. Added Explorations content type
         for prototypes and experiments.
       `,
       changes: [
         'Added Explorations content type',
         'Unified Writing section',
         'Simplified navigation',
         'Updated hero area',
       ],
     },
     // ... more entries
   ];
   ```

3. **Create changelog page:**
   ```astro
   ---
   import Layout from '@layouts/Layout.astro';
   import ChangelogItem from '@components/ChangelogItem.astro';
   import { changelog } from '@data/changelog';
   ---

   <Layout title="Changelog">
     <h1>Changelog</h1>
     <p>A history of updates and improvements to this site.</p>

     <div class="changelog">
       {changelog.map(entry => (
         <ChangelogItem {...entry} />
       ))}
     </div>
   </Layout>
   ```

4. **Create ChangelogItem component:**
   ```astro
   ---
   export interface Props {
     version: string;
     title: string;
     date: Date;
     description: string;
     changes?: string[];
   }

   const { version, title, date, description, changes } = Astro.props;
   ---

   <article class="changelog-item">
     <header>
       <span class="version">{version}</span>
       <h2>{title}</h2>
       <time datetime={date.toISOString()}>{date.toLocaleDateString()}</time>
     </header>

     <div class="description">
       <p>{description}</p>
     </div>

     {changes && changes.length > 0 && (
       <ul class="changes">
         {changes.map(change => <li>{change}</li>)}
       </ul>
     )}
   </article>
   ```

5. **Add initial changelog entry:**
   - Document the current restructuring
   - Use semantic versioning
   - Include what changed and why

**Acceptance Criteria:**
- [ ] /changelog/ page exists
- [ ] Changelog entries display in reverse chronological order
- [ ] Each entry has version, title, date, description
- [ ] Clean, scannable layout
- [ ] Initial entry documenting Phase 1-2 work

**Testing:**
- Navigate to /changelog/
- Verify entries display correctly
- Check date formatting
- Verify reverse chronological order

---

### Task 3.3: Update Footer

**Objective:** Redesign footer with changelog link and remove redundant elements.

**Files to Modify:**
- `src/components/Footer.astro` - Footer component

**Implementation Steps:**

1. **Update footer structure:**
   ```astro
   <footer>
     <div class="footer-content">
       <div class="footer-left">
         <p>© {currentYear} Daniel van der Merwe</p>
       </div>

       <div class="footer-right">
         <nav class="footer-nav">
           <a href="/changelog">Changelog</a>
           <a href="https://github.com/yourusername/elysium">Source Code</a>
           <a href="/rss.xml">RSS</a>
         </nav>
       </div>
     </div>
   </footer>
   ```

2. **Remove elements:**
   - Remove social icons (redundant with header/contact)
   - Keep RSS but make it less prominent
   - Remove "All rights reserved" if too formal

3. **Add new links:**
   - Changelog
   - Source Code (GitHub repo)
   - Privacy/Legal (if needed)

4. **Ensure mobile responsive:**
   - Stack on mobile
   - Side-by-side on desktop

**Acceptance Criteria:**
- [ ] Footer has copyright on left, links on right
- [ ] Changelog link present and working
- [ ] Source code link present (if repo is public)
- [ ] RSS link present but subtle
- [ ] Social icons removed
- [ ] Responsive on mobile

**Testing:**
- View footer on all pages
- Test all links
- Verify mobile layout

---

### Task 3.4: Implement Bookmarks Section (Optional)

**Objective:** Create bookmarks/resources page for curated links.

**Priority:** LOW-MEDIUM (can be deferred to later)

**Files to Create:**
- `src/pages/bookmarks.astro` - Bookmarks page
- `src/content/bookmarks/` or `src/data/bookmarks.ts` - Bookmark data
- `src/components/BookmarkItem.astro` - Bookmark component

**Implementation Steps:**

1. **Choose bookmark storage:**
   - Option A: Manual markdown files
   - Option B: JSON/TS data file
   - Option C: External service (Raindrop.io, Notion)
   - **Recommendation:** Option B for now, can integrate service later

2. **Create bookmark data structure:**
   ```typescript
   // src/data/bookmarks.ts
   export const bookmarks = [
     {
       title: 'Enough AI copilots! We need AI HUDs',
       url: 'https://www.geoffreylitt.com/2025/07/27/enough-ai-copilots-we-need-ai-huds',
       author: 'Geoffrey Litt',
       type: 'article',
       tags: ['AI', 'UX', 'tools'],
       dateAdded: new Date('2024-01-10'),
       annotation: 'Inspired my exploration of AI HUD concepts.',
     },
     // ... more bookmarks
   ];
   ```

3. **Create bookmarks page:**
   - List all bookmarks
   - Filter by type (articles, tools, websites, videos)
   - Search/filter by tags
   - Show annotation/reason for bookmarking

4. **Add to homepage (optional):**
   - Show recent 5-10 bookmarks
   - Link to full page

**Acceptance Criteria:**
- [ ] /bookmarks/ page exists
- [ ] Bookmarks listed with metadata
- [ ] Filtering by type works
- [ ] Annotations display
- [ ] External link indicators present

**Note:** This task can be deferred if time is limited. Focus on Phase 1-2 first.

---

## Phase 4: Mobile & Content Refinement

### Task 4.1: Optimize Mobile Navigation

**Objective:** Ensure mobile navigation works well with new structure.

**Files to Modify:**
- `src/components/Header.astro` - Mobile menu
- Any mobile-specific navigation components

**Implementation Steps:**

1. **Test current mobile menu:**
   - Verify hamburger menu opens/closes
   - Check all new nav items appear
   - Ensure search is accessible

2. **Optimize menu organization:**
   - Clear visual hierarchy
   - Easy to tap targets (min 44x44px)
   - Close button accessible

3. **Add mobile-specific features (if needed):**
   - Current page indicator
   - Smooth animations
   - Scroll lock when open

4. **Test on real devices:**
   - iOS Safari
   - Android Chrome
   - Various screen sizes

**Acceptance Criteria:**
- [ ] Mobile menu shows all navigation items
- [ ] Tap targets are adequately sized
- [ ] Menu opens/closes smoothly
- [ ] Current page indicated
- [ ] Search accessible on mobile
- [ ] Works on iOS and Android

**Testing:**
- Test on physical devices or browser DevTools
- Navigate through all sections
- Verify no broken functionality

---

### Task 4.2: Verify Wikilinks Work for Exploration Notes

**Objective:** Ensure existing wikilink system properly handles exploration notes (no changes needed, just verification).

**Files to Verify:**
- Wikilink resolution logic (likely in a utility or remark plugin)
- Backlink generation logic

**Implementation Steps:**

1. **Verify existing implementation works:**
   - Explorations are just notes with `type: exploration`
   - Existing wikilink system should already work
   - No code changes needed

2. **Test wikilink resolution:**
   - Create test exploration note with wikilink to project
   - Create test project with wikilink to exploration note
   - Verify both directions work

3. **Test backlink computation:**
   - Ensure exploration notes are scanned for outgoing wikilinks (should already work)
   - Verify exploration notes appear in backlink lists (should already work)
   - Confirm backlinks show correct content type

4. **Test filtering:**
   - Ensure backlinks can distinguish exploration notes from regular notes
   - Verify type badge displays correctly

**Acceptance Criteria:**
- [ ] Wikilinks to exploration notes resolve correctly (existing functionality)
- [ ] Wikilinks from exploration notes to other content work (existing functionality)
- [ ] Backlinks include exploration notes with correct type indicator
- [ ] Link format works: `[[notes/slug]]` or `[[writing/slug]]`

**Testing:**
- Create test exploration note with wikilinks to project and other notes
- Verify all links work
- Check backlinks display correctly with "Exploration" type indicator
- Confirm no code changes were needed

---

### Task 4.3: Display Backlinks on All Pages

**Objective:** Surface backlinks on project, exploration, and writing pages.

**Files to Modify:**
- `src/pages/projects/[id]/index.astro`
- `src/pages/explorations/[id]/index.astro` (if separate)
- `src/pages/writing/[id]/index.astro`
- Create `src/components/Backlinks.astro`

**Implementation Steps:**

1. **Create Backlinks component:**
   ```astro
   ---
   export interface Props {
     backlinks: Array<{
       title: string;
       url: string;
       type: string; // 'project', 'exploration', 'note', etc.
       excerpt?: string;
     }>;
   }

   const { backlinks } = Astro.props;
   ---

   {backlinks && backlinks.length > 0 && (
     <section class="backlinks">
       <h2>Referenced By</h2>
       <ul>
         {backlinks.map(link => (
           <li>
             <a href={link.url}>
               <span class="type-badge">{link.type}</span>
               {link.title}
             </a>
             {link.excerpt && <p class="excerpt">{link.excerpt}</p>}
           </li>
         ))}
       </ul>
     </section>
   )}
   ```

2. **Add backlinks to page templates:**
   - Query backlinks for current page
   - Pass to Backlinks component
   - Display at bottom of content

3. **Style backlinks section:**
   - Clear heading
   - List format
   - Type badges for different content types

**Acceptance Criteria:**
- [ ] Backlinks display on project pages
- [ ] Backlinks display on exploration pages
- [ ] Backlinks display on writing pages
- [ ] Backlinks show content type
- [ ] Links are clickable and work
- [ ] "No backlinks" state handled gracefully

**Testing:**
- Create content with wikilinks to other content
- Verify backlinks appear on referenced pages
- Test with multiple content types

---

### Task 4.4: Add Content Metadata Enhancements

**Objective:** Add reading time, status indicators, and other metadata throughout the site.

**Files to Modify:**
- Card components (ProjectCard, ExplorationCard, etc.)
- Individual page templates
- Helper utilities for metadata computation

**Implementation Steps:**

1. **Create reading time utility:**
   ```typescript
   // src/utils/readingTime.ts
   export function getReadingTime(text: string): number {
     const wordsPerMinute = 200;
     const words = text.trim().split(/\s+/).length;
     return Math.ceil(words / wordsPerMinute);
   }
   ```

2. **Add reading time to writing:**
   - Compute from markdown content
   - Display on cards and pages
   - Format: "5 min read"

3. **Add status badges:**
   - Projects: Active, Maintained, Completed, Archived
   - Explorations: Active, Parked, Contributed, Standalone
   - Notes: Seedling, Budding, Evergreen (if using digital garden metaphor)

4. **Update card components:**
   ```astro
   <article class="card">
     <div class="metadata">
       <span class="status">{status}</span>
       <time datetime={date.toISOString()}>{formatDate(date)}</time>
       {readingTime && <span>{readingTime} min read</span>}
     </div>
     <!-- ... rest of card -->
   </article>
   ```

5. **Show last updated date:**
   - Display on pages that are frequently updated
   - Format clearly: "Last updated: Jan 15, 2024"

**Acceptance Criteria:**
- [ ] Reading time displays on writing pages and cards
- [ ] Status badges display on projects and explorations
- [ ] Publication date visible on all content
- [ ] Last updated date shown where relevant
- [ ] Metadata is consistent across site

**Testing:**
- Check various content types
- Verify reading time is reasonable
- Ensure status badges are accurate

---

### Task 4.5: Improve Content Discovery

**Objective:** Enhance search, filtering, and related content features.

**Files to Modify:**
- `src/pages/search.astro` - Search page
- Filter components on projects and writing pages
- Create `src/components/RelatedContent.astro`

**Implementation Steps:**

1. **Enhance project filtering:**
   - Filter by category (Open Source, Tools, Explorations, etc.)
   - Filter by status
   - Filter by technology
   - URL-based filters for shareable links

2. **Enhance writing filtering:**
   - Filter by type (Essay, Note, Life)
   - Filter by tags
   - Sort by date, reading time, etc.

3. **Improve search functionality:**
   - Ensure search includes all content types
   - Add content type indicators in results
   - Consider adding filters to search results

4. **Add related content:**
   ```astro
   ---
   // RelatedContent.astro
   export interface Props {
     currentSlug: string;
     currentTags: string[];
     contentType: string;
   }

   // Query related content based on:
   // - Shared tags
   // - Wikilink connections
   // - Same content type
   // - Same category
   ---

   <section class="related-content">
     <h2>Related</h2>
     <ul>
       {relatedItems.map(item => (
         <li><a href={item.url}>{item.title}</a></li>
       ))}
     </ul>
   </section>
   ```

5. **Surface tag connections:**
   - Show all tags on content
   - Link tags to filtered views
   - Show tag counts

**Acceptance Criteria:**
- [ ] Filtering works on projects page
- [ ] Filtering works on writing page
- [ ] Search includes all content types
- [ ] Related content appears on pages
- [ ] Tags are clickable and filter content
- [ ] URL parameters work for sharing filtered views

**Testing:**
- Test all filter combinations
- Search for various terms
- Verify related content is relevant
- Test tag filtering

---

### Task 4.6: Accessibility Audit

**Objective:** Ensure all content and structure changes are accessible.

**Implementation Steps:**

1. **Semantic HTML check:**
   - Proper heading hierarchy (h1 → h2 → h3)
   - Landmark regions (header, nav, main, footer)
   - Lists for navigation and content groups

2. **Keyboard navigation:**
   - All interactive elements keyboard accessible
   - Logical tab order
   - Skip links if needed
   - Focus indicators visible

3. **Screen reader testing:**
   - Descriptive link text (no "click here")
   - Alt text for images
   - ARIA labels where appropriate
   - Form labels (if any forms added)

4. **Color and contrast:**
   - (Defer to design phase, but note any issues)
   - Ensure type badges have sufficient contrast
   - Don't rely solely on color for information

5. **Test with tools:**
   - axe DevTools
   - WAVE browser extension
   - Lighthouse accessibility audit

**Acceptance Criteria:**
- [ ] Proper heading hierarchy throughout
- [ ] All interactive elements keyboard accessible
- [ ] Links have descriptive text
- [ ] No automated accessibility errors
- [ ] Passes Lighthouse accessibility audit (score > 90)

**Testing:**
- Run automated tools on key pages
- Navigate site with keyboard only
- Test with screen reader (VoiceOver, NVDA, or JAWS)

---

## Testing & Validation

### Overall Testing Checklist

After completing all phases, run through this comprehensive checklist:

**Navigation & Structure:**
- [ ] All main navigation items work on desktop and mobile
- [ ] Active page indicators function correctly
- [ ] Breadcrumbs (if present) show correct path
- [ ] All footer links work
- [ ] Search is accessible and functional

**Content Types:**
- [ ] Projects display correctly (both list and detail views)
- [ ] Explorations display correctly
- [ ] Writing content displays correctly
- [ ] All content types have proper metadata
- [ ] Type badges/indicators are consistent

**Wikilinks & Connections:**
- [ ] Wikilinks resolve correctly across all content types
- [ ] Backlinks appear on all relevant pages
- [ ] Related content suggestions are relevant
- [ ] No broken internal links

**Pages:**
- [ ] Homepage displays all sections correctly
- [ ] /projects/ page works with filtering
- [ ] /writing/ page shows all content types
- [ ] /contact/ page displays all methods
- [ ] /changelog/ page lists entries
- [ ] /about/ page still works
- [ ] Individual content pages render correctly

**Mobile:**
- [ ] All pages responsive on mobile
- [ ] Mobile menu functional
- [ ] Touch targets adequate size
- [ ] Content readable on small screens
- [ ] Images scale appropriately

**Performance:**
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Images optimized
- [ ] Build completes without errors

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Semantic HTML used
- [ ] No automated accessibility errors

---

## Rollback Plan

If issues arise during implementation:

1. **Git branches:** Implement each phase in a separate branch
2. **Testing:** Test thoroughly before merging to main
3. **Backup:** Keep backup of current site before major changes
4. **Gradual rollout:** Deploy phases incrementally
5. **Monitoring:** Watch for 404 errors and broken links after deployment

---

## Post-Implementation

### Documentation Updates Needed:

1. **Update README.md:**
   - Document new content types
   - Explain content organization
   - Update contribution guidelines

2. **Create CONTENT-GUIDE.md:**
   - How to create explorations
   - Wikilink syntax and usage
   - Content frontmatter reference
   - Status definitions

3. **Update .env.example:**
   - Any new environment variables
   - Configuration options

### Future Enhancements (Post-Phase 4):

These can be tackled after the main restructuring is complete:

1. **Bookmarks integration:** Connect to external service
2. **RSS feeds:** Add separate feeds for content types
3. **Newsletter:** Optional newsletter signup
4. **Comments:** Consider adding comments system
5. **Analytics:** Track content engagement
6. **Social sharing:** Add share buttons
7. **Dark mode:** Implement theme switching (design phase)

---

## Success Criteria

The implementation is considered successful when:

1. ✅ All four phases completed
2. ✅ All acceptance criteria met
3. ✅ All tests passing
4. ✅ No broken links or 404 errors
5. ✅ Site builds and deploys successfully
6. ✅ Mobile experience is smooth
7. ✅ Accessibility audit passes
8. ✅ Content properly migrated and organized
9. ✅ Wikilinks and backlinks working across all content
10. ✅ Documentation updated

---

## Timeline Estimate

- **Phase 1:** 2-3 days
- **Phase 2:** 4-5 days
- **Phase 3:** 2-3 days
- **Phase 4:** 2-3 days
- **Testing & refinement:** 1-2 days

**Total:** 11-16 days of development time

---

## Notes for Autonomous Agent

- **Prioritize** completing phases in order (1 → 2 → 3 → 4)
- **Test frequently** after each major change
- **Preserve existing functionality** - don't break what works
- **Ask for clarification** if requirements are ambiguous
- **Document changes** in git commits
- **Update changelog** as you complete each phase
- **Focus on structure and content** - do not change visual styling
- **Leverage existing code** - extend what's there rather than rewriting
- **Check for edge cases** - what if there are no backlinks? No explorations?
- **Mobile-first mindset** - always test responsive behavior

Good luck! 🚀
