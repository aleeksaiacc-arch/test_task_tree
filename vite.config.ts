import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Build/deployment stamp.
 *
 * Collected at build time and baked into the bundle so a deployed page can
 * report which commit it was built from. Nothing here is rendered on the page:
 * it lives in an HTML comment, a <meta> tag and window.__BUILD__, so it is only
 * reachable through DevTools / view-source.
 */

/** This file's directory, so nothing below depends on process.cwd(). */
const configDir = fileURLToPath(new URL(".", import.meta.url));

/** Returns trimmed stdout, or null when git is unavailable / the call fails. */
function git(command: string): string | null {
  try {
    return execSync(`git ${command}`, {
      // Without this, `vite --config ../elsewhere/vite.config.ts` would stamp
      // the version from this repo and the commit from whatever repo cwd is in.
      cwd: configDir,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

/** Empty string is as uninformative as null here, so both become "unknown". */
const known = (value: string | null | undefined) => value || "unknown";

/**
 * `dirty: null` means "git was unavailable, cleanliness is unknown" — which
 * must not render the same as a clean tree. When the commit is unknown too,
 * the suffix would only repeat that, so it is dropped.
 *
 * Mirrored by `commitLabel` in src/buildInfo.ts; keep the two in step.
 */
function commitLabel(commit: string, dirty: boolean | null): string {
  if (commit === "unknown") return commit;
  if (dirty === null) return `${commit}-unknown`;
  return dirty ? `${commit}-dirty` : commit;
}

/**
 * CI providers normally check out a detached HEAD, where
 * `rev-parse --abbrev-ref HEAD` answers the literal "HEAD" — useless for the
 * one question this field exists to answer. Trust the provider first.
 */
function resolveBranch(): string {
  const fromEnv =
    process.env.GITHUB_REF_NAME ??
    process.env.VERCEL_GIT_COMMIT_REF ??
    process.env.CF_PAGES_BRANCH;
  if (fromEnv) return fromEnv;

  const fromGit = git("rev-parse --abbrev-ref HEAD");
  return known(fromGit === "HEAD" ? null : fromGit);
}

function collectBuildInfo(mode: string) {
  // Resolved against this file, not process.cwd(), so `vite --config` from
  // another directory still finds the right package.json.
  const pkg = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url), "utf-8")
  );

  // One `git log` for all four commit fields — NUL-separated so a subject
  // containing any printable character still splits correctly.
  const [commitFull, commit, commitDate, commitSubject] = (
    git("log -1 --format=%H%x00%h%x00%cI%x00%s") ?? ""
  ).split("\0");

  const status = git("status --porcelain");

  return {
    version: pkg.version as string,
    // ISO-8601 UTC, e.g. 2026-08-07T13:04:11.512Z
    builtAt: new Date().toISOString(),
    commit: known(commit),
    commitFull: known(commitFull),
    branch: resolveBranch(),
    commitDate: known(commitDate),
    commitSubject: known(commitSubject),
    // true when the working tree had uncommitted changes at build time,
    // null when git was unavailable and we genuinely cannot tell
    dirty: status === null ? null : status !== "",
    mode,
  };
}

/**
 * The stamp is published in the HTML of every deployed page, so production
 * builds drop the two fields that carry free-form internal text: full SHAs and
 * commit subjects routinely leak ticket ids and internal naming.
 */
function publishableBuildInfo(info: ReturnType<typeof collectBuildInfo>) {
  if (info.mode !== "production") return info;

  const { version, builtAt, commit, branch, commitDate, dirty, mode } = info;
  return { version, builtAt, commit, branch, commitDate, dirty, mode };
}

/**
 * Vite serialises injected tag attributes with JSON.stringify, which escapes
 * `"` as `\"` — that is JS escaping, not HTML attribute escaping, so a value
 * containing a quote breaks out of the attribute. Git permits `"` in ref names.
 */
const attrSafe = (value: string) => value.replace(/["<>]/g, "");

export default defineConfig(({ mode }) => {
  const buildInfo = publishableBuildInfo(collectBuildInfo(mode));

  return {
    plugins: [
      react(),
      {
        name: "build-stamp",
        transformIndexHtml(html: string) {
          const oneLine = [
            `v${buildInfo.version}`,
            commitLabel(buildInfo.commit, buildInfo.dirty),
            buildInfo.branch,
            buildInfo.builtAt,
          ]
            .map(attrSafe)
            .join(" | ");

          const comment = [
            "",
            "<!--",
            "  deployment",
            ...Object.entries(buildInfo).map(
              // "--" would terminate the comment early, so it is collapsed
              ([key, value]) =>
                `  ${key.padEnd(14)}${String(value).replace(/--+/g, "-")}`
            ),
            "-->",
          ].join("\n    ");

          const head = /<head[^>]*>/i;
          if (!head.test(html)) {
            // Silently dropping the stamp would be worse than a noisy build.
            console.warn(
              "[build-stamp] no <head> found in index.html — deployment comment not injected"
            );
          }

          return {
            // Raw HTML comment: invisible on the page, visible in the
            // Elements panel and in view-source.
            html: html.replace(head, (open) => open + comment),
            tags: [
              {
                tag: "meta",
                attrs: { name: "x-build", content: oneLine },
                injectTo: "head" as const,
              },
            ],
          };
        },
      },
    ],
    define: {
      __BUILD__: JSON.stringify(buildInfo),
    },
  };
});
