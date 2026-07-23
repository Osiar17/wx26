# WX 2026 — Pass 9.1I Report

**Pass:** 9.1I — Five Moods reader, detail linking & segment-landing repair **only**
**Page:** creative-direction.html **Display:** 2026.9.1I **Semver:** 2026.9.1-i
**Base:** completed Pass 9.1H source **Date:** 2026-07-22

## 1. Component inventory (A)

| #   | Component                               | Selectors                                            | Data / state                            | Mood keys                            | Notes                            |
| --- | --------------------------------------- | ---------------------------------------------------- | --------------------------------------- | ------------------------------------ | -------------------------------- |
| 1   | The Moods Within the Garden             | `.moods`, `.moods-btn`, `#moodsMaster`, `#moodsNote` | `M2`, `show(key)`, `.is-active`         | all,1–5                              | **Pass 9.1H** reader (untouched) |
| 2   | The Five Moods / Mood Board at a Glance | `.mgg`, `#mggRows .krow`, `#mggShared`, `.mgg-board` | `mn`/`SHORT`/`EXPL`, `apply(m)`, `.sel` | 1–5                                  | **this pass**                    |
| 3   | Segment routing                         | `activate()`, `applyHash()`, `#ws-content`           | hash routing                            | story/elements/mood/identity/musical | landing fix                      |

The two mood components do **not** share DOM or state; 9.1H modified #1, this pass modifies #2 and the routing.

## 2. Root causes (exact)

**Five Moods (B/C/D).** `#mggRows .krow` selection relied on `mouseenter`/`mouseleave`
plus a click that toggles a `sticky` mood; there were no Prev/Next, no position, and
a document-level handler `document.addEventListener('click',…{ if(sticky){sticky=null;apply(null);} })`
deselects the current mood on **any** bubbling click. So on touch a generic tap
(including a would-be "Explore") cleared the selection instead of leading to the
mood's detail — the first item included. (All five rows individually call `apply`;
the failure was the missing mobile controls + the bubbling deselect, not a per-item
handler gap.)

**Segment landing (E/F).** `activate(key)` reset only `content.scrollTop`
(`content = #ws-content`). On mobile `@media(max-width:1024px)` makes `#ws-content`
`overflow:visible` and the **body** the scroller (`html,body{height:100%};body{overflow:auto}`),
so the reset was a no-op; with `history.scrollRestoration:'auto'` the browser
re-applied the prior scroll. Result: `#identity`/`#musical` opened ~4000px down —
near the end (measured `winY:4000`, heading top `-3869`).

## 3. Five-mood target mapping (C)

| Summary mood (`data-mood`) | Target key | Detail heading (`#mshTitle`) | Verified result                       |
| -------------------------- | ---------- | ---------------------------- | ------------------------------------- |
| 01 Secluded & Intimate     | mood `1`   | Secluded & Intimate          | Explore → selects 1, detail + focus ✓ |
| 02 Assured                 | mood `2`   | Assured                      | ✓                                     |
| 03 Pressed                 | mood `3`   | Pressed                      | ✓                                     |
| 04 Dependent               | mood `4`   | Dependent                    | ✓                                     |
| 05 Surrendered             | mood `5`   | Surrendered                  | ✓                                     |

Detail = `#mggShared` (eyebrow `0N`, `#mshTitle` name, `#mshBody` = `EXPL[n]`), with
the mood's images highlighted as a cluster in `.mgg-board`.

## 4. Changes (creative-direction.html only)

**Routing script** — `activate(key,toTop)`; new `segTop()` resets `#ws-content`,
`document.body`, `document.documentElement`, and `window` (now + rAF);
`history.scrollRestoration='manual'`; `hashchange`/`popstate`/initial load all call
`applyHash(true)`. In-segment mood reveals scroll in-page (no new history entries).

**Five Moods CSS** (`.mgg-reader{display:none}` + `@media(max-width:760px)`):
control bar, `.mgg-reader__btn` (≥44×44, `[disabled]`, `:focus-visible`),
`.mgg-reader__pos`, `.msh-title:focus-visible` ring; reduced-motion disables
`.mgg-cell/.mgg-tag/.mgg-mood-cap` transitions.

**Five Moods markup** — after `.mgg-editorial`: a `role="group"` bar with
`#mggExplore` ("Explore this mood"), `#mggPrev`, `#mggPos`, `#mggNext`.

**Five Moods JS** — enhancer stepping moods 1–5: `select(n)` clicks the matching
row (reusing `apply`) with `stopPropagation` on the reader buttons so the document
deselect can't fire; `#mggExplore` selects the mood then scrolls `#mggShared` into
view (header-offset) and focuses `#mshTitle` (`tabindex=-1`, `preventScroll`),
using instant scroll under reduced-motion. Phones only; desktop bar is `display:none`.

## 5. Measurements

Segment landing (heading top after navigation; negative = below viewport/near end):

| Width |     Before Explore Visual | After Explore Visual | Direct #identity | Direct #musical |
| ----: | ------------------------: | -------------------: | ---------------: | --------------: |
|   375 | winY 4000, head **-3869** |         head **131** |         head 131 |        head 150 |
|   320 |    (same class of defect) |                    — |         head 137 |        head 137 |
|  1366 |      wsTop 0 (already ok) |             head 144 |              144 |             144 |

All eight widths after fix: `#identity` head 127–177, `#musical` head 137–177 (all
positive, at segment top), doc h-overflow 0, 0 JS errors, 0 failed local requests.

Five Moods reader (375/320): steps 1 of 5 (Secluded & Intimate, Prev disabled) →
… → 5 of 5 (Surrendered, Next disabled); exactly one active (n=1) at each step;
Explore button 175×44; Explore → focus on `#mshTitle`, `#mggShared` top ≈ 26–43px
(just below the sticky header).

## 6. Keyboard / focus / Back-Forward (H)

- Reader buttons are semantic `<button>`s with visible focus; Enter on Next steps
  the reader and keeps focus on the control. Explore moves focus to the detail
  heading; the heading gets `tabindex="-1"` only for programmatic focus.
- Back/Forward: `#identity`↔`#musical` restore the correct segment (each at top);
  no loops, no duplicate history from mood selection (in-page, no pushState).
- Direct `#identity` / `#musical` load at the correct top. The Explore Sections
  bottom sheet (9.1G) still opens/closes. Reduced-motion: transitions suppressed,
  Explore scroll is instant.

## 7. Desktop safeguard (I) & scope (J)

Desktop Five Moods editorial and the Moods-Within-the-Garden reader are unchanged
(the `.mgg-reader` bar is `display:none` ≥768px); the broken links and landing are
repaired on desktop too (desktop already scrolled `#ws-content`, now also covered).
Version-normalized diff: every other HTML page differs only in its version string;
creative-direction's functional diff is the routing scroll fix + the Five Moods
reader (CSS/markup/JS). Unchanged: footer (work **not** started — see 9.1J), the
9.1G Explore Sections sheet, global nav, Theme Brief panorama, Bible Study,
Playbook, Musical/Visual Identity content, favicon/404, Setlist, Lyrics, exports,
indexing, and all mood wording/imagery.

## 8. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint
**pass**; Playwright smoke **24/24 pass**.

## 9. Footer confirmation

The footer-consistency pass was **not** started; it remains postponed to Pass 9.1J.

## 10. Screenshots (`screenshots/pass-9.1i/`)

Five Moods before/after 320/375/390; first/middle/final mood; reader control bar;
Visual Identity landing before/after; Musical Identity landing before/after.
