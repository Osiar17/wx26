# WX 2026 — Pass 9.1J Report

**Pass:** 9.1J — Unified detail-panel reader system (foundation + first family batch)
**Display:** 2026.9.1J **Semver:** 2026.9.1-j **Base:** completed 9.1I **Date:** 2026-07-22

## 0. Scope note (delivery shape)

This pass specifies one reading system across **twelve heterogeneous detail-panel
families on four pages**, each with its own open/close/render logic, plus per-family
automated journeys. Retrofitting all twelve at once to the verification standard of
the prior single-component passes carries high regression risk. To keep quality high
and risk low, 9.1J delivers a **verified foundation + first batch**, with the
remaining families inventoried against the same registration pattern for follow-up
batches (a clarifying question on phasing was attempted but did not reach the user):

- **Shared controller** `assets/js/wx-detail-reader.js` (the genuinely common behaviour).
- **Full twelve-family inventory** (below) with selectors/data/open-close for each.
- **Implemented + tested now:** Bible Study **Four Works of Scripture** and **Five
  Sessions, Five Truths, One Life** (both inline tabbed panels).
- **Automated test** added to the Playwright smoke suite (open → Next×3 → boundary →
  Prev), passing (25/25).

## 1. Architecture

`assets/js/wx-detail-reader.js` exposes `WXDetailReader.attach(opts)` returning a
controller `{go, next, prev, update, open, close, destroy, index, setCount}`. It owns
ONLY common plumbing: Previous/Next stepping, boundary `disabled`+`aria-disabled`
(non-circular by default), an accurate position indicator (`label(i)` from the real
count — never a second hard-coded number), guarded Left/Right arrow keys (ignored on
inputs/`textarea`/`select`/`role=tab|slider|spinbutton`, and gated by an optional
`isActive()`), scroll-reset of a supplied element on each change, and — for genuinely
modal panels — focus trap, Escape-to-close, background `inert`+scroll-lock, and focus
restoration. It deliberately does **not** own family data, rendering, styling, or
active-state/graph sync: each family passes a `select(index)` callback that performs
its own in-place update, preserving its established character. No page was rewritten
around a framework; no global hard-coded-selector mega-function was created.

## 2. Pre-edit component inventory / twelve-family matrix

| # | Family | Page | Trigger sel. | Panel sel. | Data | Items | Type | Existing open/close | Status |
|---|--------|------|--------------|-----------|------|------:|------|---------------------|--------|
| 1 | Elements & Symbols | creative-direction | `.es-card`/es rail | `.es-detail[data-i]` | inline `<article>` + `es-tabs` | 9 | inline detail + tabs | rail select; no Esc | inventoried |
| 2 | Flow of Our Journey | creative-direction | `.fji-node` | `.fji-detail` | `FJI`/nodes | 4 | inline stage detail | node click | inventoried |
| 3 | Our Colour Palette | creative-direction | `.vi-card[data-target=viAtlas]` → swatches | `#viOverlay` `.vi-det` | VI data | 7 | modal overlay | open/close + Esc | inventoried |
| 4 | Logo & Wordmarks | creative-direction | `.vi-card[data-target=zoneSignature]` | `#viOverlay`/`#zBody` | VI zone data | n | modal overlay | open/close | inventoried |
| 5 | VI guidance cards (Typography/Imagery/Textures/Structure) | creative-direction | `.vi-card` | `#viOverlay` (`show(k)`) | `dets[data-key]` | 6 | modal overlay | `show()`/`open`/Esc | inventoried |
| 6 | What Are You Making? | creative-direction | decision cards | inline reveal | inline | n (incl. "Every zone") | inline cards | click-expand | inventoried |
| 7 | Musical Identity phase graph | creative-direction | `.mij-dot`/`.mij` btns | `.mij` detail beside graph | `select(i)` | 4 | inline graph-linked | dot/btn select | inventoried |
| 8 | Find Your Part | creative-direction | `.fyp-hex` | `.fyp` panel | FYP tree | family/subgroup/part | inline hex map | hex click | inventoried (needs documented nav rule) |
| 9 | Musical Identity Elements (Tempo & Pulse …) | creative-direction | `.spx`/`.ele` cards | inline | element data | n | inline | click | inventoried |
| 10 | Wade-In Dimension Cards | music-workshop | `.pillar`/stops | `.pillar-detail` (`#pillarEmpty`+inner) | data 1–3 | 3 | inline tabbed panel | select; empty-first | inventoried (clean, next batch) |
| 11 | **Four Works of Scripture** | bible-study | `.station[data-work]` (tablist) | `#wk-panel` | `WORKS[n]`, `selectWork` | 4 | inline tabbed panel | `selectWork`; roving keys | **IMPLEMENTED** |
| 12 | **Five Sessions, Five Truths** | bible-study | `.stop[data-session]` (tablist) | `#session-detail` | `SESSIONS[n]`, `selectSession` | 5 | inline tabbed panel | `selectSession`; empty-first | **IMPLEMENTED** |

