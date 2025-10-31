import {
  applyMarginNoteClass,
  attachMobileSidenoteToggles,
} from "../utils/dom";

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
