/**
 * @deprecated Use type-specific card components instead:
 * WritingCard.astro, JournalCard.astro, NoteCard.astro,
 * ProjectCard.astro, ExplorationCard.astro.
 * Only kept for Search.tsx (React client-side component).
 */
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";
import NexusScore from "./NexusScore";

type ContentCollection = "notes" | "writing" | "journal" | "projects";

export interface Props {
  href?: string;
  frontmatter?: CollectionEntry<ContentCollection>["data"];
  secHeading?: boolean;
  showNexusScore?: boolean;
  nexusScore?: string;
  contentType?: string;
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
  contentType,
}: Props) {
  const {
    title,
    pubDatetime,
    modDatetime,
    description,
    readingTime,
    nexusScore: frontmatterNexusScore,
  } = frontmatter || {};

  // type only exists on notes and journal collections
  const type = (frontmatter as { type?: string } | undefined)?.type;

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

  // Only show badges for special types (exploration, loadout, theme)
  // Regular content is identified by its folder, not a type badge
  const formatTypeLabel = (value?: string) => {
    if (!value) return undefined;
    if (value === "exploration") return "Exploration";
    if (value === "loadout") return "Loadout";
    if (value === "theme") return "Theme";
    return undefined; // Don't show badges for other types
  };

  const typeLabel = formatTypeLabel(type);

  return (
    <li className="my-6" data-content-type={contentType}>
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
      {pubDatetime && (
        <Datetime
          hideIcon={true}
          showModified={true}
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
          showTime={false}
          readingTime={readingTime}
        />
      )}
      {typeLabel && (
        <span className="mt-1 inline-flex w-fit rounded-full border border-skin-line px-2 py-0.5 text-xs uppercase tracking-wide">
          {typeLabel}
        </span>
      )}
      <p className="mt-4">{description}</p>
    </li>
  );
}
