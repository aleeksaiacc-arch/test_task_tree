# Relatives — family tree

A small single-page app that renders a family tree, lets you drill into a person's
page, and browse all photos in one gallery. Data lives in static JSON files that
ship with the bundle — there is no backend.

- **Stack:** React 19 · TypeScript · Vite 5 · React Router 6 · Chakra UI 3 · i18next
- **Images:** Cloudinary (on-the-fly transformations)
- **Visit notifications:** EmailJS

---

## Quick start

```bash
yarn install          # npm install also works
cp .env.example .env  # then fill in the values (see Environment variables)
yarn dev              # http://localhost:5173
```

## Scripts

| Script                      | What it does                                                    |
| --------------------------- | --------------------------------------------------------------- |
| `yarn dev`                  | Vite dev server with HMR                                        |
| `yarn build`                | Guard, type-check (`tsc -b`), then build to `dist/`             |
| `yarn preview`              | Serve the built `dist/` locally — use this to verify a build     |
| `yarn guard`                | Source guard, see [Build artifacts](#build-artifacts--important) |
| `yarn migrate-person-keys`  | One-off data migration, see [Data](#data)                       |

## Environment variables

All are read at build time through `import.meta.env`, so **they end up in the
client bundle**. Only use keys that are safe to expose publicly (EmailJS public
key, Cloudinary cloud name). Put them in `.env` at the repo root — it is
gitignored.

| Variable                       | Used by                                              |
| ------------------------------ | ---------------------------------------------------- |
| `VITE_EMAILJS_SERVICE_ID`      | [src/utils/notifyVisit.ts](src/utils/notifyVisit.ts) |
| `VITE_EMAILJS_TEMPLATE_ID`     | [src/utils/notifyVisit.ts](src/utils/notifyVisit.ts) |
| `VITE_EMAILJS_PUBLIC_KEY`      | [src/utils/notifyVisit.ts](src/utils/notifyVisit.ts) |
| `VITE_CLOUDINARY_CLOUD_NAME`   | [src/utils/cloudinary.ts](src/utils/cloudinary.ts)   |

## Project layout

```
src/
  main.tsx           entry — providers (Chakra, Router, User) + build stamp
  App.tsx            layout shell: Header / routed content / Footer
  routes.tsx         route table
  buildInfo.ts       deployment stamp exposed to DevTools
  types.ts           Person, PeopleById, PersonWithId
  components/        TreeView, BlockCard, PersonCard, ParentsRow, ChildrenRow, …
  pages/             PersonPage, AllPhotosPage
  context/           UserContext — asks for a visitor name, fires notifyVisit
  data/              persons.json, trees.json, person-ids.json + loaders
  i18n/              i18next setup + locales/ (ru, pl, by, lt, en)
  utils/             cloudinary, formatDate, notifyVisit, parseBio, transliterate
scripts/
  migrate-person-keys.mjs
```

### Routes

| Path            | Page                                                       |
| --------------- | ---------------------------------------------------------- |
| `/`             | Tree, root group `1`                                       |
| `/tree/:id`     | Tree for a specific root group                             |
| `/person/:id`   | Single person: photo, dates, parents, children, bio        |
| `/all-photos`   | Gallery of every photo in the dataset                      |

### Data

People and relationships are plain JSON in [src/data/](src/data/):

- `persons.json` — `{ [id]: Person }`, keyed by a transliterated kebab-case slug
  (`ivanov-ivan-ivanovich`).
- `trees.json` — `{ [rootId]: { parents, descendants } }`, the tree structure.
- `person-ids.json` — alias map, resolves legacy/alternate ids to current keys.

`yarn migrate-person-keys` regenerates slugs from names and rewrites all
references across the three files. It **overwrites those files in place** —
commit or stash first.

### Internationalisation

Five locales: `ru` (default), `pl`, `by`, `lt`, `en`. Fallback is `en`. Strings
live in [src/i18n/locales/](src/i18n/locales/); add a key to every file when you
add one.

---

## Checking deployment details

Every build embeds a stamp describing the commit and time it was produced. It is
**not shown anywhere on the page** — no footer text, no version badge. It is only
reachable through DevTools, so you can confirm which build a given environment is
actually serving.

Open DevTools (`F12` / `Ctrl+Shift+I` / `Cmd+Opt+I`). Three ways to read it:

**1. Console — type `__BUILD__`**

```js
> __BUILD__
{ version: "1.0.0", builtAt: "2026-08-07T13:04:11.512Z", commit: "abc1234", … }
```

The app also prints a collapsed `build` group on load with the same data as a
table.

**2. Elements panel — HTML comment at the top of `<head>`**

```html
<head>
  <!--
    deployment
    version       1.0.0
    builtAt       2026-08-07T13:04:11.512Z
    commit        abc1234
    branch        master
    commitDate    2026-08-07T15:58:02+03:00
    dirty         false
    mode          production
  -->
```

A development build additionally carries `commitFull` and `commitSubject` — see
[Fields](#fields).

Also visible via **View Source** (`Ctrl+U`) — no DevTools needed.

**3. Network / Elements — `<meta name="x-build">`**

A one-line summary in `<head>`, handy for scripted checks:

```html
<meta name="x-build" content="v1.0.0 | abc1234 | master | 2026-08-07T13:04:11.512Z" />
```

```bash
curl -s https://your-site/ | grep x-build
```

### Fields

| Field           | Meaning                                                          |
| --------------- | ---------------------------------------------------------------- |
| `version`       | `version` from `package.json`                                     |
| `builtAt`       | When the bundle was built, ISO-8601 UTC                           |
| `commit`        | Short SHA of `HEAD` at build time                                 |
| `branch`        | Branch built from                                                 |
| `commitDate`    | Author date of that commit                                        |
| `dirty`         | `true` if the working tree had uncommitted changes — a red flag   |
| `mode`          | Vite mode (`production` / `development`)                          |
| `commitFull`    | Full SHA — **development builds only**                            |
| `commitSubject` | That commit's subject line — **development builds only**          |

`commitFull` and `commitSubject` are dropped from production builds. The stamp
is published in the HTML of every deployed page, and full SHAs and free-form
commit subjects routinely carry ticket ids and internal naming.

`branch` comes from `GITHUB_REF_NAME` / `VERCEL_GIT_COMMIT_REF` /
`CF_PAGES_BRANCH` when set, falling back to git. CI checkouts are normally
detached, where git can only answer the literal `HEAD`.

Any git field reads `unknown` when the build ran without git available (a bare
tarball, a shallow CI checkout); `dirty` reads `null` in that case, meaning
"cannot tell" rather than "clean" — and the badge and `<meta>` render it as
`-unknown`, not as a clean stamp. `dirty: true` on a deployed build means it was
not built from a clean commit and is not reproducible.

### How it works

- [vite.config.ts](vite.config.ts) — the `build-stamp` plugin shells out to git,
  injects the comment and `<meta>` via `transformIndexHtml`, and defines the
  `__BUILD__` constant.
- [src/buildInfo.ts](src/buildInfo.ts) — types the constant, assigns
  `window.__BUILD__`, prints the console group.
- [src/main.tsx](src/main.tsx) — calls `exposeBuildInfo()` before mount.

To add a field, add it to `collectBuildInfo()` in the config, to the `BuildInfo`
type, and — if it should survive into production — to `publishableBuildInfo()`.
The HTML comment renders every field automatically.

---

## Build artifacts — important

`tsc -b` used to emit `vite.config.js` next to `vite.config.ts`, and that
artifact was committed. **Vite resolves `vite.config.js` before `vite.config.ts`**,
so whatever sits in the `.js` file wins and the `.ts` source is ignored.

That is not hypothetical. In April 2026 an obfuscated remote-code-execution
loader was appended to the committed `vite.config.js`, hidden behind ~1000
spaces of padding on the same line as the closing `});` so it sat off-screen in
every diff. It executed on every `yarn dev` / `yarn build` until it was found in
August 2026, and the file has since been purged from history.

Three things now stand in the way of a repeat:

- `tsconfig.node.json` emits to `node_modules/.tmp/`, so `tsc -b` no longer
  produces a shadow config.
- `/vite.config.js` and `/vite.config.d.ts` are gitignored.
- [scripts/guard-source.mjs](scripts/guard-source.mjs) fails the build if either
  file reappears, or if any tracked source file contains a 100+ character run of
  whitespace or a line over 500 characters. It runs from `yarn build`, from CI
  ([.github/workflows/guard.yml](.github/workflows/guard.yml)), and from a
  pre-commit hook.

Enable the hook once per clone — hooks are not installed by cloning:

```bash
git config core.hooksPath githooks
```

If `vite.config.js` or `vite.config.d.ts` reappears in the repo root, **read it
before you run anything**, then delete it.
