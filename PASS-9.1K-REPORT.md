# PASS 9.1K — Footer Identity Consistency

**Site:** Worship Experience 2026 (static HTML/CSS/vanilla JS, GitHub Pages subpath)
**Display version:** `2026.9.1K` · **Package semver:** `2026.9.1-k`
**Pass label:** Pass 9.1K — Footer Identity Consistency
**Working copy:** `wx2026-pass-9.1K` (duplicated from `wx2026-pass-9.1J-6`; the 9.1J.6 source was **not** modified)
**Date:** 2026-07-23

One consistent, intentional YES Crimson + CCC footer identity treatment across the
whole site, especially on mobile. The fix is delivered as **shared CSS only** — the
canonical identity block now lives once in `assets/css/components.css`, so **no
footer markup changed on any page** (the per-page HTML diffs are the version-meta
bump only). The shared reader controller `assets/js/wx-detail-reader.js` is
**byte-identical**; all fifteen reader families remain functional. No global
navigation, page directory or cross-page return paths were added.

---

## A. Page-by-page footer inventory (pre-edit)

| Page                    | Footer selector                                         | Static / shared / generated   | YES | CCC | Linked?         | Mobile grouping (before)                 | Notes                                                      |
| ----------------------- | ------------------------------------------------------- | ----------------------------- | --- | --- | --------------- | ---------------------------------------- | ---------------------------------------------------------- |
| index.html              | `.foot > .foot-wrap` (`.foot-yes`/`.foot-ccc`)          | static                        | ✓   | ✓   | YES→`#hub`      | row, space-between                       | canonical base                                             |
| concept.html            | `.foot > .foot-wrap`                                    | static                        | ✓   | ✓   | YES→`index#hub` | row, space-between                       | same as index                                              |
| setlist.html            | `.foot` (`.fy`/`.fc`)                                   | static                        | ✓   | ✓   | YES→`index#hub` | row, space-between                       | no wrap div                                                |
| lyrics.html             | `.foot` (`.fy`/`.fc`)                                   | static                        | ✓   | ✓   | YES→`index#hub` | row, space-between                       | no wrap div                                                |
| theme-brief.html        | `.wx-foot` (`.wx-foot-yes`/`.wx-foot-ccc`)              | static                        | ✓   | ✓   | **not linked**  | **column, centred (stacked)**            | **Defect 1** — awkward centred block                       |
| playbook.html           | `.eco-foot` (`.eco-yes`/`.eco-mid`/`.eco-ccc`)          | static (shared chrome)        | ✓   | ✓   | YES→`index#hub` | **column, centred; label between marks** | **Defect 2** — divergent arrangement                       |
| blueprint.html          | `.eco-foot`                                             | static (shared chrome)        | ✓   | ✓   | YES→`index#hub` | row, align flex-end                      | bottom-aligned                                             |
| music-workshop.html     | `.eco-foot`                                             | static (shared chrome)        | ✓   | ✓   | YES→`index#hub` | row, align flex-end                      | bottom-aligned                                             |
| bible-study.html        | `.eco-foot`                                             | static (shared chrome)        | ✓   | ✓   | YES→`index#hub` | row, align flex-end                      | bottom-aligned                                             |
| creative-direction.html | `.eco-foot` (single, after all panels, inside `<main>`) | static, **one shared** footer | ✓   | ✓   | YES→`index#hub` | row, align flex-end                      | **Defect 3** — hidden on the `is-home` landing splash only |
| 404.html                | — (none)                                                | —                             | ✗   | ✗   | —               | —                                        | intentional minimal error page; **left unchanged**         |

Asset paths (every page): `assets/yes-crimson-vertical.{webp,png}`,
`assets/ccc-logo.{webp,png}` — relative, GitHub-Pages-safe, WebP→PNG `<picture>`
fallback, no leading slash, no Base64. All four files resolve.
No duplicate marks on any page; Creative Direction has exactly **one** `.eco-foot`
(verified across all five segments). No fixed control covers any footer.

---

## B. Root cause of each inconsistency

Every page hand-styled its footer identity in **page-inline `<style>`** (there was
no shared footer CSS), so the identity block drifted independently:

