import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForProject } from "@utils/generateOgImages";

export async function getStaticPaths() {
  const posts = await getCollection("projects").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { id: post.id },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForProject(props as CollectionEntry<"projects">), {
    headers: { "Content-Type": "image/png" },
  });
