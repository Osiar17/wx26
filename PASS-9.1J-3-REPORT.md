# WX 2026 — Pass 9.1J.3 Report

**Pass:** 9.1J.3 — Detail-reader batch 3: Visual Identity overlay families
**Display:** 2026.9.1J (unchanged) **Package semver:** 2026.9.1-j.3 **Base:** 9.1J.2 **Date:** 2026-07-22

## 0. Scope outcome (read first)

The seven "Visual Identity overlay" families are **not** a uniform flat-item modal
group. Investigation of the source shows three different overlays and, for most
families, multi-level **board → slide** systems with interactive widgets (colour
sliders, video, journey-node explainers, comparison grids), not a simple list of
items to page through:

- `#viOverlay` (`.vi-panel`) — **Colour Palette only**: seven flat `.vi-detail[data-key]`
  articles shown one at a time by `show(k)`. **This is the one genuinely
  reader-shaped family.**
- `#zoneBoard` (`#zBody`, `zopen(html)`) — Logo & Wordmarks, Typography, Textures,
  Structure & Motion render **boards**; individual cards then open **multi-slide**
  content (the `SLIDES` data) with sliders/video/journey nodes.
- `#worldBoard` (`#wStage`, `#wPrev`/`#wNext`) — Imagery already has its **own slide
  Prev/Next** (`w-arrow` controls) and a board strip.
- "What Are You Making?" (`ASKS`) is a decision **list** whose items scroll to zones
  — it has no per-item modal detail to page.

