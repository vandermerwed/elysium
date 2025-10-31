import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";
import NexusScore from "./NexusScore";

export interface Props {
  href?: string;
  frontmatter?: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
  showNexusScore?: boolean;
  nexusScore?: string;
}

const nexusScorePattern = /^(?:R|H|T)_(?:Fragment|Basic|Developed|Advanced|Integrated)$/;

const isValidNexusScore = (value?: string): value is string =>
  typeof value === "string" && nexusScorePattern.test(value);

export default function Card({
  href,
  frontmatter,
  secHeading = true,
  showNexusScore = false,
  nexusScore,
}: Props) {
  const {
    title,
    pubDatetime,
    modDatetime,
    description,
    readingTime,
    nexusScore: frontmatterNexusScore,
  } = frontmatter || {};

  const transitionId = (frontmatter as { id?: string } | undefined)?.id;

  const resolvedNexusScore = isValidNexusScore(nexusScore)
    ? nexusScore
    : isValidNexusScore(frontmatterNexusScore)
      ? frontmatterNexusScore
      : undefined;

  const headerProps = {
    style: { viewTransitionName: transitionId },
    className: "text-2xl font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <div className="inline-flex">
        {showNexusScore && resolvedNexusScore ? (
          <NexusScore score={resolvedNexusScore} className="m-auto mr-2" />
        ) : null}
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
      <Datetime
        hideIcon={true}
        showModified={true}
        pubDatetime={pubDatetime ?? ""}
        modDatetime={modDatetime}
        showTime={false}
        readingTime={readingTime}  />
      <p className="mt-4">{description}</p>
    </li>
  );
}