1. **Theme Brief** — inline `.wx-foot` set `flex-direction:column; align-items:center`
   at phone widths → the two marks stacked into a tall, isolated centred block.
2. **Playbook** — inline `.eco-foot` also went column on mobile, and because the
   `.eco-mid` label ("Playbook · WX 2026") sits between the marks in source order, it
   landed _between_ YES and CCC.
3. **Creative Direction** — the footer is a single shared `.eco-foot`; it is only
   hidden by `body.is-home .eco-foot{display:none}`, i.e. on the landing splash. On
   the actual Story segment (and all others) it is present and reachable — the
   "missing" report was the pre-entry splash.
4. **Proportion/spacing variance** — logo intrinsic sizes were already uniform
   (YES 42→56px, CCC 28→38px); the visible variance was alignment (center vs
   flex-end vs space-between edges) and mobile row-vs-column.
5. **Shared vs page-specific markup** — four class systems coexist
   (`.foot-wrap`, `.foot`+`.fy/.fc`, `.wx-foot`, `.eco-foot`). These are kept; only
   the identity block's layout is standardised.

---

## C. Canonical identity-block specification

Added once to shared `assets/css/components.css` (covering all four class systems):

- **Marks never distorted** — `width:auto; max-width:100%; object-fit:contain` on
  every mark image; intrinsic heights left to each page (already uniform).
- **Phone (≤760px):** the identity container becomes
  `display:flex; flex-flow:row wrap; align-items:center; justify-content:center`
  with `column-gap:clamp(1.05rem,5vw,1.9rem)` and `row-gap:.55rem`, so **YES + CCC
  read as one compact, centred unit**. Supporting text (`.eco-mid`) is forced onto
  its own line **below** the pair (`order:3; flex-basis:100%`), never between the
  marks. Bottom padding is `calc(1.35rem + env(safe-area-inset-bottom))`.
