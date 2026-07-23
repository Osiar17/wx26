# PASS 9.1J.4 — Visual Identity board & slide navigation

**Site:** Worship Experience 2026 (static HTML/CSS/vanilla JS, GitHub Pages subpath)
**Display version:** `2026.9.1J` (unchanged) · **Package semver:** `2026.9.1-j.4`
**Pass label:** Pass 9.1J.4 — Visual Identity board and slide navigation
**Working copy:** `wx2026-pass-9.1J-4` (duplicated from `wx2026-pass-9.1J-3`; the 9.1J.3 source was **not** modified)
**Date:** 2026-07-22

This pass adds _read-through-without-closing_ navigation to the five Visual
Identity families. It changed exactly one runtime file, `creative-direction.html`,
plus one dev-only Playwright smoke addition. The shared reader controller
`assets/js/wx-detail-reader.js` is **byte-identical** to 9.1J.3.

---

## A. Corrected reader/navigation-family inventory — 15 total

The earlier figure of **"12"** was wrong: it collapsed the four Visual Identity
subsections that sit under the Creative Direction "Visual Identity" heading
(Logo & Wordmarks; Typography & Typeface; the world-board media families; the
Colour Palette) into a single line. Counted correctly — one entry per family
that has (or needs) its own reader/navigation surface — the site has **15**.

| #   | Family                       | Surface                          | Status                                       |
| --- | ---------------------------- | -------------------------------- | -------------------------------------------- |
| 1   | Bible Study — Four Works     | inline reader                    | ✅ complete before this batch (9.1J)         |
| 2   | Bible Study — Five Sessions  | inline reader                    | ✅ complete before this batch (9.1J)         |
| 3   | Wade-In dimensions           | inline reader                    | ✅ complete before this batch (9.1J.2)       |
| 4   | Musical Identity — phases    | inline reader + graph            | ✅ complete before this batch (9.1J.2)       |
| 5   | Colour Palette               | `#viOverlay` modal reader        | ✅ complete before this batch (9.1J.3)       |
| 6   | **Logo & Wordmarks**         | `#zoneBoard` modal card reader   | ✅ **this batch**                            |
| 7   | **Typography & Typeface**    | `#zoneBoard` modal card reader   | ✅ **this batch**                            |
| 8   | **Imagery & Photography**    | `#worldBoard` slide+card         | ✅ **this batch** (normalised; nav retained) |
| 9   | **Textures & Surface Rules** | `#worldBoard` slide+card         | ✅ **this batch** (normalised; nav retained) |
| 10  | **Structure & Motion**       | `#worldBoard` slide+card + video | ✅ **this batch** (normalised; nav retained) |
| 11  | What Are You Making?         | —                                | ⏳ pending                                   |
| 12  | Elements & Symbols           | —                                | ⏳ pending                                   |
| 13  | Flow of Our Journey          | —                                | ⏳ pending                                   |
| 14  | Find Your Part               | —                                | ⏳ pending                                   |
| 15  | Musical Identity — Elements  | —                                | ⏳ pending                                   |

**Before this batch: 5 of 15 complete, 10 pending.**
**After this batch: 10 of 15 complete, 5 pending** (families 11–15).

This is _not_ "5 of 12."

---

## B. Five-family board / slide inventory (this batch)

**Logo & Wordmarks — `#zoneBoard`, 7 cards (`MARKS`):**
m1 Primary Campaign Mark · m2 Standalone YES Wordmark · m3 Light-Surface Lockup ·
m4 CCC Institution Mark · m5 Worship Experience Mark · m6 Co-branding Lockups ·
m7 Which Mark When. Renderer: `markBoard(m)`.

**Typography & Typeface — `#zoneBoard`, 5 cards (`FACES`):**
f1 YES Wordmark · f2 TFArrow · f3 Cinzel · f4 EB Garamond · f6 Emphasis & Utility
Rule. Renderer: `faceBoard(f)`.

**Imagery & Photography / Textures & Surface Rules / Structure & Motion —
`#worldBoard`:** slide-based media families driven by the existing `SLIDES`/`IMG`
data with a **unified slide+card** stepper (`stepFlow`, `renderDots`,
`renderStrip`, `crumb`). Structure & Motion additionally hosts `<video>` media.
These three already had complete navigation before this pass (delivered earlier);
this pass **retained that navigation as the source of truth** and normalised only
its modal/media/keyboard hygiene (§F/§H).

---

## C. Navigation hierarchy

Two distinct surfaces, each showing exactly **one** navigation bar — never two
competing bars:

- **`#zoneBoard` (Logo, Typography):** a single **card** level.
  Bar reads `‹ Prev` · `Card N of M` · `Next ›`. Buttons are labelled
  "Previous card" / "Next card" (`aria-label`), and the position element is
  `aria-live="polite"`. There is no slide level here, so no second bar is shown.