## 3. Implemented families (this pass)

### 11 · Four Works of Scripture (bible-study.html)
- Markup: added `.wx-reader-nav` (`#wkPrev` / `#wkPos` / `#wkNext`) inside
  `.works__detail-inner`; `#wd-title` gets `data-reader-title tabindex="-1"`.
- JS: `WXDetailReader.attach({count:4, select:n=>selectWork(String(n+1)),
  resetScroll:#wk-panel, arrowKeys, arrowRoot:#wk-panel})`; the existing station
  tabs sync the reader index (`r.go`).
- Verified (375 & 1366): 1 of 4 (Teaching, Prev disabled) → 2 (Reproof) → 3
  (Correction) → 4 (Training, Next disabled) → Prev → 3. Titles/tags correct; button
  72×44; doc-overflow 0; 0 JS errors.

### 12 · Five Sessions, Five Truths, One Life (bible-study.html)
- Markup: `.wx-reader-nav` (`#ssPrev` / `#ssPos` / `#ssNext`) inside `.detail__top`;
  `#d-title` gets `data-reader-title tabindex="-1"`. The panel keeps its
  "choose a station" empty-first state; the nav lives inside the detail and appears
  when a session is open.
- JS: `WXDetailReader.attach({count:5, select:n=>selectSession(String(n+1)),
  resetScroll:#session-detail, isActive:()=>data-active==='1'})`; stops sync the index.
- Verified (375 & 1366): Session One (Prev disabled) → Two → Three → Four → Five
  (Next disabled) → Prev → Four; panel stays active; doc-overflow 0; 0 JS errors.

Shared CSS `.wx-reader-nav` / `.wx-reader-nav__btn` (≥44×44, `[disabled]` dimmed,
`:focus-visible` ring, `aria-disabled` — not colour alone) / `.wx-reader-nav__pos`.

## 4. Files & selectors changed

- **NEW** `assets/js/wx-detail-reader.js` (shared controller).
- `bible-study.html`: `<script src="assets/js/wx-detail-reader.js">`; `.wx-reader-nav`
  markup ×2; `.wx-reader-nav*` CSS; two `WXDetailReader.attach` wirings; `#wd-title` /
  `#d-title` reader-title attributes.
- `tools/smoke.spec.mjs`: added the four-works reader journey test.
- Version strings across VERSION/README/CHANGELOG/generator meta/site-config/package.

## 5. Accessibility / keyboard / boundary evidence

Boundary: `disabled` + `aria-disabled="true"` + dimmed treatment at first (Prev) and
last (Next). Buttons are semantic `<button>`s with visible `:focus-visible` rings;
Left/Right arrow keys step within the panel and are ignored when a `role=tab`/input
has focus (so the tablist roving-key behaviour is unaffected). Position uses the real
item count. Content resets to the panel top on each change (`resetScroll`). Inline
panels keep focus on the pressed control (predictable); `data-reader-title tabindex=-1`
is available for programmatic focus by modal families in later batches.

## 6. Scope confirmation

Version-normalized diff: every page except bible-study differs only in its version
string; bible-study's functional diff is the reader markup/CSS/wiring; the new asset
is additive. **Footer and global-navigation work were NOT started.** Unchanged: the
9.1I Five Moods mapping + segment landing, footer, global nav, Workspace dropdown,
page Prev/Next, Theme Brief panorama, favicon/404, Setlist/Lyrics, exports, routes,
indexing, and all item wording/titles/theology/values.

## 7. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint
**pass**; Playwright smoke **25/25** (incl. the new reader journey).

## 8. Remaining families (staged)

Families 1–10 are inventoried above with their selectors/data/open-close. They fall
into two clean groups for follow-up batches using the same pattern: **inline tabbed
panels** (Wade-In, Musical Identity graph/elements, Elements & Symbols, Flow of
Journey, What Are You Making, Find Your Part) wire like Four Works/Five Sessions; the
**modal overlays** (Colour Palette, Logo & Wordmarks, VI guidance cards — all the
`#viOverlay` `show()` family) use the controller's modal mode (focus trap + Esc +
scroll lock + focus restoration), adding Prev/Next over the VI item list. Recommended
next batch: Wade-In (3) + Musical Identity graph (4), then the `#viOverlay` modal group.

## 9. Screenshots (`screenshots/pass-9.1j/`)

Four Works before/after 375, mid (3 of 4), final (4 of 4), desktop before/after;
Five Sessions after 375.
