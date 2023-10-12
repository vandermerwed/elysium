import getWordCount from "word-count";
import { toString } from "mdast-util-to-string";

export function remarkWordCount() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const wordCount = getWordCount(textOnPage);
    data.astro.frontmatter.wordCount = wordCount;
  };
}