- **`#worldBoard` (Imagery, Textures, Structure & Motion):** the pre-existing
  **unified slide+card** `stepFlow` is retained. It already distinguishes slide
  boundaries from card boundaries within one stepper and one dot strip, so no
  second/duplicate bar was added. `isFirstOverall`/`isLastOverall` govern the
  outer boundaries; the crumb names the current slide/card.

Where the boards are single-level (zoneBoard) the labels say "card"; where the
world-board spans slides and their inner cards the existing crumb + dots carry
the two-level position. No board shows a "Card" bar and a "Slide" bar at once.

---

## D. Adapters, selectors and functions changed (`creative-direction.html`)

**New markup** — a reader bar inside `.vi-zpanel` (after `#zBody`):

```html
<div
  class="wx-reader-nav vi-reader-nav"
  id="zReaderNav"
  role="group"
  aria-label="Move between the cards in this board"
>
  <button class="wx-reader-nav__btn" id="zPrev" type="button" aria-label="Previous card">
    ‹<span>Prev</span>
  </button>
  <span class="wx-reader-nav__pos" id="zPos" aria-live="polite">Card 1 of 1</span>
  <button class="wx-reader-nav__btn" id="zNext" type="button" aria-label="Next card">
    <span>Next</span>›
  </button>
</div>
```

**New family adapter** — `zOpenFamily(fam, render, name, idx, trigger)` drives the
shared controller while keeping `markBoard()`/`faceBoard()` as the render source
of truth:

```js
var zReader =
  window.WXDetailReader && zPrevBtn
    ? WXDetailReader.attach({
        count: 1,
        modal: true,
        dialog: zb,
        prevBtn: zPrevBtn,
        nextBtn: zNextBtn,
        posEl: zPosEl,
        closeBtn: document.getElementById("zClose"),
        backdrop: document.getElementById("zBackdrop"),
        arrowKeys: true,
        arrowRoot: zb,
        resetScroll: zPanel,
        focusOnOpen: document.getElementById("zClose"),
        label: function (i) {
          return "Card " + (i + 1) + " of " + zFam.length;
        },
        select: function (i) {
          zBody.innerHTML = zRender(zFam[i]);
          if (zCrumbEl) zCrumbEl.textContent = zFamName + " — " + (zFam[i].name || "");
        },
      })
    : null;

function zOpenFamily(fam, render, name, idx, trigger) {
  zFam = fam;
  zRender = render;
  zFamName = name;
  if (zReader) {
    zReader.setCount(fam.length);
    if (trigger && trigger.focus) {
      try {
        trigger.focus();
      } catch (_) {}
    }
    zReader.open(idx);
  } else {
    zopen(render(fam[idx]));
  }
} // graceful fallback if controller absent
```

**Grid handlers** now open a family instead of a single card:

```js
// mark grid:   zopen(markBoard(m))  ->
b.addEventListener("click", function () {
  zOpenFamily(MARKS, markBoard, "Logo & Wordmarks", MARKS.indexOf(m), b);
});
// face grid:   zopen(faceBoard(f))  ->
b.addEventListener("click", function () {
  zOpenFamily(FACES, faceBoard, "Typography & Typeface", FACES.indexOf(f), b);
});
```

**Close wiring** delegated to the controller (its modal mode owns Escape, backdrop,
inert and focus restoration); the old page-level backdrop/close/Escape listeners
were removed to avoid double-handling:

```js
var zbk = document.getElementById("zBack");
if (zbk)
  zbk.addEventListener("click", function () {
    if (zReader) zReader.close();
    else zclose();
  });
```

**Fallback preserved:** if `WXDetailReader` is unavailable, `zOpenFamily` calls the
original `zopen(render(fam[idx]))` so a mark/face still opens.

---

## E. `#viOverlay` (Colour Palette) — unchanged, still working

No change to the Colour Palette reader (family 5, delivered in 9.1J.3). Regression
check confirms it still opens and steps: after this pass, opening the first swatch
reports `viPos = "1 of 7"` and Escape restores focus. Its smoke test (test 28)
passes.

---

## F. `#worldBoard` (Imagery / Textures / Structure & Motion) — normalised, not duplicated

Per the batch constraint, the world-board's existing unified `stepFlow` slide+card
navigation is **retained as the source of truth** — no second/competing bar was
added and Imagery's slide nav was **not** duplicated. Normalisation applied:

- **Scroll-lock + inert on open** — `openW` now calls `wLock()` before `paint()`;
  `wLock` sets `body.overflow='hidden'` and adds `inert` + `aria-hidden="true"` to
  every sibling of `#worldBoard` (excluding scripts). `wUnlock()` restores them.
- **Media paused on close** — `closeW` pauses every `<video>` inside the board
  before hiding it, then unlocks and restores focus, so no hidden video keeps
  playing.
- **Arrow-key guard** — a `wTyping(el)` predicate causes ArrowLeft/ArrowRight to be
  ignored when focus is on `input`/`textarea`/`select`/`video`/`audio`,
  `contenteditable`, or `role="tab"|"slider"`. Escape still closes.

---

