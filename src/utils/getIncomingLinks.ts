import type { CollectionEntry } from "astro:content";

type CollectionName = "notes" | "writing" | "journal" | "projects";

const normalizeReference = (reference: string) =>
    reference
        .split("|")[0]
        .replace(/\.mdx?$/, "")
        .replace(/^\//, "")
        .trim();

const buildReferenceCandidates = (basePath: string, currentId: string) => {
    const normalizedBase = basePath.replace(/^\//, "").replace(/\/$/, "");
    return new Set([
        currentId,
        `${normalizedBase}/${currentId}`,
        `/${normalizedBase}/${currentId}`,
    ]);
};

const getIncomingLinks = (
    allPosts: CollectionEntry<CollectionName>[],
    currentId: string,
    basePath: string
) => {
    const incomingLinks: CollectionEntry<CollectionName>[] = [];
    const candidates = buildReferenceCandidates(basePath, currentId);

    allPosts.forEach(post => {
        const content = post.body;
        if (!content) return;
        const referencedPosts = content.match(/(?<=\[\[)(.*?)(?=\]\])/g);
        if (!referencedPosts) return;

        const normalizedReferences = referencedPosts.map(normalizeReference);
        const isReferenced = normalizedReferences.some(reference =>
            candidates.has(reference)
        );

        if (isReferenced) incomingLinks.push(post);
    });

    return incomingLinks;
};

export default getIncomingLinks;