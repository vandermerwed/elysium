import { describe, it, expect } from "vitest";
import {
  stageLevel,
  MASKS,
  CHAR_PAIRS,
  getCells,
  ROLE_NAMES,
  parseScore,
  STAGES,
} from "./nexusPatterns";

/* ── Unicode helpers ─────────────────────────────────────────── */

const MIDDLE_DOT    = "\u00B7";   // ·
const BULLET        = "\u2022";   // •
const WHITE_CIRCLE  = "\u25CB";   // ○
const BLACK_CIRCLE  = "\u25CF";   // ●
const BLACK_DIAMOND = "\u25C6";   // ◆

/* ── helpers ─────────────────────────────────────────────────── */

/** Format 9-cell array as a visual 3×3 grid string (for readable assertion messages) */
function grid(cells: string[]): string {
  return [
    cells.slice(0, 3).map(c => c || " ").join(""),
    cells.slice(3, 6).map(c => c || " ").join(""),
    cells.slice(6, 9).map(c => c || " ").join(""),
  ].join("\n");
}

/* ── parseScore ──────────────────────────────────────────────── */

describe("parseScore", () => {
  it("parses valid score strings", () => {
    expect(parseScore("B_Advanced")).toEqual({ role: "B", stage: "Advanced" });
    expect(parseScore("T_Fragment")).toEqual({ role: "T", stage: "Fragment" });
    expect(parseScore("H_Integrated")).toEqual({ role: "H", stage: "Integrated" });
    expect(parseScore("A_Basic")).toEqual({ role: "A", stage: "Basic" });
    expect(parseScore("R_Developed")).toEqual({ role: "R", stage: "Developed" });
  });

  it("returns null for invalid scores", () => {
    expect(parseScore("XX")).toBeNull();
    expect(parseScore("")).toBeNull();
    expect(parseScore("X_Fragment")).toBeNull();
    expect(parseScore("B_Invalid")).toBeNull();
    expect(parseScore("B_fragment")).toBeNull(); // case-sensitive
    expect(parseScore("bridge_Advanced")).toBeNull();
  });

  it("covers all role × stage combinations", () => {
    for (const role of ["B", "A", "H", "R", "T"]) {
      for (const stage of STAGES) {
        const result = parseScore(`${role}_${stage}`);
        expect(result).not.toBeNull();
        expect(result!.role).toBe(role);
        expect(result!.stage).toBe(stage);
      }
    }
  });
});

/* ── stageLevel ──────────────────────────────────────────────── */

describe("stageLevel", () => {
  it("maps stage names to numeric levels 0–4", () => {
    expect(stageLevel("Fragment")).toBe(0);
    expect(stageLevel("Basic")).toBe(1);
    expect(stageLevel("Developed")).toBe(2);
    expect(stageLevel("Advanced")).toBe(3);
    expect(stageLevel("Integrated")).toBe(4);
  });

  it("returns 0 for unknown stages", () => {
    expect(stageLevel("")).toBe(0);
    expect(stageLevel("Invalid")).toBe(0);
  });
});

/* ── MASKS ───────────────────────────────────────────────────── */

