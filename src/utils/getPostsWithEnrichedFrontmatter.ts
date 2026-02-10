import { render } from "astro:content";
import type { CollectionEntry } from "astro:content";

type CollectionName = "notes" | "writing" | "journal" | "projects";

const getPostsWithEnrichedFrontmatter = async <T extends CollectionName>(
    posts: CollectionEntry<T>[]
) => {
    return Promise.all(
        posts.map(async post => {
            const { remarkPluginFrontmatter } = await render(post);

            // Only include keys from remarkPluginFrontmatter that exist in post.data
            const filteredFrontmatter = remarkPluginFrontmatter
                ? Object.fromEntries(
                    Object.entries(remarkPluginFrontmatter).filter(([key]) =>
                        key in post.data
                    )
                )
                : {};
            const enrichedData: CollectionEntry<T>["data"] = {
                ...post.data,
                ...filteredFrontmatter,
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
