import { visit } from "unist-util-visit";
import getWordCount from "word-count";
import { toString } from "mdast-util-to-string";
import getNexusScore from "../../utils/getNexusScore";


export function remarkNexusScore() {
    return async function (tree, { data }) {
        let wordCount = 0;
        let incomingLinks = [];
        let outgoingLinks = [];
        let externalLinks = [];

        const textOnPage = toString(tree);
        wordCount = getWordCount(textOnPage);
        data.astro.frontmatter.wordCount = wordCount;

        // Visit nodes and parse for links
        visit(tree, "link", (node) => {
            const url = node.url;
            const internalLinkPattern = /\[\[(.*?)\]\]/;
            const isInternal = internalLinkPattern.test(url);

            if (isInternal) {
                const slug = url.replace(/^\[\[|\]\]$/g, "").split("|")[0];
                if (!outgoingLinks.includes(slug)) outgoingLinks.push(slug);
            } else {
                if (!externalLinks.includes(url)) externalLinks.push(url);
            }
        });

        // Prepare post data for scoring
        const post = {
            data: {
                title: data.astro.frontmatter.title,
                wordCount,
                incomingLinks,
                outgoingLinks,
                externalLinks,
            },
        };

        // Calculate Nexus Score
        const nexusScore = getNexusScore(post);

        // Assign enriched metadata to frontmatter
        data.astro.frontmatter = {
            ...data.astro.frontmatter,
            wordCount,
            nexusScore,
            incomingLinks,
            outgoingLinks,
            externalLinks,
        };
    };
}
