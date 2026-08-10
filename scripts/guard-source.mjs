#!/usr/bin/env node
/**
 * Guards against the way this repository was compromised in April 2026.
 *
 * An obfuscated remote-code-execution loader was appended to a committed
 * `vite.config.js`, hidden behind ~1000 spaces of padding on the same line as
 * the closing `});`. Vite resolves `vite.config.js` before `vite.config.ts`, so
 * that file — not the TypeScript source — was the config actually loaded, and
 * the padding kept the payload off-screen in every diff and editor view.
 *
 * Two checks, both cheap enough to run on every build:
 *   1. `vite.config.js` / `vite.config.d.ts` must not exist. `tsc -b` emits to
 *      node_modules/.tmp now, so either file reappearing means something else
 *      put it there.
 *   2. No tracked source file may contain a long run of horizontal whitespace,
 *      or an implausibly long line. Padding is the tell.
 *
 * Run via `yarn guard`; also wired into `yarn build` and CI.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

/** Emitting a config next to the source is exactly what let this happen. */
const FORBIDDEN_FILES = ["vite.config.js", "vite.config.d.ts"];

/** A padded payload hides behind whitespace; 100 is far beyond any formatter. */
const MAX_SPACE_RUN = 100;

/** persons.json's longest legitimate line is 489 chars, hence 500 for code. */
const MAX_LINE_LENGTH = 500;

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

const problems = [];

for (const name of FORBIDDEN_FILES) {
  if (existsSync(path.join(repoRoot, name))) {
    problems.push(
      `${name} exists in the repo root. Vite prefers it over vite.config.ts, ` +
        `so it silently replaces the real config. Delete it and check its ` +
        `contents before running anything.`
    );
  }
}

const tracked = execFileSync("git", ["ls-files", "-z"], {
  cwd: repoRoot,
  encoding: "utf-8",
})
  .split("\0")
  .filter(Boolean);

const spaceRun = new RegExp(`[ \\t]{${MAX_SPACE_RUN},}`);

for (const file of tracked) {
  const ext = path.extname(file);
  const isSource = SOURCE_EXTENSIONS.includes(ext);
  if (!isSource && ext !== ".json") continue;

  const lines = readFileSync(path.join(repoRoot, file), "utf-8").split("\n");

  lines.forEach((line, index) => {
    if (spaceRun.test(line)) {
      problems.push(
        `${file}:${index + 1} has a run of ${MAX_SPACE_RUN}+ spaces or tabs — ` +
          `the padding trick used to hide injected code off-screen.`
      );
    }
    // Data files legitimately carry long lines; source files do not.
    if (isSource && line.length > MAX_LINE_LENGTH) {
      problems.push(
        `${file}:${index + 1} is ${line.length} chars long (limit ` +
          `${MAX_LINE_LENGTH}). Long single lines are how obfuscated payloads ` +
          `are shipped.`
      );
    }
  });
}

if (problems.length > 0) {
  console.error("guard-source: FAILED\n");
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    "\nSee the 'Build artifacts' section of README.md for background."
  );
  process.exit(1);
}

console.log(`guard-source: ok (${tracked.length} tracked files)`);
