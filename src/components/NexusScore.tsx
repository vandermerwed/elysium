export interface Props {
  score?: string;
  className?: string;
  size?: "sm" | "lg";
  showDescription?: boolean;
}

/**
 * Procedural NexusScore icon — Chladni-pattern inspired.
 *
 * Uses a 16×16 viewBox with thin strokes for clean small-size rendering.
 * The `size` prop sets rendered width/height directly (no CSS scale transforms).
 *
 * All roles share a circular boundary (the "vibrating plate").
 * Internal nodal-line patterns encode the topology role:
 *   T (Terminal)  — bare circle, fundamental mode (0,1)
 *   R (Relay)     — circle + one diameter (1,0 mode)
 *   B (Bridge)    — circle + diagonal cross (1,1 mode)
 *   A (Authority) — concentric rings (0,2 mode)
 *   H (Hub)       — circle + full star (2,1 mode)
 *
 * Stage controls stroke style + fill:
 *   0 Fragment   — dashed outline
 *   1 Basic      — solid outline
 *   2 Developed  — solid + light fill
 *   3 Advanced   — solid + medium fill + inner accent
 *   4 Integrated — solid + strong fill + inner accent
 */

const STAGES = ["Fragment", "Basic", "Developed", "Advanced", "Integrated"] as const;

function stageLevel(stage: string): number {
  return Math.max(0, (STAGES as readonly string[]).indexOf(stage));
}

/* ── Chladni-pattern renderers (16×16 viewBox, center 8,8, plate r=6) ── */

/** Terminal — fundamental mode: bare circle, the simplest resonance. */
function renderTerminal(lv: number, dash: string | undefined, fill: number) {
  return (
    <>
      <circle cx="8" cy="8" r="6" strokeDasharray={dash}
        fill={fill > 0 ? "currentColor" : "none"} fillOpacity={fill} />
      {lv >= 3 && (
        <circle cx="8" cy="8" r="1.5" fill="currentColor" fillOpacity={0.7} stroke="none" />
      )}
    </>
  );
}

/** Relay — mode (1,0): circle + horizontal diameter suggesting directional flow. */
function renderRelay(lv: number, dash: string | undefined, fill: number) {
  return (
    <>
      <circle cx="8" cy="8" r="6" strokeDasharray={dash}
        fill={fill > 0 ? "currentColor" : "none"} fillOpacity={fill} />
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray={dash} />
      {lv >= 3 && (
        <>
          <circle cx="2" cy="8" r="1" fill="currentColor" fillOpacity={0.7} stroke="none" />
          <circle cx="14" cy="8" r="1" fill="currentColor" fillOpacity={0.7} stroke="none" />
        </>
      )}
    </>
  );
}

/** Bridge — mode (1,1): circle + diagonal cross connecting opposite regions. */
function renderBridge(lv: number, dash: string | undefined, fill: number) {
  return (
    <>
      <circle cx="8" cy="8" r="6" strokeDasharray={dash}
        fill={fill > 0 ? "currentColor" : "none"} fillOpacity={fill} />
      <line x1="3.8" y1="3.8" x2="12.2" y2="12.2" strokeDasharray={dash} />
      <line x1="12.2" y1="3.8" x2="3.8" y2="12.2" strokeDasharray={dash} />
      {lv >= 3 && <circle cx="8" cy="8" r="1.5" fill="none" />}
    </>
  );
}

/** Authority — mode (0,2): concentric rings denoting concentrated influence. */
function renderAuthority(lv: number, dash: string | undefined, fill: number) {
  return (
    <>
      <circle cx="8" cy="8" r="6" strokeDasharray={dash}
        fill={fill > 0 ? "currentColor" : "none"} fillOpacity={fill} />
      <circle cx="8" cy="8" r="2.5" strokeDasharray={dash} fill="none" />
      {lv >= 3 && (
        <>
          <line x1="8" y1="2" x2="8" y2="5.5" />
          <line x1="8" y1="10.5" x2="8" y2="14" />
          <line x1="2" y1="8" x2="5.5" y2="8" />
          <line x1="10.5" y1="8" x2="14" y2="8" />
        </>
      )}
    </>
  );
}

/** Hub — mode (2,1): circle + full star of nodal lines, maximal complexity. */
function renderHub(lv: number, dash: string | undefined, fill: number) {
  return (
    <>
      <circle cx="8" cy="8" r="6" strokeDasharray={dash}
        fill={fill > 0 ? "currentColor" : "none"} fillOpacity={fill} />
      <line x1="8" y1="2" x2="8" y2="14" strokeDasharray={dash} />
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray={dash} />
      {lv >= 2 && (
        <>
          <line x1="3.8" y1="3.8" x2="12.2" y2="12.2" />
          <line x1="12.2" y1="3.8" x2="3.8" y2="12.2" />
        </>
      )}
      {lv >= 3 && <circle cx="8" cy="8" r="1.5" fill="none" />}
    </>
  );
}

function renderFallback() {
  return <circle cx="8" cy="8" r="4" />;
}

/* ── role tables ────────────────────────────────────────────── */

const ROLE_NAMES: Record<string, string> = {
  B: "Bridge",
  A: "Authority",
  H: "Hub",
  R: "Relay",
  T: "Terminal",
};

const ROLE_RENDERERS: Record<string, typeof renderBridge> = {
  B: renderBridge,
  A: renderAuthority,
  H: renderHub,
  R: renderRelay,
  T: renderTerminal,
};

/* ── main component ────────────────────────────────────────── */

function NexusScore({
  score = "XX",
  className,
  size = "lg",
  showDescription = false,
}: Props) {
  const pattern = /^(B|A|H|R|T)_(Fragment|Basic|Developed|Advanced|Integrated)$/;
  const m = score.match(pattern);

  const role = m ? m[1] : "";
  const stage = m ? m[2] : "";
  const lv = stageLevel(stage);
  const dash = lv === 0 ? "2 1.5" : undefined;
  const fill = lv <= 1 ? 0 : lv === 2 ? 0.15 : lv === 3 ? 0.3 : 0.45;

  const renderer = ROLE_RENDERERS[role];
  const px = size === "sm" ? 16 : 24;

  function getDisplayName() {
    const roleName = ROLE_NAMES[role] ?? "Unknown";
    return `${stage} ${roleName}`;
  }

  return (
    <span className={`nexus-score flex items-center ${className ?? ""}`}>
      {showDescription && <span className="mr-3 text-lg">Nexus Score</span>}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={px}
        height={px}
        viewBox="0 0 16 16"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
      >
        {renderer ? renderer(lv, dash, fill) : renderFallback()}
      </svg>
      {showDescription && (
        <span className="ml-3 text-lg">
          <code>{getDisplayName()}</code>
        </span>
      )}
    </span>
  );
}

export default NexusScore;
