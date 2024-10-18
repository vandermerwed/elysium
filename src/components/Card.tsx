import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";
import NexusScore from "./NexusScore";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
  showNexusScore?: boolean;
}

export default function Card({
  href,
  frontmatter,
  secHeading = true,
  showNexusScore = true,
}: Props) {
  const { title, slug, pubDatetime, modDatetime, description, readingTime, nexusScore } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: slug },
    className: "text-2xl font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <div className="inline-flex">
        {showNexusScore ? (
          <NexusScore score={nexusScore} className="m-auto mr-2" />
        ) : (
          <></>
        )}
        <a
          href={href}
          className="inline-block text-2xl font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
        >
          {secHeading ? (
            <h2 {...headerProps}>{title}</h2>
          ) : (
            <h3 {...headerProps}>{title}</h3>
          )}
        </a>
      </div>
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} readingTime={readingTime} />
      <p>{description}</p>
    </li>
  );
}
