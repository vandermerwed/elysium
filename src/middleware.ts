import { type CollectionEntry, getCollection } from "astro:content";
import { defineMiddleware } from "astro:middleware";
import getOutgoingLinks from "@utils/getOutgoingLinks";
import getIncomingLinks from "@utils/getIncomingLinks";

export const onRequest = defineMiddleware(async (context, next) => {
  //     context.locals.incomingLinks = [];
  //     context.locals.outgoingLinks = [];

  //     var slug: string | undefined = context.params.slug;

  //     const allPosts = await getCollection("blog", ({ data }) => !data.draft);
  //     context.locals.incomingLinks = getIncomingLinks(allPosts, slug || '');

  //     const outgoingLinks = getOutgoingLinks(context.props.post) as string[]; // add type assertion
  //     if (outgoingLinks) {
  //         context.locals.outgoingLinks = allPosts.filter((post) => outgoingLinks.includes(post.slug || ''));
  //     }

  return next();

  //     // Work in progress - show previews of outgoing links on the site on desktop and inline on mobile
  //     // const response = await next();
  //     // const html = await response.text();

  //     // // match internal anchors and append a hidden span after them
  //     // const modifiedHtml = html.replace(/<a[^>]*class=["']?internal["']?[^>]*>([^<]+)<\/a>/g, (match) => {

  //     //     // get the description property for this link from the outgoingLinks array and append it to the link
  //     //     const link = match.match(/(?<=href=")(.*?)(?=")/g);
  //     //     const linkUrl = link ? link[0] : '';

  //     //     const outgoingLinkPost = context.locals.outgoingLinks.find((post) => {
  //     //         // console.log("Post URL: ", post.data);
  //     //         return post.slug === linkUrl.replace("/notes/", "");
  //     //     });

  //     //     return match + `<span class="relative group inline-block cursor-pointer"> [?]<span class="absolute right-0 top-full mt-2 bg-gray-100 border border-gray-300 p-2 w-48 hidden group-hover:block z-10">${outgoingLinkPost?.data?.description}</span></span>`;
  //     // });

  //     // return new Response(modifiedHtml, {
  //     //     status: 200,
  //     //     headers: response.headers
  //     // });
});
