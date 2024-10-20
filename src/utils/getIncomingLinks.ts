import type { CollectionEntry } from "astro:content";

const getIncomingLinks = (allPosts: CollectionEntry<"blog">[], currentSlug: string) => {
    const incomingLinks: CollectionEntry<"blog">[] = [];
    allPosts.forEach((post) => {
        const content = post.body;
        const referencedPosts = content.match(/(?<=\[\[)(.*?)(?=\]\])/g);
        // split each item on pipe and only return the first part
        if (referencedPosts) {
            referencedPosts.forEach((item, index) => {
                referencedPosts[index] = item.split("|")[0].replace(".mdx", "");
            });
        }
        if (referencedPosts && referencedPosts.includes(currentSlug)) {
            incomingLinks.push(post);
        }
    });
    return incomingLinks;    
};

export default getIncomingLinks;