- **Desktop:** each page keeps its existing footer structure (full-width
  space-between bars, Playbook's 3-part row); the only change is vertical alignment
  standardised to centre (`.eco-foot{align-items:center}`).
- **Focus:** linked marks get a visible keyboard focus ring
  (`.foot-yes/.fy/.eco-yes:focus-visible{outline:2px solid var(--accent)}`).

`!important` is used on the standardising declarations because the per-page footer
layout lives in page-inline `<style>` that would otherwise win the cascade over the
shared sheet. This let the entire fix be **CSS-only, with no footer markup changes**.

---

## D. Exact files, markup and selectors changed

- **`assets/css/components.css`** — appended the canonical footer-identity block and
  the focus rule (the whole fix). Selectors: `.foot-wrap, .foot, .wx-foot, .eco-foot`
  (containers); `.foot-yes/.fy/.eco-yes/.wx-foot-yes` + `.foot-ccc/.fc/.eco-ccc/.wx-foot-ccc`
  (marks); `.eco-mid` (supporting text); `:focus-visible` on linked marks.
- **No page footer markup changed.** The 10 HTML diffs are the generator-meta
  version bump only (`v2026.9.1J` → `v2026.9.1K`); theme-brief and playbook footer
  HTML is byte-for-byte identical to 9.1J.6.
- Version files: `VERSION`, `README.md`, `CHANGELOG.md`, `package.json`,
  `package-lock.json`, `assets/js/site-config.js` (`WX.version="2026.9.1K"`).
- Tests: `tools/smoke.spec.mjs` (+5 footer tests).

---

## E. Creative Direction — five-segment footer evidence

Measured on `#story #elements #mood #identity #musical`, mobile (390) and desktop
(1366):

- **Exactly one** `.eco-foot` on every segment (`count === 1`) — never duplicated by
  segment switching.
- `display:flex` (not hidden) and **2 marks** present on every segment.
- Reachable by real scrolling on mobile (the window/`documentElement` scrolls; footer
  scrolls fully into view) and on desktop.
- The only state that omits it is the intentional `is-home` landing splash (a fixed
  full-screen hero); every actual segment shows it.
- Segment routing, the fifteen reader systems and Explore Sections are untouched;
  the fixed "Explore Sections" control sits **below** the footer, not over it.

Screenshots: `cd-story-320.png`, `cd-story-390.png`, `cd-identity-320.png`,
`cd-desktop.png`.

---

## F. Playbook — preservation evidence

- The operational label `.eco-mid` ("Playbook · WX 2026") is retained and now sits
  **below** the YES + CCC pair on mobile (verified: marks same row, label below).
- On desktop the 3-part row (YES · label · CCC) is preserved.
- Ministry information, task content, filters, completion state, print/export logic
  and the Flow Experience → Blueprint link behaviour were **not touched** (footer-only
  CSS change; no Playbook JS or task markup edited).

Screenshots: `pb-320-before/after.png`, `pb-390-before/after.png`, `pb-desktop-after.png`.

---

## G. Accessibility decision per mark

- **YES Crimson (linked, 9 of 10 footers):** a _functional link_ to `index#hub`. The
  accessible name comes from the anchor's `aria-label` ("YES — Not My Will, But
  Yours"); destination unchanged; visible focus ring added; the link wraps only the
  mark, not unrelated footer content.
- **YES Crimson (theme-brief, unlinked):** an _informative_ image; `alt` describes it.
  Left unlinked — adding a link would be a cross-page return path (out of scope, §L).
- **CCC (all footers, unlinked):** a _standalone informative_ mark with no adjacent
  visible organisation name, so `alt="Calvary Charismatic Centre"` (theme-brief keeps
  its more specific "…, Apenkwa") correctly identifies the church. Not decorative.
- No repeated announcements were introduced; alt text is only where the mark is the
  sole identification.

---

## H. Asset-path verification

`assets/yes-crimson-vertical.webp` (96,410 b), `…vertical.png` (266,217 b),
`assets/ccc-logo.webp` (3,656 b), `assets/ccc-logo.png` (8,426 b) — all present and
referenced with relative paths, WebP→PNG `<picture>` fallback preserved, no
leading-slash paths, no Base64, no duplicated large assets, favicon untouched.

---

## I. Reader-system regression (spec K)

The full Playwright suite (all 38 pre-existing tests, including every one of the
fifteen reader families and the 15-family sweep) passes unchanged, plus 5 new footer
tests → **43 passed**. `wx-detail-reader.js` is byte-identical. Verified: Creative
Direction segment switching keeps a single footer; readers close and restore body
scroll (no lock left on); the footer remains reachable after reader close.

---

## J. Responsive behaviour

Measured 320–1440. Mobile (≤760): every footer is one centred row, marks same row,
consistent gap, no overlap, no clipping, **no horizontal overflow at 320px on any of
the 11 pages**, safe-area bottom inset applied. Desktop (1024–1440): existing footer
structure preserved, marks centred, sizes unchanged (YES 56 / CCC 38px).

---

## K. Checks (all green)

| Check                      | Result                                                               |
| -------------------------- | -------------------------------------------------------------------- |
| `tools/audit.mjs`          | **PASSED — 0 errors, 0 warnings**                                    |
| `html-validate *.html`     | **exit 0**                                                           |
| `prettier --check` (tools) | **All matched files use Prettier code style**                        |
| `eslint`                   | **0 errors**                                                         |
| Playwright smoke           | **43 passed** (38 prior incl. all reader tests + 5 new footer tests) |

New footer tests: theme-brief mobile one-row identity group; CD one shared footer on
all five segments; CD Story footer scrollable into view (mobile); Playbook operational
footer content preserved (label below marks); no 320px horizontal overflow.

---

## L. Version-normalised diff vs 9.1J.6

Ignoring version strings, the only functional change is
`assets/css/components.css` (appended canonical footer block + focus rule) and
`tools/smoke.spec.mjs` (+5 tests). All 10 page HTML diffs are the generator-meta
version bump alone; footer markup is unchanged. Controller identical.

## M. Confirmation

Global-navigation work was **not** started: no Previous/Next page navigation, no page
directory, no cross-page return paths were added. Pass 9.1L was **not** begun.

## N. Deliverables

- `PASS-9.1K-REPORT.md` (this file)
- Complete split working-copy package `wx2026-pass-9.1K.zip.part-*`
- `REASSEMBLE-9.1K.txt` + `UNPACK-9.1K.bat` (double-click reassembler)
- `SHA-256` checksum of the reassembled ZIP
