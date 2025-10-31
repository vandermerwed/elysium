function applyMarginNoteClass() {
  const article = document.getElementById("article");
  if (!article) return;
  const hasNotes = Boolean(article.querySelector(".margin-sidenote"));
  article.classList.toggle("has-margin-notes", hasNotes);
}

function attachMobileSidenoteToggles() {
  const article = document.getElementById("article");
  if (!article) return;
  const breakpoint = getComputedStyle(document.documentElement)
    .getPropertyValue("--breakpoint-margin-notes")
    .trim();
  const links = Array.from(
    article.querySelectorAll<HTMLAnchorElement>("sup.margin-note-sup > a")
  );

  for (const link of links) {
    if (link.dataset.sidenoteBound === "true") continue;
    link.addEventListener("click", event => {
      const isDesktop = window
        .matchMedia(`(min-width: ${breakpoint})`)
        .matches;
      if (isDesktop) return;

      event.preventDefault();
      const sup = link.closest("sup");
      const note = sup ? sup.nextElementSibling : null;
      if (note instanceof HTMLElement && note.classList.contains("margin-sidenote")) {
        note.classList.toggle("is-open");
      }
    });
    link.dataset.sidenoteBound = "true";
  }
}

type MarginNoteWindow = typeof window & {
  __applyMarginNoteClass?: typeof applyMarginNoteClass;
  __marginNoteSwapHandler?: boolean;
};

applyMarginNoteClass();

const marginWindow = window as MarginNoteWindow;
marginWindow.__applyMarginNoteClass = applyMarginNoteClass;

if (!marginWindow.__marginNoteSwapHandler) {
  document.addEventListener("astro:after-swap", () => {
    marginWindow.__applyMarginNoteClass?.();
  });
  marginWindow.__marginNoteSwapHandler = true;
}

attachMobileSidenoteToggles();
document.addEventListener("astro:after-swap", attachMobileSidenoteToggles);
