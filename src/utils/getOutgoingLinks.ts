import type { CollectionEntry } from "astro:content";

const getOutgoingLinks = (post: CollectionEntry<"blog">) => {
    if(!post) return [];

    const content = post.body;

    const referencedPosts = content.match(/(?<=\[\[)(.*?)(?=\]\])/g);
    // split each item on pipe and only return the first part
    if (referencedPosts) {
        referencedPosts.forEach((item, index) => {
            referencedPosts[index] = item.split("|")[0];
        });
    }
    return referencedPosts;
};

export default getOutgoingLinks;