import {
  STAGES, stageLevel, MASKS, CHAR_PAIRS, getCells,
  ROLE_NAMES, parseScore,
} from "../utils/nexusPatterns";

export interface Props {
  score?: string;
  className?: string;
  size?: "sm" | "lg";
  showDescription?: boolean;
}

/**
 * NexusScore icon — ASCII Chladni-pattern approach.
 * See nexusPatterns.ts for the pattern logic.
 */

/* ── component ───────────────────────────────────────────────── */

function NexusScore({
  score = "XX",
  className,
  size = "lg",
  showDescription = false,
}: Props) {
  const parsed = parseScore(score);

  const role = parsed?.role ?? "";
  const stage = parsed?.stage ?? "";
  const lv = stageLevel(stage);
  const cells = getCells(role, lv);

  // Cell dimensions (px) — grid is 3×cell square
  const cell = size === "sm" ? 7 : 9;
  const fs = size === "sm" ? 8 : 10;

  const label = parsed
    ? `${stage} ${ROLE_NAMES[role] ?? "Unknown"}`
    : "Unknown";

  return (
    <span className={`nexus-score flex items-center ${className ?? ""}`}>
      {showDescription && <span className="mr-3 text-lg">Nexus Score</span>}{" "}
      <span
        role="img"
        aria-label={label}
        style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(3, ${cell}px)`,
          gridTemplateRows: `repeat(3, ${cell}px)`,
          placeItems: "center",
          fontSize: `${fs}px`,
          lineHeight: 1,
          verticalAlign: "middle",
          flexShrink: 0,
        }}
      >
        {cells.map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </span>
      {showDescription && (
        <span className="ml-3 text-lg">
          <code>{label}</code>
        </span>
      )}
    </span>
  );
}

export default NexusScore;
