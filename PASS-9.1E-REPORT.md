# WX 2026 — Pass 9.1E Report

**Pass:** 9.1E — four-works mobile text & timeline reflow **only**
**Display version:** 2026.9.1E **Package semver:** 2026.9.1-e
**Base:** completed Pass 9.1D source **Date:** 2026-07-22

## 0. Page identification (important)

The brief titled this "Theme Brief", but the compressed Teaching / Reproof /
Correction / Training-in-Righteousness composition and its connecting timeline —
the content in the supplied screenshots ("What is true?", "Truth is revealed.",
"Misalignment is exposed.") — is rendered on **bible-study.html** (the
"Calibrate" page), not theme-brief.html. theme-brief.html contains the
four _phase_ stations (God Is Good … God Is Glorified) and has no Teaching/Reproof
content. The fix was therefore applied to the page that actually shows the defect,
`bible-study.html`; this is the narrowest correct change.

## 1. Rendering source (investigation)

The four works are **static HTML** inside `.works__rail > .works__stations`
(`role="tablist"`), four `<button class="station" role="tab">` elements. Each
contains four block spans in DOM order: `.station__node` (01–04), `.station__name`
(title), `.station__q` (question), `.station__glyph` (explanation). The detail
panel body is JS-injected on select, but the station text itself is static. The
stations sit on a decorative CSS line (`.works__line` / `.works__line-fill`,
absolutely positioned within `.works__rail`).

## 2. Root cause (measured before editing, 375×667)

Mobile rule (`@media(max-width:760px)`):
`.station{display:grid; grid-template-columns:44px 1fr}`. With four auto-flowed
block children, CSS grid auto-placement produced a 2×2 layout:

| col 1 (44px)          | col 2 (1fr)            |
| --------------------- | ---------------------- |
| `.station__node` (r1) | `.station__name` (r1)  |
| `.station__q` (r2)    | `.station__glyph` (r2) |

So the **question** resolved into the 44px node column and wrapped word-by-word,
and the **explanation** landed in col 2, detached from its question.

Computed **before** (375px, first station):
`.station__q` = **44 px wide × 60 px (3 lines)**, x=15; `.station__glyph` = 240px, x=75.

## 3. Exact change

File **`bible-study.html`**, block `@media(max-width:760px)`. Replaced:

```
.station{display:grid;grid-template-columns:44px 1fr;gap:1rem;align-items:start;padding:0 0 2rem 0}
.station__name{margin-top:.15rem}
.station__glyph{margin-top:.3rem}
```

with an explicit grid-areas layout:

```
.station{display:grid;grid-template-columns:44px minmax(0,1fr);
  grid-template-areas:"node name" "node q" "node glyph";
  column-gap:1rem;row-gap:.15rem;align-items:start;padding:0 0 2rem 0}
.station__node{grid-area:node;align-self:start}
.station__name{grid-area:name;margin-top:.15rem;min-width:0}
.station__q{grid-area:q;margin-top:.5rem;min-width:0}
.station__glyph{grid-area:glyph;margin-top:.3rem;min-width:0;max-width:none}
```

Node stays in col 1; title, question and explanation stack together in the wide
col 2 as one group. `minmax(0,1fr)` + `min-width:0` prevent min-content overflow.
No markup, no JS, no desktop rule, no other selector or page changed.

## 4. Before / after computed (question column width × line count)

|        Width | Before `.station__q` | After `.station__q` |
| -----------: | -------------------- | ------------------- |
|          320 | 44px / 3 lines       | **234px / 2 lines** |
|          360 | 44px / 3 lines       | **271px / 1 line**  |
|          375 | 44px / 3 lines       | **285px / 1 line**  |
|          390 | 44px / 3 lines       | **299px / 1 line**  |
|          414 | 44px / 3 lines       | **321px / 1 line**  |
| 768 (tablet) | 4-col, unchanged     | 4-col, unchanged    |
|  1366 / 1440 | 4-col, unchanged     | 4-col, unchanged    |

## 5. Verification (Chromium/Playwright, repo-subpath server)

All eight required widths on `bible-study.html`:

|    Width | Stations | Min question width | Worst q lines | All complete | H-overflow | JS err | Failed local req |
| -------: | :------: | -----------------: | ------------: | :----------: | :--------: | :----: | :--------------: |
|  320×568 |    4     |                234 |             2 |     yes      |     0      |   0    |        0         |
|  360×640 |    4     |                271 |             1 |     yes      |     0      |   0    |        0         |
|  375×667 |    4     |                285 |             1 |     yes      |     0      |   0    |        0         |
|  390×844 |    4     |                299 |             1 |     yes      |     0      |   0    |        0         |
|  414×896 |    4     |                321 |             1 |     yes      |     0      |   0    |        0         |
| 768×1024 |    4     | 161 (tablet 4-col) |             3 |     yes      |     0      |   0    |        0         |
| 1366×768 |    4     |                264 |             2 |     yes      |     0      |   0    |        0         |
| 1440×900 |    4     |                264 |             2 |     yes      |     0      |   0    |        0         |

- Teaching, Reproof, Correction, Training in Righteousness all read naturally on
  mobile; title, question and explanation stay grouped; no word split; no overlap;
  no clipped explanation; no empty band beside the text; the connecting line stays
  behind content within `.works__rail`; zero horizontal overflow.
- Programme/journey timeline: the four-works rail is the timeline; entries stay
  grouped and in chronological (01→04) order with the decorative line behind them.
- Accordion/tab controls work: click and keyboard Enter open the correct detail
  panel (tab 2 → "02 · Reproof / Misalignment is exposed"; tab 1 → "01 · Teaching").
  Direct page load fine; 0 JS errors; no failed local requests (only the
  sandbox-blocked Google Fonts host — environment limitation).
- Desktop/tablet (1366) before/after screenshots are **byte-identical**.

## 6. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint
**pass**; Playwright smoke **24/24 pass**.

## 7. Scope confirmation

A version-normalized diff shows every other HTML page differs only in its version
string; `bible-study.html`'s only functional change is the mobile `.station` rule
block (plus a comment). Unchanged: the panoramic Journey image and its scroll
behaviour, footer logos, global navigation, Workspace controls, Creative
Direction, Musical Identity, Playbook, favicon/404, Setlist, Lyrics, exports,
routes, indexing policy, wording, phase names/subtitles, page ordering, and
detail-panel behaviour.

## 8. Screenshots

`screenshots/pass-9.1e/`: before/after at 320, 375, 390 (full works rail) and
desktop 1366 before/after (byte-identical).
