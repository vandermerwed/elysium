import type { MarkdownInstance } from "astro";
import slugify from "./slugify";
import type { CollectionEntry } from "astro:content";
import getNexusScore from "./getNexusScore";

export const getEnrichedFrontmatter = async () => {
  // Get all posts using glob. This is to get the updated frontmatter
  const globPosts = import.meta.glob("../content/blog/*.md*") as Promise<
    CollectionEntry<"blog">["data"][]
  >;

  // Then, set those frontmatter value in a JS Map with key value pair
  const mapFrontmatter = new Map();
  const globPostsValues = Object.values(globPosts);
  await Promise.all(
    globPostsValues.map(async globPost => {
      const { frontmatter } = await globPost();

      mapFrontmatter.set(slugify(frontmatter), {
        ...frontmatter,
        incomingLinks: [],
        outgoingLinks: [],
        externalLinks: [],
      });
    })
  );

  await Promise.all(
    globPostsValues.map(async globPost => {
      const { frontmatter, rawContent } = await globPost();
      const currentSlug = slugify(frontmatter);

      mapFrontmatter.set(currentSlug, {
        ...frontmatter,
        incomingLinks: [],
        outgoingLinks: [],
        externalLinks: [],
      });

      const currentFrontmatter = mapFrontmatter.get(currentSlug);

      // find local links
      const tempPostRawContent = rawContent();
      const referencedPosts = tempPostRawContent.match(
        /(?<=\[\[)(.*?)(?=\]\])/g
      );

      // loop over referencedPosts and add currentSlug to incomingLinks array of each referencedPost
      if (referencedPosts) {
        referencedPosts.forEach((item: string, index: number) => {
          const referencedSlug = item.split("|")[0].replace(".mdx", "");
          const referencedAlias = item.split("|")[1];

          const referencedFrontmatter = mapFrontmatter.get(referencedSlug);

          if (!currentFrontmatter.incomingLinks) {
            currentFrontmatter.incomingLinks = [];
          }

          if (
            referencedFrontmatter &&
            !referencedFrontmatter.incomingLinks.includes(currentSlug)
          ) {
            referencedFrontmatter.incomingLinks.push({
              slug: currentSlug,
              // set frontmatter to currentFrontmatter but omit incoming, outgoing and external links from the object to prevent circular reference
              frontmatter: {
                ...currentFrontmatter,
                incomingLinks: [],
                outgoingLinks: [],
                externalLinks: [],
              },
            });
          }

          if (!currentFrontmatter.outgoingLinks) {
            currentFrontmatter.outgoingLinks = [];
          }

          if (
            currentFrontmatter &&
            !currentFrontmatter.outgoingLinks.some(
              link => link.slug === referencedSlug
            )
          ) {
            currentFrontmatter.outgoingLinks.push({
              slug: referencedSlug,
              // set frontmatter to referencedFrontmatter but omit incoming, outgoing and external links from the object to prevent circular reference
              frontmatter: {
                ...referencedFrontmatter,
                incomingLinks: [],
                outgoingLinks: [],
                externalLinks: [],
              },
            });
          }
        });
      }

      // find outgoingLinks and externalLinks
      const regex =
        /(?<!xmlns=")https?:\/\/[^\s()<>"']+|(?<=\]\()https?:\/\/[^\s()]+(?=\))/g;
      let match;
      while ((match = regex.exec(tempPostRawContent)) !== null) {
        const link = match[0];
        // console.log(`${currentSlug}: `, link, {
        //   ...match,
        //   input: null
        // });
        if (link && link.startsWith("http")) {
          // if the array is undefined, initialize it
          if (!currentFrontmatter.externalLinks) {
            currentFrontmatter.externalLinks = [];
          }

          if (!currentFrontmatter.externalLinks.includes(link)) {
            currentFrontmatter.externalLinks.push(link);
          }
        }
      }
    })
  );

  return mapFrontmatter;
};

const getPostsWithEnrichedFrontmatter = async (
  posts: CollectionEntry<"blog">[]
) => {
  const mapFrontmatter = await getEnrichedFrontmatter();
  return posts.map(post => {
    const slug = slugify(post.data);

    post.data.readingTime = mapFrontmatter.get(slug)?.readingTime;
    post.data.lastModified = mapFrontmatter.get(slug)?.lastModified;
    post.data.wordCount = mapFrontmatter.get(slug)?.wordCount;
    post.data.incomingLinks = mapFrontmatter.get(slug)?.incomingLinks || [];
    post.data.outgoingLinks = mapFrontmatter.get(slug)?.outgoingLinks || [];
    post.data.externalLinks = mapFrontmatter.get(slug)?.externalLinks || [];

    post.data.nexusScore = getNexusScore(post);

    return post;
  });
};

export default getPostsWithEnrichedFrontmatter;