Forcing one within-family Prev/Next reader onto the board/slide families would
misrepresent their structure and risk breaking the sliders/video/slide navigation
that already exist. So this batch **faithfully implements the Colour Palette family**
(fully, in the controller's modal mode) and **documents the other six with the exact
reason they need per-family design**, staged for follow-up. The shared controller was
**not modified** (byte-identical to 9.1J).

## 1. Confirmed seven-family inventory

| Family                | Section         | Trigger                                           | Overlay                | Data                        | Order                                                    |        Items | Open fn                   | Close                      | Type                            | Reader?         |
| --------------------- | --------------- | ------------------------------------------------- | ---------------------- | --------------------------- | -------------------------------------------------------- | -----------: | ------------------------- | -------------------------- | ------------------------------- | --------------- |
| Colour Palette        | Visual Identity | `.vi-cell/.vi-swatch/.vi-onimg[data-key]`         | `#viOverlay .vi-panel` | 7 `.vi-detail[data-key]`    | blueblack,midnight,charcoal,bone,gold,crimson,wildflower |            7 | `show(k)`                 | `close()` Esc+focus-return | **flat modal**                  | **IMPLEMENTED** |
| Logo & Wordmarks      | Visual Identity | `.vi-card[data-target=zoneSignature]` → grid card | `#zoneBoard #zBody`    | `markBoard()`/`faceBoard()` | board                                                    | board+slides | `zopen(html)`             | `zclose()`                 | board+slides                    | staged          |
| Typography & Typeface | Visual Identity | `zoneVoice` grid card                             | `#zoneBoard`           | zone `voice` cards          | board                                                    | board+slides | `zopen`                   | `zclose`                   | board+slides                    | staged          |
| Imagery & Photography | Visual Identity | `zoneWorld` grid card                             | `#worldBoard`          | `SLIDES` (w1–w3)            | slides                                                   |  multi-slide | `wopen`/`#wPrev`/`#wNext` | `wClose`                   | **already has slide prev/next** | staged          |
| Textures & Surface    | Visual Identity | `zoneSurface` grid card                           | `#zoneBoard`           | `SLIDES` (su1,su2)          | board+slides                                             |  multi-slide | `zopen`                   | `zclose`                   | board+slides+sliders            | staged          |
| Structure & Motion    | Visual Identity | `zoneRhythm` grid card                            | `#zoneBoard`           | `SLIDES` (ry1,ry2)          | board+slides                                             |  multi-slide | `zopen`                   | `zclose`                   | board+slides+**video**          | staged          |
| What Are You Making?  | Visual Identity | `ASKS` list buttons                               | (scrolls to zones)     | `ASKS[7]`                   | list                                                     |            7 | scroll                    | n/a                        | **list, no per-item modal**     | staged          |

Reconciliation vs 9.1J inventory: confirmed. The prior inventory listed these as
`#viOverlay`; in fact only Colour Palette uses `#viOverlay` — the rest use
`#zoneBoard`/`#worldBoard` board systems (documented above).

## 2. Implemented family — Colour Palette

**Registration** (creative-direction.html, colour-overlay IIFE):

```
WXDetailReader.attach({ count:7, modal:true, dialog:#viOverlay,
  prevBtn:#viPrev, nextBtn:#viNext, posEl:#viPos, closeBtn:#viClose, backdrop:#viBackdrop,
  arrowKeys:true, arrowRoot:#viOverlay, resetScroll:.vi-panel, focusOnOpen:#viClose,
  label:i=>(i+1)+' of 7',
  select:i=>{ show det[i]; sel(KEYS[i]); },   // reuses the 7 ordered .vi-detail
  onClose:()=> sel(null) });
// openers (.vi-cell/.vi-swatch/.vi-onimg[data-key]) focus themselves then reader.open(index)
```

The old bespoke `show/close/Escape/openers` were replaced by controller-driven
`open(index)`/`close()` so the overlay now has a real **focus trap, background inert,
body scroll-lock and focus restoration** in addition to Prev/Next/position — the
controller owns all of that; the family keeps only its `show()`/`sel()` render.

**Markup:** one sticky bottom action bar `#viReaderNav` (`#viPrev`/`#viPos`/`#viNext`)
inside `.vi-panel`; `.vi-reader-nav` CSS pins it to the overlay bottom with safe-area
padding. No colour value, name, hex, swatch, image or wording was changed.

## 3. Shared-controller changes

**None** — `assets/js/wx-detail-reader.js` is byte-identical to 9.1J/9.1J.2. The
colour family uses its existing `modal:true` mode. No page-specific selectors or
per-family data entered the controller.

## 4. Implementation matrix (this batch)

| Family         | Items | Trigger           | Reader state                     | Boundary                 | Focus                   | Scroll                            |
| -------------- | ----: | ----------------- | -------------------------------- | ------------------------ | ----------------------- | --------------------------------- |
| Colour Palette |     7 | swatch/cell click | modal, Prev/Next/pos, arrow keys | Prev off @1, Next off @7 | trap + return to opener | `.vi-panel` reset to top per item |
| (other 6)      |     — | —                 | —                                | —                        | —                       | staged (see §1)                   |

## 5. Verification (Chromium/Playwright)

Colour Palette (375 & 1366): opens "1 of 7" Blue-Black `#0A0E1A` (Prev disabled,
body `overflow:hidden`, `#ws-content` inert, focus inside overlay) → Midnight Blue
`#16203D` → Charcoal `#262B3A` → Bone `#ECE3D0` → Presence Gold `#C6A24C` → Deep
Crimson `#8A171B` → Wildflower Purple `#7A4CB8` (Next disabled). **Name, hex and
swatch update together** each step; `.vi-panel` scroll resets to top; Escape closes,
restores body scroll + removes inert, and **returns focus to the opener** (a
`[data-key]` element). Doc h-overflow 0; **0 JS errors**; no failed local requests.

Regression: `#identity` still lands at its top (heading 131); Explore Sections sheet
opens; Back/Forward intact; the 9.1J/9.1J.2 readers unchanged (`mijPos` = "1 of 4").

Smoke suite: **28/28** (added the Colour Palette open→Next→boundary→Escape→focus
journey, asserting content/hex and modal lock).

## 6. Overlay reuse/reset & accessibility

Only Colour Palette uses the controller here, so there is no cross-VI-family index
bleed to reset yet; each open re-enters at the clicked colour's index and the reader
count is fixed at 7. Accessibility: modal focus trap (controller), Escape + visible
Close, background inert + scroll lock + restore, focus return to the exact opener,
`disabled`+`aria-disabled` boundary (not colour alone), ≥44px controls, visible
focus, arrow keys guarded (ignored on inputs/tabs). Reduced-motion: state changes are
immediate.

## 7. Scope confirmation

Version-normalized diff: only creative-direction.html changed functionally (Colour
Palette reader markup/CSS/wiring); all other pages differ only in version strings;
the shared controller and every other family are untouched. Footer/global-nav **not
started**. No wording, colour value, font, mark or image changed.

## 8. Status — families

Implemented: **5 of 12** — Four Works, Five Sessions, Wade-In, Musical Identity
phases, **Colour Palette**. **Seven remain pending**, including the six VI
board/slide families (Logo, Typography, Imagery, Textures, Structure & Motion, What
Are You Making?) which need per-family design against `#zoneBoard`/`#worldBoard`, plus
Elements & Symbols, Flow of Our Journey, Find Your Part, Musical Identity Elements.

## 9. Screenshots (`screenshots/pass-9.1j-3/`)

Colour Palette overlay reader — mid item and final (7 of 7, Next disabled).
