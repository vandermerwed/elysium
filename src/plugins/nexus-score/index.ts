import { visit } from "unist-util-visit";
import getWordCount from "word-count";
import { toString } from "mdast-util-to-string";

/**
 * Remark plugin that extracts content metrics from the AST.
 *
 * Populates remarkPluginFrontmatter with:
 * - wordCount: total words in the document
 * - outgoingLinks: array of internal wikilink/link URLs found in the AST
 * - externalLinks: array of external URLs found in the AST
 *
 * NexusScore is NO LONGER computed here — it's computed post-build via
 * the graphology note graph in getPostsWithEnrichedFrontmatter, which
 * has access to real incoming links across all posts.
 */
export function remarkNexusScore() {
    return async function (tree: any, { data }: any) {
        const outgoingLinks: string[] = [];
        const externalLinks: string[] = [];

        const textOnPage = toString(tree);
        const wordCount = getWordCount(textOnPage);

        // Visit nodes and parse for wikilinks
        visit(tree, "wikiLink", (node: any) => {
            const url = node.data.permalink;
            if (!outgoingLinks.includes(url)) outgoingLinks.push(url);
        });

        // Visit nodes and parse for links
        visit(tree, "link", (node: any) => {
            const url = node.url;
            const isInternal = url.startsWith("/") || url.startsWith("#");

            if (isInternal) {
                if (!outgoingLinks.includes(url)) outgoingLinks.push(url);
            } else {
                if (!externalLinks.includes(url)) externalLinks.push(url);
            }
        });

        // Assign content metrics to frontmatter
        // NexusScore and incomingLinks are computed later via the note graph
        data.astro.frontmatter = {
            ...data.astro.frontmatter,
            wordCount,
            outgoingLinks,
            externalLinks,
        };
    };
}
