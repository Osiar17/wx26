# WX 2026 — Pass 9.1G Report

**Pass:** 9.1G — Creative Direction mobile section-navigation **only**
**Page:** creative-direction.html **Display version:** 2026.9.1G **Semver:** 2026.9.1-g
**Base:** completed Pass 9.1F source **Date:** 2026-07-22

## 1. Root cause

The section navigation is a fixed SVG half-wheel: `<aside class="hw">` →
`position:fixed`; at `@media(max-width:1024px)` it renders `right:0; bottom:-40px;
width/height:320px`. On a phone this 320×320 fixed element sits over the reading
column — measured **~21.5%** of a 375×667 viewport, covering headings/Scripture —
and it is permanently visible with five `tabindex=0` `.seg` buttons. Routing is
hash-based: `activate()`/`applyHash()`/`navTo()` with `hashchange`/`popstate`
listeners and a `SEGN` name map. Nothing but the wheel provided section navigation
on mobile.

## 2. Exact changes (creative-direction.html only)

**CSS** (new base rules + `@media(max-width:760px)`):

- `.hw{display:none !important}` on phones.
- `.cd-navtrigger` — fixed compact pill, `min-height/min-width:44px`, safe-area
  insets, `:focus-visible` ring.
- `.cd-navsheet` bottom-sheet: backdrop + `role=dialog` panel, slide-up transform
  (disabled under `prefers-reduced-motion`), `.cd-navlink` rows, and a current
  marker shown three non-colour ways (`✓ Current` badge, bold white title, accent
  numeral).
- `body.cd-sheet-open{overflow:hidden}` background scroll-lock.
- `.ws-content,.workspace{padding-bottom:calc(84px + env(safe-area-inset-bottom))}`
  so final content scrolls clear of the trigger.

**Markup** — after the `.hw` aside: a `<button class="cd-navtrigger" …
aria-haspopup="dialog" aria-expanded="false" aria-controls="cdNavSheet">` and a
`<div class="cd-navsheet" role="dialog" aria-modal="true"
aria-labelledby="cdNavSheetTitle" hidden>` containing a heading, a Close button,
and a `<nav>` list of the five sections (each `.cd-navlink[data-target]`).

**JS** — one self-contained IIFE: open/close, focus-enter, focus-trap (Tab cycle),
Escape/backdrop/selection close, focus-return to trigger, `inert`+`aria-hidden`
on all other body children while open, scroll lock, and `markCurrent()` from
`location.hash` on open and on `hashchange`/`popstate`. Selection does
`location.hash = key`, reusing the page's existing routing — **no separate state
system, no change to `activate()`/routing**.

## 3. Verification (Chromium/Playwright, repo-subpath server)

|    Width |  Mode   |       Wheel        | Trigger (w×h) | Doc h-overflow | JS err | Failed req |
| -------: | :-----: | :----------------: | :-----------: | :------------: | :----: | :--------: |
|  320×568 | mobile  |        none        |    203×44     |       0        |   0    |     0      |
|  360×640 | mobile  |        none        |    203×44     |       0        |   0    |     0      |
|  375×667 | mobile  |        none        |    203×44     |       0        |   0    |     0      |
|  390×844 | mobile  |        none        |    203×44     |       0        |   0    |     0      |
|  414×896 | mobile  |        none        |    203×44     |       0        |   0    |     0      |
| 768×1024 | desktop | block (wheel kept) |    hidden     |       0        |   0    |     0      |
| 1366×768 | desktop | block (wheel kept) |    hidden     |       0        |   0    |     0      |
| 1440×900 | desktop | block (wheel kept) |    hidden     |       0        |   0    |     0      |

Mobile behaviour (all of 320–414):

- Full wheel not visible; compact "Explore sections" trigger visible; no content obscured.
- **Open**: `role=dialog`, `aria-modal=true`, trigger `aria-expanded=true`, focus
  moves into the sheet (onto the current item), `body` overflow `hidden`
  (scroll-lock), `#ws-content` gains `inert` (background inert), current section
  marked (`aria-current="true"` = story on `#story`).
- **Focus trap**: 6 focusables; Tab from the last cycles to the first.
- **Select "Mood Board"**: `location.hash → #mood`, sheet hidden, focus returned
  to trigger, `inert` removed, `body` overflow restored, `.panel[data-panel=mood]`
  active.
- **Escape**: closes + focus returns. **Backdrop tap**: closes.
- **Back/Forward**: after selecting Mood, `history.back()` → `#story`; marker
  follows. **Direct hash** entry (`#story`) loads and marks correctly.
- 0 horizontal overflow, 0 JS errors, 0 failed local requests (only the
  sandbox-blocked Google Fonts host — environment limitation).

Desktop/tablet: `.hw` wheel `display:block` retained; trigger hidden; no
`inert`/scroll changes. **Desktop 1366 before/after screenshots are byte-identical.**

## 4. Screenshots (`screenshots/pass-9.1g/`)

before-320, before-375 (wheel over content); after-320-closed, after-320-open,
after-375-closed, after-375-open, after-390-scripture; desktop-1366 before/after
(byte-identical).

## 5. Scope confirmation

Version-normalized diff: every other HTML page differs only in its version string;
creative-direction's functional diff is the mobile-nav CSS block, the trigger +
sheet markup, and the one menu script. Unchanged: Mood Board layout, detail panels,
Theme Brief panorama, footer logos, global navigation, Workspace control, Playbook,
Musical Identity content, favicon/404, Setlist, Lyrics, exports, routes, indexing
policy, wording, and segment content. The desktop wheel, its interaction, and the
segment-rendering/routing logic are untouched.

## 6. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint
**pass**; Playwright smoke **24/24 pass**.
