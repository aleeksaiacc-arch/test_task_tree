/**
 * Deployment stamp, baked in at build time by the `build-stamp` plugin in
 * vite.config.ts.
 *
 * It is deliberately not rendered anywhere on the page. To read it, open
 * DevTools and either:
 *   - type `__BUILD__` in the Console, or
 *   - look at the comment / <meta name="x-build"> at the top of <head>.
 */
export type BuildInfo = {
  version: string;
  builtAt: string;
  commit: string;
  branch: string;
  commitDate: string;
  /** null when git was unavailable at build time, so cleanliness is unknown. */
  dirty: boolean | null;
  mode: string;
  /** Development builds only — omitted in production to avoid leaking it. */
  commitFull?: string;
  /** Development builds only — omitted in production to avoid leaking it. */
  commitSubject?: string;
};

export const buildInfo: BuildInfo = __BUILD__;

declare global {
  interface Window {
    __BUILD__: BuildInfo;
  }
}

/**
 * `dirty: null` means "cleanliness unknown", which must not read as clean.
 * When the commit is unknown too, the suffix would only repeat that.
 *
 * Mirrored by `commitLabel` in vite.config.ts; keep the two in step.
 */
function commitLabel(commit: string, dirty: boolean | null): string {
  if (commit === "unknown") return commit;
  if (dirty === null) return `${commit}-unknown`;
  return dirty ? `${commit}-dirty` : commit;
}

export function exposeBuildInfo() {
  window.__BUILD__ = buildInfo;

  // Collapsed so it stays out of the way until someone expands it.
  console.groupCollapsed(
    `%c build %c ${buildInfo.version} · ${commitLabel(
      buildInfo.commit,
      buildInfo.dirty
    )} · ${buildInfo.builtAt} `,
    "background:#333;color:#fff;border-radius:2px 0 0 2px",
    "background:#666;color:#fff;border-radius:0 2px 2px 0"
  );
  console.table(buildInfo);
  console.info("Also available as `__BUILD__` in this console.");
  console.groupEnd();
}
