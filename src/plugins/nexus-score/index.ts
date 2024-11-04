import { visit } from "unist-util-visit";
import getWordCount from "word-count";
import { toString } from "mdast-util-to-string";
import getNexusScore from "../../utils/getNexusScore";


export function remarkNexusScore() {
    return async function (tree, { data }) {
        let wordCount = 0;
        const incomingLinks: string[] = [];
        const outgoingLinks: string[] = [];
        const externalLinks: string[] = [];

        const textOnPage = toString(tree);
        wordCount = getWordCount(textOnPage);
        data.astro.frontmatter.wordCount = wordCount;

        // console.log("tree: ", JSON.stringify(tree));
        // console.log("data: ", data);

        // Visit nodes and parse for wikilinks
        visit(tree, "wikiLink", (node) => {
            const url = node.data.permalink;
            console.log("url: ", url);
            
            if (!outgoingLinks.includes(url)) outgoingLinks.push(url);
        });

        // Visit nodes and parse for links
        visit(tree, "link", (node) => {
            const url = node.url;
            // console.log("url: ", url);
            const isInternal = url.startsWith('/') || url.startsWith('#');

            if (isInternal) {
                if (!outgoingLinks.includes(url)) outgoingLinks.push(url);
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
