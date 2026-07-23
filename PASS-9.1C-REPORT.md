# WX 2026 — Pass 9.1C Report

**Pass:** 9.1C — Playbook Overview mobile task-layout repair **only**
**Display version:** 2026.9.1C **Package semver:** 2026.9.1-c
**Base:** accepted 9.1B working copy (WX monogram icons) → v2026.9.0 baseline
**Date:** 2026-07-22

## 1. Objective

Repair overlapping / duplicated-looking text in the **Overview** task stream of
`playbook.html` on small mobile screens, without changing any other page, view,
content, data or the desktop presentation.

## 2. Root cause (precise)

The visible Overview task rows are the paged variant `.ov-taskpage .ov-task`.

1. A global rule (outside any media query) fixed every row's height:
   `.ov-taskpage .ov-task{min-height:42px!important;height:42px;padding:.35rem .3rem!important}`
   — correct for the desktop "ten rows per view" pager, wrong for variable-length
   mobile rows.
2. The mobile rule set placed three text layers into the **same grid column**:
   `.ov-taskpage .ov-task__min{grid-column:2}`,
   `.ov-taskpage .ov-task__title{grid-column:2; -webkit-line-clamp:2}`,
   `.ov-taskpage .ov-task__status{grid-column:2}`.

Three stacked layers forced into a single 42px-high track were painted on top of
one another → overlap and duplicated-looking text. The non-paged `.ov-task` mobile
rule (`@media(max-width:560px)`) had the identical column-2 collision.

## 3. Exact changes

File: **`playbook.html`** (only file changed apart from version strings).

### 3a. `@media(max-width:560px)` — plain `.ov-task`

Replaced the three column-2 placements with a stacked `grid-template-areas`
layout (`"due info" "title info" "min info" "status info"`), `align-items:start`,
`height:auto; min-height:0`, `row-gap:.22rem`, per-cell `grid-area`, title
`white-space:normal; overflow:visible; min-width:0`, status `justify-self:start`,
`.task-info` → `grid-area:info` (right edge, spans rows).

### 3b. `@media(max-width:760px)` — paged `.ov-taskpage .ov-task`

Replaced `grid-template-columns:64px minmax(0,1fr) 28px` + column-2 stacking with
the same stacked `grid-template-areas` set (`!important` to override the global
fixed-height rule): `height:auto!important; min-height:0!important`,
`row-gap:.22rem`, title `white-space:normal; overflow:visible; display:block;
-webkit-line-clamp:unset; line-height:1.32; min-width:0`, min/status own rows,
`.task-info` → `grid-area:info; grid-row:auto; align-self:center`.

Reflow order per row: **1. Due date → 2. Task title (wraps) → 3. Ministry /
workstream → 4. Status → 5. Details (i) button** (right edge, ≥40px touch target).

No JS was changed. No desktop rule (`>760px`) was touched.

## 4. Verification

Automated (Chromium/Playwright, dependency-free static server over a repo subpath).

| Width | Rows measured | Overlaps | Clipped titles | H-overflow | JS errors* | Failed reqs* |
| ----: | ------------: | -------: | -------------: | ---------: | ---------: | -----------: |
|   320 |           147 |    **0** |              0 |          0 |          0 |            0 |
|   360 |           147 |    **0** |              0 |          0 |          0 |            0 |
|   375 |           147 |    **0** |              0 |          0 |          0 |            0 |
|   390 |           147 |    **0** |              0 |          0 |          0 |            0 |
|   414 |           147 |    **0** |              0 |          0 |          0 |            0 |
|   768 |           147 |    **0** |              0 |          0 |          0 |            0 |
|  1366 |           147 |    **0** |              0 |          0 |          0 |            0 |
|  1440 |           147 |    **0** |              0 |          0 |          0 |            0 |

\* The only console/request error observed is `ERR_TUNNEL_CONNECTION_FAILED` for
`fonts.googleapis.com`, an environment network limitation (Google Fonts host
blocked in the sandbox), not a site defect. Counts above exclude it.

Interaction (375px, Overview → All Ministries):

- Details **i** button opens the correct task panel (verified ref `MM-PS1`).
- **Escape** closes the panel and **restores focus** to the triggering i button.
- All five filters present: **All, Overdue, Due Soon, Complete, Not Yet Updated**.
- 0 page errors.

Long-content states exercised in the captured rows: long titles wrapping to 3–4
lines, long ministry labels, multi-word statuses, and the **39 DAYS OVERDUE**,
**NOT YET UPDATED**, **NOT STARTED** and cross-ministry **"9 outstanding"** group
row — all reflow cleanly with no overlap or clipping.

## 5. Before / after evidence

Task-stream element screenshots (device scale 2):

- `screenshots/pass-9.1c/before-320.png`, `after-320.png`
- `screenshots/pass-9.1c/before-375.png`, `after-375.png`
- `screenshots/pass-9.1c/before-390.png`, `after-390.png`
- Desktop unchanged: `before-desktop-1440.png`, `after-desktop-1440.png`

Before: ministry/title/status text overlaps within a clamped 42px row. After:
each layer on its own row, titles fully readable, i button on the right edge.

## 6. Scope confirmation — what did NOT change

Unchanged: favicon/404 assets, global nav, Workspace button, Creative Direction,
Theme Brief, Musical Identity, Setlist, Lyrics, exports, footer, routes, indexing,
task wording/data, statuses, ministry names, due dates, chronological order,
filters, search, task-detail controls, scroll behaviour, and every non-Overview
Playbook view. Desktop Overview is visually unchanged (all edits are inside the
existing `max-width:560px` / `max-width:760px` media queries). No other HTML page
was modified except its shared version string.

## 7. Five standard checks

See the delivery message / QA summary: `npm run audit`, `validate:html`,
`format:check`, `lint`, and the Playwright smoke suite were run against this copy.
