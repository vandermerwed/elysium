/**
 * NexusScore ASCII Chladni-pattern logic.
 *
 * A 3×3 dot grid where the spatial pattern of "active" cells encodes the
 * topology role (inspired by Chladni nodal-line patterns on vibrating plates)
 * and character weight encodes the maturity stage.
 *
 * Role → active cells (increasing nodal-line complexity):
 *   T (Terminal)  — center only            (fundamental mode)
 *   R (Relay)     — middle row             (1,0 mode)
 *   B (Bridge)    — diagonal cross         (1,1 mode)
 *   A (Authority) — cardinal cross         (0,2 mode)
 *   H (Hub)       — full grid              (2,2 mode)
 *
 * Stage → character cascade (each stage's active becomes next stage's inactive):
 *   0 Fragment    · / ·          3 Advanced    ● / ○
 *   1 Basic       • / ·          4 Integrated  ◆ / ●
 *   2 Developed   ○ / •
 */

export const STAGES = [
  "Fragment", "Basic", "Developed", "Advanced", "Integrated",
] as const;

export type Stage = (typeof STAGES)[number];

export function stageLevel(stage: string): number {
  return Math.max(0, (STAGES as readonly string[]).indexOf(stage));
}

/** 3×3 role masks (1 = active cell in pattern) */
export const MASKS: Record<string, number[]> = {
  T: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  R: [0, 0, 0, 1, 1, 1, 0, 0, 0],
  B: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  A: [0, 1, 0, 1, 1, 1, 0, 1, 0],
  H: [1, 1, 1, 1, 1, 1, 1, 1, 1],
};

/** Character pairs [active, inactive] per stage level.
 *  Each stage's active char becomes the next stage's inactive char,
 *  creating a cascade of increasing visual intricacy.
 *  All 9 cells are always filled — character choice encodes complexity. */
export const CHAR_PAIRS: [string, string][] = [
  ["\u00B7", "\u00B7"],     // 0 Fragment    · / ·  (uniform, undifferentiated)
  ["\u2022", "\u00B7"],     // 1 Basic       • / ·
  ["\u25CB", "\u2022"],     // 2 Developed   ○ / •
  ["\u25CF", "\u25CB"],     // 3 Advanced    ● / ○
  ["\u25C6", "\u25CF"],     // 4 Integrated  ◆ / ●
];

/**
 * Generate the 9-element array of characters for a 3×3 grid.
 * Each cell is either the "active" or "inactive" character for the
 * given role mask & stage level.
 */
export function getCells(role: string, lv: number): string[] {
  const mask = MASKS[role] ?? MASKS.T;
  const [on, off] = CHAR_PAIRS[Math.min(lv, 4)] ?? CHAR_PAIRS[0];
  return mask.map(m => (m ? on : off));
}

/** Human-readable role names */
export const ROLE_NAMES: Record<string, string> = {
  B: "Bridge",
  A: "Authority",
  H: "Hub",
  R: "Relay",
  T: "Terminal",
};

/** Parse a score string like "B_Advanced" into { role, stage } or null */
export function parseScore(score: string): { role: string; stage: string } | null {
  const re = /^(B|A|H|R|T)_(Fragment|Basic|Developed|Advanced|Integrated)$/;
  const m = score.match(re);
  return m ? { role: m[1], stage: m[2] } : null;
}
