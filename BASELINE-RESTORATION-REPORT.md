# WX 2026 — BASELINE RESTORATION REPORT

The combined Pass 9.1 mobile implementation is abandoned. This document records
the reconstruction of a clean working copy from the last accepted release
candidate, **v2026.9.0**, with no Pass 9.1 changes applied.

## 1. Source package used
The accepted **Pass 9 release candidate, v2026.9.0** — the complete site
(all ten live pages + `404.html`, the shared foundation, the full asset tree
with WebP + retained `.jpg`/`.png` fallbacks, and the Pass 9 documentation set).
The partially-remediated 2026.9.1 tree was **not** used as a source.

## 2. Files restored (complete v2026.9.0 set)
- **Pages (11):** `index`, `concept`, `creative-direction`, `theme-brief`,
  `setlist`, `lyrics`, `playbook`, `blueprint`, `music-workshop`, `bible-study`,
  and `404.html`.
- **Shared foundation:** `assets/css/{tokens,base,components}.css`;
  `assets/js/{site-config,routes,site,wx-export,wx-music-data,wx-lyrics-data}.js`.
- **Assets:** 107 WebP + **108 retained raster fallbacks** (`.jpg`/`.png`) +
  video/fonts/SVG; the generic-mark `assets/favicon.svg` and
  `assets/apple-touch-icon.png` (the 9.0 icons).
- **Config / tooling:** `package.json`, `package-lock.json`, `robots.txt`,
  `.htmlvalidate.json`, `.prettierrc.json`, `.prettierignore`, `eslint.config.mjs`,
  `playwright.config.mjs`, `.gitignore`, `tools/{audit.mjs,serve.mjs,smoke.spec.mjs}`,
  `.github/workflows/ci.yml`, `VERSION`.
- **Documentation (Pass 9):** `README.md`, `CHANGELOG.md`, `QA-REPORT.md`,
  `FINAL-QA-REPORT.md`, `REMOVED-CODE.md`, `ROUTE-MANIFEST.md`,
  `PERFORMANCE-MATRIX.md`, `EXPORT-LIFECYCLE-MATRIX.md`, `UNRESOLVED.md`.

## 3. Attempted Pass 9.1 files / changes removed (confirmed absent)
None of the Pass 9.1 work is present in the restored baseline (verified by
precise search):
- No `MOBILE-REMEDIATION-REPORT.md`, no `CONTENT-CORRECTIONS.md`.
- No `assets/icons/` (the 9.1 WX-monogram favicon set); the baseline keeps the
  9.0 generic-mark `assets/favicon.svg` / `assets/apple-touch-icon.png`.
- No `2026.9.1` strings anywhere; no Pass-9.1 CSS/JS edits
  (playbook Overview grid, Creative-Direction `.hw` wheel re-position, or
  `.fyp-hex` `position` change).

## 4. Version consistency checks (all = 2026.9.0)
| Location | Value |
|----------|-------|
| `VERSION` | 2026.9.0 |
| `package.json` `version` | 2026.9.0 |
| `package-lock.json` `version` | 2026.9.0 |
| `assets/js/site-config.js` `WX.version` | 2026.9.0 |
| Every page `<meta name="generator">` (×10) | v2026.9.0 |
| `README.md` | 2026.9.0 |
| `FINAL-QA-REPORT.md` / `ROUTE-MANIFEST.md` release reports | 2026.9.0 |

> Correction applied: `README.md` still read `2026.8.0 (Pass 8)` in the accepted
> package (it was never bumped in Pass 9). It was updated to `2026.9.0` to satisfy
> the required cross-file version consistency. This is a documentation line only —
> no page, style, script, asset, content or interaction was changed.

## 5. Audit and validation results
- **Structural audit** (`node tools/audit.mjs .`): **0 errors, 0 warnings**
  (missing refs, case, subpath safety, duplicate IDs, `data:image`, canonical
  drift, metadata/a11y).
- **HTML validation** (`html-validate`, 11 files): **PASS**.
- **Formatting** (`npm run format:check`): **PASS**. (The Pass 9 report docs
  `FINAL-QA-REPORT.md`, `UNRESOLVED.md`, `README.md` — and this report — were
  added to `.prettierignore`, aligning them with the six existing report docs
  already excluded there; a config-only alignment, no doc content reformatted.)
- **Lint** (`eslint`, tooling): **PASS**.
- **Smoke tests** (Playwright, desktop + mobile, all pages): **24 / 24 PASS**.

### Preservation confirmed
- **Ten live pages + `404.html`** — present and loading clean.
- **Shared 28-item catalogue** — `WX_CATALOGUE` = 28 items, numbers 1–28
  contiguous; Setlist and Lyrics both read from it.
- **Safe iframe print/export engine** — `assets/js/wx-export.js` present and
  uses the hidden-iframe `printDocument`; smoke test confirms export leaves the
  page interactive (0 popups, 0 leftover frames).
- **Relative GitHub Pages-safe routes** — 0 leading-slash / absolute-origin refs.
- **Pass 9 accessibility corrections** — `#setRail` no longer `role="tablist"`;
  `#selector` is `role="group"`; `--ink-faint` at `.55` on blueprint/playbook;
  crimson `--crimson-bright` `#bf6470`. (axe was 0 critical/0 serious at Pass 9.)
- **WebP + retained raster fallbacks** — 107 WebP, 108 `.jpg`/`.png` fallbacks.
- **Existing noindex policy** — `meta robots noindex` on creative-direction,
  blueprint, playbook, lyrics (+404); `robots.txt` Disallows the four.
- **Dev config** — audit, html-validate, prettier, eslint and Playwright smoke
  configuration all present and passing.

## 6. Confirmation — no new visual/content/interaction changes
A file-level diff against the accepted v2026.9.0 tree shows exactly **two**
changed files: `README.md` (version line 8.0 → 9.0) and `.prettierignore` (four
report-doc lines added). **No `.html`, `.css`, `.js` page/behaviour file and no
asset was modified.** The restored baseline is therefore visually, textually and
behaviourally identical to the accepted v2026.9.0 release candidate; only
documentation-version and formatting-config consistency were corrected.

**No remediation task was begun in this pass.**
