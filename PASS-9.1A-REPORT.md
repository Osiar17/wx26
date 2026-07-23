# WX 2026 — PASS 9.1A REPORT (WX monogram icon correction only)

Scope: replace the generic "W" browser/404 icon with the **official WX
monogram**, on the v2026.9.0 baseline. Nothing else was changed. See
BASELINE-CHECK.md for the pre-edit baseline verification.

## What changed (before → after)

- **Before:** a generic double-chevron "W" served as both the browser tab favicon
  (`assets/favicon.svg` / `assets/apple-touch-icon.png`) and the 404 page mark
  (an inline `<svg>` W path).
- **After:** the **official WX monogram** — the actual brand "W" mark taken from
  the Worship Experience wordmark (`assets/wx-logo.png`) — rendered in gold on the
  brand dark rounded square. New icon set under `assets/icons/`:
  `favicon.svg` (scalable, self-contained), `favicon-32.png`, `favicon-16.png`,
  `apple-touch-icon.png`. The 404 mark is now `<img src="assets/icons/favicon.svg">`
  (decorative `alt=""`, since the visible "Worship Experience 2026" eyebrow names
  the site). It is the official monogram, not a re-typed letter or a plain W.

Every HTML page references the same set via **relative, GitHub Pages-safe** paths
with a `?v=2026.9.1A` cache-buster. The old generic `assets/favicon.svg` and
`assets/apple-touch-icon.png` were removed **after** proving no page referenced
them.

## Exact file-change list

**Added**

- `assets/icons/favicon.svg`
- `assets/icons/favicon-32.png`
- `assets/icons/favicon-16.png`
- `assets/icons/apple-touch-icon.png`
- `BASELINE-CHECK.md`, `PASS-9.1A-REPORT.md`

**Removed**

- `assets/favicon.svg` (old generic W)
- `assets/apple-touch-icon.png` (old generic W)

**Modified**

- `index.html`, `concept.html`, `creative-direction.html`, `theme-brief.html`,
  `setlist.html`, `lyrics.html`, `playbook.html`, `blueprint.html`,
  `music-workshop.html`, `bible-study.html` — favicon `<link>` set + `generator`
  version only (**0 non-icon/version lines changed** on every page; layout,
  content and scripts untouched).
- `404.html` — favicon `<link>` set + the brand mark swapped to the monogram
  `<img>` + `generator` version.
- `assets/js/site-config.js` — `WX.version` → `2026.9.1A`, release name.
- `README.md`, `VERSION`, `CHANGELOG.md` — version/notes.
- `package.json`, `package-lock.json` — `version` → `2026.9.1-a` (valid semver).
- `.prettierignore` — added the new report docs (consistent with existing report
  docs).

## Version consistency (2026.9.1A)

`VERSION` 2026.9.1A · `WX.version` 2026.9.1A · page `generator` v2026.9.1A ×10 ·
`README` 2026.9.1A · `package.json` / `package-lock.json` 2026.9.1-a ·
cache-buster `?v=2026.9.1A`.

## Validation (working copy, after edits)

| Check                                    | Result                               |
| ---------------------------------------- | ------------------------------------ |
| `npm run audit`                          | **PASS** — 0 errors / 0 warnings     |
| `npm run validate:html`                  | **PASS**                             |
| `npm run format:check`                   | **PASS**                             |
| `npm run lint`                           | **PASS**                             |
| `npm run test:smoke`                     | **PASS** — 24 / 24                   |
| All icon references resolve              | **PASS** — 0 failed requests         |
| Old generic W icon still in use          | **None** (fully removed)             |
| Every page shows the WX monogram favicon | **11 / 11**                          |
| 404 shows the WX monogram                | **PASS** (renders, `complete`)       |
| JS errors                                | **0**                                |
| Layout / content changes                 | **None** (0 non-icon lines per page) |

## Enlarged previews

Provided alongside this report: `favicon.svg` (rendered), `favicon-32.png`
(enlarged), `apple-touch-icon.png`, and the rendered 404-page mark (before/after).
