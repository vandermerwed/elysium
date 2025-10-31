/**
 * Applies the 'has-margin-notes' class to the article element if it contains margin notes.
 * This function is used to conditionally apply styles based on the presence of margin notes.
 */
const MARGIN_NOTE_BREAKPOINT_FALLBACK = "60rem";

function getMarginNoteBreakpoint(): string {
  const root = document.documentElement;
  if (!root) return MARGIN_NOTE_BREAKPOINT_FALLBACK;

  const computed = getComputedStyle(root)
    .getPropertyValue("--breakpoint-margin-notes")
    .trim();

  return computed || MARGIN_NOTE_BREAKPOINT_FALLBACK;
}

function convertToPixels(value: string): number {
  const match = value.match(/^([0-9]*\.?[0-9]+)\s*(px|rem|em)?$/i);
  if (!match) {
    return 960;
  }

  const numeric = Number(match[1]);
  if (!Number.isFinite(numeric)) {
    return 960;
  }

  const unit = (match[2] || "px").toLowerCase();
  if (unit === "px") {
    return numeric;
  }

  const rootFontSize = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize || "16"
  );

  if (!Number.isFinite(rootFontSize) || rootFontSize <= 0) {
    return 960;
  }

  return numeric * rootFontSize;
}

function isDesktopViewport(breakpoint: string): boolean {
  try {
    return window.matchMedia(`(min-width: ${breakpoint})`).matches;
  } catch (error) {
    const fallbackPx = convertToPixels(breakpoint);
    return window.innerWidth >= fallbackPx;
  }
}

export function applyMarginNoteClass() {
  const article = document.getElementById("article");
  if (!article) return;
  const hasNotes = Boolean(article.querySelector(".margin-sidenote"));
  article.classList.toggle("has-margin-notes", hasNotes);
}

/**
 * Attaches click event listeners to margin note links for mobile devices.
 * On mobile, clicking a footnote number toggles the visibility of the corresponding note.
 */
export function attachMobileSidenoteToggles() {
  const article = document.getElementById("article");
  if (!article) return;
  const links = Array.from(article.querySelectorAll("sup.margin-note-sup > a"));
  for (const link of links) {
    if ((link as HTMLElement).dataset.sidenoteBound === "true") continue;
    link.addEventListener("click", e => {
      const breakpoint = getMarginNoteBreakpoint();
      const isDesktop = isDesktopViewport(breakpoint);
      if (isDesktop) return;
      e.preventDefault();
      const sup = link.closest("sup");
      const note = sup ? sup.nextElementSibling : null;
      if (note && note.classList.contains("margin-sidenote")) {
        note.classList.toggle("is-open");
      }
    });
    (link as HTMLElement).dataset.sidenoteBound = "true";
  }
}
