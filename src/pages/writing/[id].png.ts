import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";

// Writing OG images are served at /writing/<id>.png to match the og:image meta
// built in PostDetails.astro (`/${basePath}/${post.id}.png`). Note: the notes and
// projects generators live at `[id]/index.png.ts`, which emits `/<coll>/<id>/index.png`
// and therefore does NOT match their meta URL — those OG images are currently broken.
export async function getStaticPaths() {
  const posts = await getCollection("writing").then(p =>
    p.filter(
      ({ data }) =>
        data.status &&
        (data.status === "published" || data.status === "release") &&
        !data.ogImage
    )
  );

  return posts.map(post => ({
    params: { id: post.id },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props as CollectionEntry<"writing">), {
    headers: { "Content-Type": "image/png" },
  });
