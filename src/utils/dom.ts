/**
 * Applies the 'has-margin-notes' class to the article element if it contains margin notes.
 * This function is used to conditionally apply styles based on the presence of margin notes.
 */
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
  const breakpoint = getComputedStyle(document.documentElement)
    .getPropertyValue("--breakpoint-margin-notes")
    .trim();
  const links = Array.from(article.querySelectorAll("sup.margin-note-sup > a"));
  for (const link of links) {
    if ((link as HTMLElement).dataset.sidenoteBound === "true") continue;
    link.addEventListener("click", e => {
      const isDesktop = window.matchMedia(`(min-width: ${breakpoint})`).matches;
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