## G. Controller reuse — `wx-detail-reader.js` unchanged

The shared controller is used **only** for common behaviour (index, Prev/Next,
non-circular boundary `disabled`+`aria-disabled`, position `label(i)`, guarded
arrow keys, scroll reset, and modal focus-trap/Escape/inert/focus-restore). No
page-specific data or selectors were added to it. Verification:

```
diff -q p91j3/assets/js/wx-detail-reader.js p91j4/assets/js/wx-detail-reader.js
=> (no output) — BYTE-IDENTICAL
```

The world-board keeps its own `stepFlow` adapter rather than attaching the
controller, precisely because attaching a second stepper would have created a
competing nav bar (constraint F/I).

---

## H. Media regression (Structure & Motion)

- Approved video content unchanged; no autoplay introduced.
- Reader arrows do not react to Left/Right while focus is on a `<video>` or slider
  (guarded by `wTyping`).
- On close, all board videos are paused; the board is then `hidden`, so no hidden
  video is left playing.
- Smoke test 31 opens the world-board (Imagery), asserts the background is locked
  (`body` overflow hidden + siblings `inert`), that dots/slide nav are present, and
  that after close no video reports `playing`.

---

## I. Accessibility evidence

- Boundary state uses the **native `disabled`** attribute (plus `aria-disabled`),
  not colour alone — at `Card 1` "Prev" is disabled; at `Card M` "Next" is disabled.
- Arrow keys are ignored on inputs, textareas, selects, `role=tab|slider`,
  video/audio and `contenteditable` (both the zoneBoard controller guard and the
  world-board `wTyping` guard).
- Modal mode: focus moves into the dialog on open (`focusOnOpen` = close button),
  background is `inert`+`aria-hidden` with body scroll locked, **Escape** closes,
  and focus returns to the triggering grid button on close.
- Position is announced via `aria-live="polite"` on `#zPos`.
- Reduced motion: no new animation was introduced on the zoneBoard reader; content
  swaps in place.

---

## J. Version normalisation

- **Display** version stays `2026.9.1J` across VERSION, README, CHANGELOG,
  `assets/js/site-config.js` (`WX.version="2026.9.1J"`) and the generator meta —
  17 files carry the display string, unchanged.
- **Package** semver bumped to `2026.9.1-j.4` in `package.json` and
  `package-lock.json` (both root and root-package entries).
- Fixed an accumulated stutter in the README version line ("See VERSION. See
  VERSION. …") and added the 9.1J.4 CHANGELOG entry (the 9.1J series had not been
  recorded there).

**Version-normalised diff vs 9.1J.3** (ignoring version strings): only
`creative-direction.html` (functional) and `tools/smoke.spec.mjs` (tests) differ;
the controller and every other runtime file are identical.

```
creative-direction.html : +36 / -8 lines (adapter + markup + world-board hygiene)
tools/smoke.spec.mjs     : +3 tests (logo, typography+cross-family, imagery board)
assets/js/wx-detail-reader.js : identical
```

---

## K. Checks (all green)

| Check                                           | Result                                                         |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `tools/audit.mjs`                               | **PASSED — 0 errors, 0 warnings** (11 HTML files, 307 scanned) |
| `html-validate creative-direction.html`         | **exit 0**                                                     |
| `prettier --check` (changed files)              | **All matched files use Prettier code style**                  |
| `eslint` (creative-direction.html + controller) | **0 errors** (1 pre-existing warning)                          |
| Playwright smoke                                | **31 passed** (incl. tests 29–31 added this pass)              |

New smoke tests:

- **29** logo marks — open, Next through cards, boundary, Escape restores focus.
- **30** typography cards **+ cross-family reset** (Logo 7 → Typography 5 via `setCount`).
- **31** imagery world-board opens with background lock and slide nav present.

---

## L. Screenshot evidence (`screenshots/pass-9.1j-4/`)

- `logo-first.png` — Logo card **1 of 7**, "Primary Campaign Mark", Prev disabled.
- `logo-mid.png` — Logo card **4 of 7**, "CCC Institution Mark".
- `logo-last.png` — Logo card **7 of 7**, "Which Mark When", Next disabled.
- `type-first.png` — Typography card **1 of 5**, "YES Wordmark" (cross-family reset
  from a 7-card board to a 5-card board).
- `logo-desktop.png` — Logo reader at 1366-wide desktop (structure preserved).

---

## M. Remaining status

**10 of 15 families complete. 5 pending:** What Are You Making?, Elements & Symbols,
Flow of Our Journey, Find Your Part, Musical Identity — Elements. These were
explicitly out of scope for this batch.

Pass 9.1J.5 / 9.1K were **not** started.

---

## N. Deliverables

- `PASS-9.1J-4-REPORT.md` (this file)
- Complete split working-copy package `wx2026-pass-9.1J-4.zip.part-*`
- `REASSEMBLE-9.1J-4.txt` (Windows `copy /b` reassembly)
- `SHA-256` checksum of the reassembled ZIP
