import { visit } from "unist-util-visit";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";

const DEFAULT_ID_PREFIX = "margin-note";

const normalizeIdentifier = (value) => String(value ?? "").trim().toLowerCase();

const slugify = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function remarkTufteFootnotes(options = {}) {
  const idPrefix = options.idPrefix ?? DEFAULT_ID_PREFIX;

  return (tree) => {
    const definitionMap = new Map();

    visit(tree, "footnoteDefinition", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;
      const key = normalizeIdentifier(node.identifier);
      if (!key) return;
      definitionMap.set(key, { node, parent, index });
    });

    if (!definitionMap.size) {
      return;
    }

    for (const entry of definitionMap.values()) {
      const children = entry.node.children;
      if (children.length !== 1 || children[0].type !== "paragraph") {
        return;
      }

      const paragraph = children[0];
      const hastParagraph = toHast(paragraph, { allowDangerousHtml: true });
      const innerChildren = Array.isArray(hastParagraph.children)
        ? hastParagraph.children
        : [];
      const html = toHtml({ type: "root", children: innerChildren }).trim();
      if (!html) {
        return;
      }

      entry.html = html;
    }

    const usageCounts = new Map();

    visit(tree, "footnoteReference", (node, index, parent) => {
      if (!parent || typeof index !== "number") {
        return;
      }

      const key = normalizeIdentifier(node.identifier);
      if (!key) {
        return;
      }

      const entry = definitionMap.get(key);
      if (!entry?.html) {
        return;
      }

      const count = usageCounts.get(key) ?? 0;
      const uniqueSuffix = count + 1;
      usageCounts.set(key, uniqueSuffix);

      const label = escapeHtml(node.label || node.identifier || uniqueSuffix);
      const slugBase = slugify(key) || "note";
      const noteId = `${idPrefix}-${slugBase}-${uniqueSuffix}`;
      const supHtml = `<sup id="${noteId}-ref" class="margin-note-sup"><a href="#${noteId}" class="footnote-ref margin-note-ref" aria-describedby="${noteId}">${label}</a></sup>`;
      const noteHtml = `<span class="margin-sidenote" id="${noteId}" data-note-label="${label}" role="note">${entry.html}</span>`;

      parent.children.splice(index, 1, {
        type: "html",
        value: `${supHtml}${noteHtml}`,
      });
    });

    const removals = new Map();
    for (const entry of definitionMap.values()) {
      const { parent, index } = entry;
      if (!parent || typeof index !== "number") continue;
      const arr = removals.get(parent) ?? [];
      arr.push(index);
      removals.set(parent, arr);
    }

    for (const [parent, indexes] of removals) {
      indexes
        .sort((a, b) => b - a)
        .forEach((idx) => {
          parent.children.splice(idx, 1);
        });
    }
  };
}