describe("MASKS", () => {
  it("all masks have exactly 9 elements", () => {
    for (const [role, mask] of Object.entries(MASKS)) {
      expect(mask, `MASKS.${role}`).toHaveLength(9);
    }
  });

  it("masks contain only 0 or 1", () => {
    for (const [role, mask] of Object.entries(MASKS)) {
      for (const v of mask) {
        expect([0, 1], `MASKS.${role} contains ${v}`).toContain(v);
      }
    }
  });

  it("active-cell counts increase with complexity", () => {
    const counts: Record<string, number> = {};
    for (const [role, mask] of Object.entries(MASKS)) {
      counts[role] = mask.filter(v => v === 1).length;
    }
    expect(counts.T).toBe(1);   // center only
    expect(counts.R).toBe(3);   // middle row
    expect(counts.B).toBe(5);   // diagonal cross
    expect(counts.A).toBe(5);   // cardinal cross
    expect(counts.H).toBe(9);   // full grid
  });

  it("Terminal has only center cell active", () => {
    expect(MASKS.T).toEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  });

  it("Relay has middle row active", () => {
    expect(MASKS.R).toEqual([0, 0, 0, 1, 1, 1, 0, 0, 0]);
  });

  it("Bridge has diagonal cross active", () => {
    expect(MASKS.B).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1]);
  });

  it("Authority has cardinal cross active", () => {
    expect(MASKS.A).toEqual([0, 1, 0, 1, 1, 1, 0, 1, 0]);
  });

  it("Hub has all cells active", () => {
    expect(MASKS.H).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

/* ── CHAR_PAIRS ──────────────────────────────────────────────── */

describe("CHAR_PAIRS", () => {
  it("has one pair per stage", () => {
    expect(CHAR_PAIRS).toHaveLength(5);
  });

  it("Fragment uses same char for active & inactive (uniform grid)", () => {
    expect(CHAR_PAIRS[0][0]).toBe(CHAR_PAIRS[0][1]);
    expect(CHAR_PAIRS[0][1]).toBe(MIDDLE_DOT);
  });

  it("each stage's inactive is the previous stage's active (cascade)", () => {
    for (let i = 1; i < CHAR_PAIRS.length; i++) {
      expect(CHAR_PAIRS[i][1]).toBe(CHAR_PAIRS[i - 1][0]);
    }
  });

  it("active characters use increasingly intricate shapes", () => {
    expect(CHAR_PAIRS[0][0]).toBe(MIDDLE_DOT);     // ·
    expect(CHAR_PAIRS[1][0]).toBe(BULLET);          // •
    expect(CHAR_PAIRS[2][0]).toBe(WHITE_CIRCLE);    // ○
    expect(CHAR_PAIRS[3][0]).toBe(BLACK_CIRCLE);    // ●
    expect(CHAR_PAIRS[4][0]).toBe(BLACK_DIAMOND);   // ◆
  });
});

/* ── getCells ────────────────────────────────────────────────── */

describe("getCells", () => {
  it("always returns exactly 9 cells", () => {
    for (const role of ["T", "R", "B", "A", "H"]) {
      for (let lv = 0; lv <= 4; lv++) {
        expect(getCells(role, lv), `${role} lv${lv}`).toHaveLength(9);
      }
    }
  });

  it("Terminal Fragment: all 9 cells are · (uniform)", () => {
    const cells = getCells("T", 0);
    expect(cells).toEqual([MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT, MIDDLE_DOT]);
  });

  it("Terminal Basic: center •, inactive ·", () => {
    const cells = getCells("T", 1);
    expect(cells[4]).toBe(BULLET);
    for (const i of [0, 1, 2, 3, 5, 6, 7, 8]) {
      expect(cells[i]).toBe(MIDDLE_DOT);
    }
  });

  it("Terminal Developed: center ○, inactive •", () => {
    const cells = getCells("T", 2);
    expect(cells[4]).toBe(WHITE_CIRCLE);
    for (const i of [0, 1, 2, 3, 5, 6, 7, 8]) {
      expect(cells[i]).toBe(BULLET);
    }
  });

  it("Terminal Advanced: center ●, inactive ○", () => {
    const cells = getCells("T", 3);
    expect(cells[4]).toBe(BLACK_CIRCLE);
    for (const i of [0, 1, 2, 3, 5, 6, 7, 8]) {
      expect(cells[i]).toBe(WHITE_CIRCLE);
    }
  });

  it("Terminal Integrated: center ◆, inactive ●", () => {
    const cells = getCells("T", 4);
    expect(cells[4]).toBe(BLACK_DIAMOND);
    for (const i of [0, 1, 2, 3, 5, 6, 7, 8]) {
      expect(cells[i]).toBe(BLACK_CIRCLE);
    }
  });

  it("Hub Integrated: all 9 cells are ◆", () => {
    const cells = getCells("H", 4);
    expect(cells.every(c => c === BLACK_DIAMOND)).toBe(true);
  });

  it("Bridge Advanced shows diagonal ● on ○ field", () => {
    const cells = getCells("B", 3);
    for (const i of [0, 2, 4, 6, 8]) {
      expect(cells[i]).toBe(BLACK_CIRCLE);
    }
    for (const i of [1, 3, 5, 7]) {
      expect(cells[i]).toBe(WHITE_CIRCLE);
    }
  });

  it("Relay Developed shows middle row ○, rest •", () => {
    const cells = getCells("R", 2);
    expect(cells).toEqual([BULLET, BULLET, BULLET, WHITE_CIRCLE, WHITE_CIRCLE, WHITE_CIRCLE, BULLET, BULLET, BULLET]);
  });

  it("Authority Basic shows + pattern with •, rest ·", () => {
    const cells = getCells("A", 1);
    expect(cells).toEqual([MIDDLE_DOT, BULLET, MIDDLE_DOT, BULLET, BULLET, BULLET, MIDDLE_DOT, BULLET, MIDDLE_DOT]);
  });

  it("falls back to Terminal mask for unknown roles", () => {
    const cells = getCells("Z", 0);
    // Should use T mask as fallback
    expect(cells).toEqual(getCells("T", 0));
  });

  it("clamps level to 4 for out-of-range values", () => {
    const cells = getCells("T", 99);
    // Should behave like level 4
    expect(cells).toEqual(getCells("T", 4));
  });
});

/* ── ROLE_NAMES ──────────────────────────────────────────────── */

describe("ROLE_NAMES", () => {
  it("has human names for all 5 roles", () => {
    expect(ROLE_NAMES.B).toBe("Bridge");
    expect(ROLE_NAMES.A).toBe("Authority");
    expect(ROLE_NAMES.H).toBe("Hub");
    expect(ROLE_NAMES.R).toBe("Relay");
    expect(ROLE_NAMES.T).toBe("Terminal");
    expect(Object.keys(ROLE_NAMES)).toHaveLength(5);
  });
});

/* ── visual spot-checks (grid output) ────────────────────────── */

describe("visual grid patterns", () => {
  it("Terminal Fragment is a uniform 3×3 grid of ·", () => {
    expect(grid(getCells("T", 0))).toBe(
      "···\n" +
      "···\n" +
      "···"
    );
  });

  it("Bridge Integrated shows ◆ diagonals on ● field", () => {
    expect(grid(getCells("B", 4))).toBe(
      "◆●◆\n" +
      "●◆●\n" +
      "◆●◆"
    );
  });

  it("Hub Fragment fills all 9 active cells with ·", () => {
    expect(grid(getCells("H", 0))).toBe(
      "···\n" +
      "···\n" +
      "···"
    );
  });

  it("Authority Advanced shows + of ● with ○ in corners", () => {
    expect(grid(getCells("A", 3))).toBe(
      "○●○\n" +
      "●●●\n" +
      "○●○"
    );
  });

  it("Relay Fragment shows uniform · (same as any Fragment)", () => {
    expect(grid(getCells("R", 0))).toBe(
      "···\n" +
      "···\n" +
      "···"
    );
  });
});
