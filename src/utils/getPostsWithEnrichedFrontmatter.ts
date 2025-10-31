import { render } from "astro:content";
import type { CollectionEntry } from "astro:content";

type CollectionName = "blog" | "projects";

const getPostsWithEnrichedFrontmatter = async <T extends CollectionName>(
    posts: CollectionEntry<T>[]
) => {
    return Promise.all(
        posts.map(async post => {
            const { remarkPluginFrontmatter } = await render(post);

            const enrichedData: CollectionEntry<T>["data"] = {
                ...post.data,
                ...(remarkPluginFrontmatter ?? {}),
            };

            const enrichedPost: CollectionEntry<T> = {
                ...post,
                data: enrichedData,
            };

            return enrichedPost;
        })
    );
};

export default getPostsWithEnrichedFrontmatter;
