import type { CollectionEntry } from "astro:content";
import getNexusScore from "./getNexusScore";

// frontmatter type
type GlobPost = {
  frontmatter: Record<string, any>;
  rawContent: () => string;
};

export const getEnrichedFrontmatter = async () => {
  // Get all posts using glob. This is to get the updated frontmatter
  const globPosts = import.meta.glob<CollectionEntry<"blog">["data"]>("../content/blog/*.md*");

  // Then, set those frontmatter value in a JS Map with key value pair
  const mapFrontmatter = new Map();
  const globPostsValues = Object.values(globPosts);
  await Promise.all(
    globPostsValues.map(async globPost => {
      const frontmatter = await globPost();

      mapFrontmatter.set(frontmatter, {
        ...frontmatter,
        incomingLinks: [],
        outgoingLinks: [],
        externalLinks: [],
      });
    })
  );

  await Promise.all(
    globPostsValues.map(async globPost => {
      // get globPost as GlobPost
      const data = (await globPost() as unknown) as GlobPost;

      const { frontmatter, rawContent } = data;
      const currentSlug = frontmatter.slug;

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
        referencedPosts.forEach((item: string) => {
          const referencedSlug = item.split("|")[0].replace(".mdx", "");
          // const referencedAlias = item.split("|")[1];

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
              (link: { slug: string; }) => link.slug === referencedSlug
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

const getPostsWithEnrichedFrontmatter = async <T extends "blog" | "projects">(posts: CollectionEntry<T>[]) => {
  const mapFrontmatter = await getEnrichedFrontmatter();
  return posts.map(post => {
    // exluide body from the post
    const slug = post.data.slug;

    post.data.readingTime = mapFrontmatter.get(slug)?.readingTime;
    post.data.wordCount = mapFrontmatter.get(slug)?.wordCount;
    post.data.incomingLinks = mapFrontmatter.get(slug)?.incomingLinks || [];
    post.data.outgoingLinks = mapFrontmatter.get(slug)?.outgoingLinks || [];
    post.data.externalLinks = mapFrontmatter.get(slug)?.externalLinks || [];

    post.data.nexusScore = getNexusScore(post);

    return post;
  });
};

export default getPostsWithEnrichedFrontmatter;
