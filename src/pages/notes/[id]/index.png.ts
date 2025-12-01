import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";

export async function getStaticPaths() {
  const posts = await getCollection("notes").then(p =>
    p.filter(({ data }) => data.status && data.status === "published" && !data.ogImage)
  );

  return posts.map(post => ({
    params: { id: post.id },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props as CollectionEntry<"notes">), {
    headers: { "Content-Type": "image/png" },
  });
