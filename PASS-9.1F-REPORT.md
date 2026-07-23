# WX 2026 — Pass 9.1F Report

**Pass:** 9.1F — Theme Brief Journey panorama mobile horizontal-swipe **only**
**Display version:** 2026.9.1F **Package semver:** 2026.9.1-f
**Base:** completed Pass 9.1E source **Date:** 2026-07-22

## 1. Investigation / rendering source

The Journey panorama ("The Path Through the Garden") is static HTML in
`theme-brief.html`:
`.gm-stage#gmstage > .gm-sticky > .gm-track#gmtrack`, where `.gm-track` (flex,
`width:400vw`) holds `.gm-pano` (the panorama `<img>`, `position:absolute; width:400vw`)
plus four `.station` overlays (`flex:0 0 100vw`). Motion was driven by a
`window` scroll listener + `requestAnimationFrame` applying a `translate3d` to
`.gm-track` based on `window.scrollY` progress through the stage. No
IntersectionObserver is involved in the pan.

## 2. Root cause (mobile), measured before editing (375×667)

- `.gm-stage{height:320vh}` → stage height **2134 px**.
- `.gm-sticky{position:sticky; overflow:hidden}` → the pane is **not**
  user-scrollable horizontally; overflow is clipped.
- JS pans `.gm-track` via `translate3d(-progress·maxX,0,0)` from vertical scroll.

So the 400vw track (`.gm-sticky.scrollWidth` 1500 px vs `clientWidth` 375 px) was
reachable only by scrolling through 320vh of page; a horizontal swipe did nothing,
and the tall pinned region dominated the phone. `touch-action` was unset (`auto`).

## 3. Exact changes (theme-brief.html only)

**CSS** — new `@media(max-width:760px)` block:

```
.gm-stage{height:auto}
.gm-sticky{position:static;height:72svh;min-height:320px;overflow-x:auto;overflow-y:hidden;
  -webkit-overflow-scrolling:touch;overscroll-behavior-inline:contain;
  touch-action:pan-x pan-y;scroll-snap-type:x proximity}
.gm-sticky:focus-visible{outline:2px solid var(--gold);outline-offset:-3px}
.gm-track{transform:none !important;width:400vw;height:100%}
.station{scroll-snap-align:start}
.gm-controls{position:absolute}            /* now anchored to .gm-stage, stays fixed over the viewport */
.gm-stage::after{...right-edge fade...}    /* cue */
.gm-cue{...“Swipe to explore →” chip...}   /* cue, aria-hidden */
.gm-stage.gm-explored .gm-cue,.gm-stage.gm-explored::after{opacity:0}
```

Plus a hidden-by-default `.gm-cue{display:none}` (shown only in the mobile block).

**Markup** — one decorative cue node added inside `.gm-stage`:
`<div class="gm-cue" aria-hidden="true"><span>Swipe to explore</span><span aria-hidden="true">→</span></div>`.

**JS** — the garden-map block now branches on `window.matchMedia('(max-width:760px)')`:

- `render()` returns early on mobile (no scroll-linked transform); desktop path unchanged.
- `syncMode()` on mobile sets `.gm-sticky` `tabindex=0`, `role=region`, an
  aria-label, and clears the transform; on desktop it removes those attributes.
- `goTo(i)` scrolls the pane horizontally to `stations[i].offsetLeft` on mobile
  (vertical `scrollTo` on desktop). Dots/prev/next reuse it; `curIndex()` reads
  `scrollLeft` on mobile.
- A `scroll` listener updates the active dot and adds `.gm-explored` (retires the
  cue) once `scrollLeft>8`. `keydown` handles ArrowLeft/ArrowRight on mobile.

No other selector, page, or the panorama artwork changed.

## 4. Before / after measurements (mobile)

| Metric (375px)               | Before                  | After        |
| ---------------------------- | ----------------------- | ------------ |
| `.gm-stage` height           | 2134 px (320vh)         | ~480 px      |
| `.gm-sticky` position        | sticky                  | static       |
| `.gm-sticky` overflow-x      | hidden                  | auto         |
| `touch-action`               | auto                    | pan-x pan-y  |
| viewport width               | 375                     | 375          |
| panorama content width       | 1500 (400vw)            | 1500 (400vw) |
| max horizontal scroll        | 0 (not user-scrollable) | **1125 px**  |
| document horizontal overflow | 0                       | 0            |

Per width — viewport / content / max-swipe (all doc-overflow 0):
320 → 320 / 1280 / **960**; 360 → 360 / 1440 / **1080**; 375 → 375 / 1500 / **1125**;
390 → 390 / 1560 / **1170**; 414 → 414 / 1656 / **1242**.

## 5. Verification (Chromium/Playwright, repo-subpath server)

|    Width |  Mode   |            Max h-scroll | tabindex/role/label | Arrow-key moves | Doc h-overflow | JS err | Failed local req |
| -------: | :-----: | ----------------------: | :-----------------: | :-------------: | :------------: | :----: | :--------------: |
|  320×568 | mobile  |                     960 |  0 / region / yes   |       yes       |       0        |   0    |        0         |
|  360×640 | mobile  |                    1080 |  0 / region / yes   |       yes       |       0        |   0    |        0         |
|  375×667 | mobile  |                    1125 |  0 / region / yes   |       yes       |       0        |   0    |        0         |
|  390×844 | mobile  |                    1170 |  0 / region / yes   |       yes       |       0        |   0    |        0         |
|  414×896 | mobile  |                    1242 |  0 / region / yes   |       yes       |       0        |   0    |        0         |
| 768×1024 | desktop | (pinned pan, unchanged) |        none         |        —        |       0        |   0    |        0         |
| 1366×768 | desktop | (pinned pan, unchanged) |        none         |        —        |       0        |   0    |        0         |
| 1440×900 | desktop | (pinned pan, unchanged) |        none         |        —        |       0        |   0    |        0         |

- Full panorama reachable by horizontal swipe (max-scroll > 0 everywhere on mobile);
  not compressed into the viewport; page gains no horizontal overflow.
- Keyboard: pane is focusable with a visible gold focus ring; ArrowRight/ArrowLeft
  step between phases; dots and prev/next scroll horizontally. No hidden focusable
  elements; focus is not trapped.
- Cue is visible initially and restrained; it retires after the first horizontal
  scroll; it is static (no animation), so reduced-motion users get the same
  information (label + right-edge fade).
- `touch-action:pan-x pan-y` with `overflow-y:hidden` leaves vertical page scroll
  free when a gesture begins over the panorama.
- Desktop/tablet: `position:sticky`, `overflow:hidden`, 320vh pinned pan retained;
  no tabindex/role added. Desktop 1366 before/after screenshots are **byte-identical**.
- 0 JS errors; no failed local requests (only the sandbox-blocked Google Fonts
  host — environment limitation).

## 6. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint
**pass**; Playwright smoke **24/24 pass**.

## 7. Scope confirmation

Version-normalized diff: every other HTML page differs only in its version string;
`theme-brief.html`'s functional diff is the mobile panorama CSS block, the one cue
node, and the garden-map JS branch. Unchanged: the four works of Scripture
(bible-study.html), footer logos, global navigation, page directory,
Previous/Next navigation, Creative Direction, Mood Board, Musical Identity,
Playbook, favicon/404, Setlist, Lyrics, exports, routes, indexing policy, wording,
and the panorama artwork/image content.

## 8. Screenshots

`screenshots/pass-9.1f/`: before/after at 320, 375, 390 (Journey stage) and
desktop 1366 before/after (byte-identical).
