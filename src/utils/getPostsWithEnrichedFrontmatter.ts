import type { CollectionEntry } from "astro:content";

const getPostsWithEnrichedFrontmatter = async <T extends "blog" | "projects">(posts: CollectionEntry<T>[]) => {

    // loop over posts and call render functio nthen update return collection
    return posts.map(post => {
        const { Content, remarkPluginFrontmatter } = post.render();

        // resolve promise
        // console.log("remarkPluginFrontmatter: ", remarkPluginFrontmatter);

        return post;
    }) as CollectionEntry<T>[];
};

export default getPostsWithEnrichedFrontmatter;
