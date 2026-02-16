import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

/** Git short hash. Falls back to "dev". */
export function getGitHash(): string {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "dev";
  }
}

/** package.json version string. */
export function getVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf-8")
    );
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/** "YYYY.MM.DD HH:MM UTC" build timestamp. */
export function getBuildTimestamp(): string {
  const n = new Date();
  const y = n.getUTCFullYear();
  const m = String(n.getUTCMonth() + 1).padStart(2, "0");
  const d = String(n.getUTCDate()).padStart(2, "0");
  const h = String(n.getUTCHours()).padStart(2, "0");
  const min = String(n.getUTCMinutes()).padStart(2, "0");
  return `${y}.${m}.${d} ${h}:${min} UTC`;
}
