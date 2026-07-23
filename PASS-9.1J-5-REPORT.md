# PASS 9.1J.5 — Final detail-reader families

**Site:** Worship Experience 2026 (static HTML/CSS/vanilla JS, GitHub Pages subpath)
**Display version:** `2026.9.1J` (unchanged) · **Package semver:** `2026.9.1-j.5`
**Pass label:** Pass 9.1J.5 — Final detail-reader families
**Working copy:** `wx2026-pass-9.1J-5` (duplicated from `wx2026-pass-9.1J-4`; the 9.1J.4 source was **not** modified)
**Date:** 2026-07-22

This pass completes the unified detail-reader requirement by adding read-through
navigation to the final five families. It changed exactly one runtime file,
`creative-direction.html` (+129 / −1 lines), plus dev-only Playwright smoke
additions. The shared controller `assets/js/wx-detail-reader.js` is
**byte-identical** to 9.1J.4.

**All 15 reader families are complete.**

---

## 1. Final 15-family inventory

| #   | Family                        | Surface                              | Status                         |
| --- | ----------------------------- | ------------------------------------ | ------------------------------ |
| 1   | Bible Study — Four Works      | inline reader                        | ✅ (9.1J)                      |
| 2   | Bible Study — Five Sessions   | inline reader                        | ✅ (9.1J)                      |
| 3   | Wade-In dimensions            | inline reader                        | ✅ (9.1J.2)                    |
| 4   | Musical Identity — phases     | inline reader + graph                | ✅ (9.1J.2)                    |
| 5   | Colour Palette                | `#viOverlay` modal reader            | ✅ (9.1J.3)                    |
| 6   | Logo & Wordmarks              | `#zoneBoard` modal card reader       | ✅ (9.1J.4)                    |
| 7   | Typography & Typeface         | `#zoneBoard` modal card reader       | ✅ (9.1J.4)                    |
| 8   | Imagery & Photography         | `#worldBoard` slide+card             | ✅ (9.1J.4)                    |
| 9   | Textures & Surface Rules      | `#worldBoard` slide+card             | ✅ (9.1J.4)                    |
| 10  | Structure & Motion            | `#worldBoard` slide+card + video     | ✅ (9.1J.4)                    |
| 11  | **What Are You Making?**      | `#sysQs` inline decision-card reader | ✅ **this batch**              |
| 12  | **Elements & Symbols**        | `#esModal` carousel modal            | ✅ **this batch** (normalised) |
| 13  | **Flow of Our Journey**       | `#fjiStage` inline phase reader      | ✅ **this batch**              |
| 14  | **Find Your Part**            | `#miFYP` inline hierarchical reader  | ✅ **this batch**              |
| 15  | **Musical Identity Elements** | `#miEle` inline element reader       | ✅ **this batch**              |

**Before this batch: 10 of 15 complete, 5 pending. After this batch: 15 of 15 complete, 0 pending.**

---

## 2. Five-family implementation matrix

| Family                    | Character            | Data (order · count)                                                                           | Reader controls                        | Reuse point                                        | Boundaries                      |
| ------------------------- | -------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------- | ------------------------------- |
| What Are You Making?      | inline               | `ASKS` (Every zone → 01 Colour → 02 Marks → 03 Type → 04 Imagery → 05 Surface → 06 Rhythm · 7) | `#sysPrev/#sysPos/#sysNext`            | clicks the question's own `<button>`               | non-circular                    |
| Elements & Symbols        | modal (carousel)     | 9 `.es-detail` articles, `data-i` 0–8                                                          | pre-existing `#esPrev/#esLive/#esNext` | its own `rotate()`/`showDetail()` (not duplicated) | circular carousel (established) |
| Flow of Our Journey       | inline               | `STOPS` (Threshold → Help in Dark → Will Laid Down → Gateway to Glory · 4)                     | `#fjiPrev/#fjiPos/#fjiNext`            | `open(k)`                                          | non-circular                    |
| Find Your Part            | inline, hierarchical | 12 leaves across Guitars/Keys/Rhythm/Brass/Voices                                              | `#fypPrev/#fypPos/#fypNext`            | `renderDetail()` + `renderMap()`                   | non-circular                    |
| Musical Identity Elements | inline               | `ELEMENTS` (Tempo & Pulse first · 7)                                                           | `#elePrev/#elePos/#eleNext`            | `apply()`                                          | non-circular                    |

---

## 3. Adapters, selectors and callbacks changed (`creative-direction.html`)

Every new reader follows the same shape established in 9.1J.2 (musical phases): a
small family-specific IIFE, guarded by `if(!window.WXDetailReader) return;`, that
attaches the shared controller and passes a `select(i)` callback which drives the
family's existing render. Arrow keys are scoped per-component with
`arrowRoot:<componentRoot>` so the four inline readers on the page never step one
another. New markup in each case is one `.wx-reader-nav` bar (reusing the existing
9.1J.2 CSS — no new styles).

**A · What Are You Making? (`#sysQs`)**

```js
select:function(n){ var b=qBtn(n); if(b) b.click(); }   // reuse the question's own click
```

The adapter reuses each generated question button, so the selection highlight, the
`#sysChildZone`/`#sysChildText` child card and the "Go to <zone>" refer button
(and its `scrollIntoView` — the underlying zone-scroll) stay wired from one source.
"Every zone" is `ASKS[0]` — first and included. The first card is opened on init so
the position (`1 of 7`) is accurate and none is skipped. A delegated `#sysQs` click
listener keeps the reader index in step with direct taps.

**B · Elements & Symbols (`#esModal`)** — normalised, not duplicated.
The carousel already owns Prev/Next (`#esPrev`/`#esNext`), an accurate live position
(`#esLive`, e.g. "2 / 9 · Night") and browse-while-open (`rotate()` syncs the open
detail). Per the no-duplicate-controls rule the controller was **not** attached to it.
The one gap — internal scroll — was fixed inside `showDetail(i)`:

```js
var mc = modal.querySelector(".es-modal-card");
if (mc) {
  mc.scrollTop = 0;
} // reset on every switch
```

The modal is intentionally `aria-modal="false"` so the carousel stays interactive
while a detail is open; background-inert is therefore deliberately **not** applied
(it would disable the very carousel used to browse). Focus save/restore, Escape and
the `es-locked` body scroll-lock are retained.

**C · Flow of Our Journey (`#fjiStage`)**

```js
select:function(n){ open(String(n+1)); }   // STOPS keyed "1".."4"
```

Reuses `open()` so the active node, the lit figure (`stage.locked`) and the
eyebrow/title/moods/note all stay synchronised. Position reads `1 of 4` → `4 of 4`
in canonical order. A section click listener syncs the index when a marker is tapped.
The first phase is opened by default so the position is accurate.

**D · Find Your Part (`#miFYP`)** — hierarchical.
A `SEQ` of 12 leaves defines the read-through order; the adapter sets the path +
selection and reuses `renderDetail()` and `renderMap()` so name, role, instructions
and the `data-selected` map highlight update together:

```js
select:function(n){ var s=SEQ[n]; fyp.path=s.path.slice(); fyp.sel=s.k; renderDetail(); renderMap(); }
```

**Exact sequence (12):** _Guitars_ Acoustic → Electric → Bass · _Keys_ Piano/Keys →
Pads → Strings → Organ · _Rhythm_ Drums → Aux Perc. · _Brass_ (standalone) · _Voices_
Lead → Backing. This is depth-first by the displayed grid order — every item in a
subgroup before advancing to the first item of the next, never jumping across
unrelated families. A `#fypMap` click listener keeps the index in step with direct
hex selection.

**E · Musical Identity Elements (`#miEle`)**

```js
select:function(n){ sel=ELEMENTS[n].k; apply(false); }
```

Reuses `apply()` so the detail title/content and the `data-on` active state on both
the board cards and the nav pills update together. **Tempo & Pulse is `ELEMENTS[0]`**
— shown first, reachable like any other element, never isolated. Board/nav clicks
sync the index. The phases graph (`mij*`) is untouched.

---

## 4. Shared-controller diff

**None.** `assets/js/wx-detail-reader.js` is byte-identical to 9.1J.4:

```
diff -q p91j4/assets/js/wx-detail-reader.js p91j5/assets/js/wx-detail-reader.js
=> (no output) — BYTE-IDENTICAL
```

No family data or page-specific selectors were added to it; it is used only for the
common behaviour (index, Prev/Next, non-circular boundary `disabled`+`aria-disabled`,
position `label(i)`, guarded arrow keys, scroll reset).

---

## 5. Automated tests

Six tests added to `tools/smoke.spec.mjs` (one journey per family + a 15-family
sweep). Each journey opens the family, asserts real content changes on step
(actual titles/zones), and verifies boundary state:

- **32** what-are-you-making — "Every zone" first, 1 of 7 → 7 of 7, boundaries.
- **33** elements & symbols — modal steps 1/9 → 2/9 **and internal scroll resets to 0**, Escape closes.
- **34** flow of our journey — 1 of 4 → 4 of 4 asserting the exact phase title sequence.
- **35** find your part — 1 of 12 "Acoustic Guitar" → 12 of 12 "Backing Vocals".
- **36** musical identity elements — 1 of 7 "Tempo & Pulse" first (not skipped) → 7 of 7.
- **37** all 15 families present/initialised + regression (colour palette + logo board still step).

**Full smoke suite: 37 passed** (was 31 at 9.1J.4). Journeys were also verified live
across the 8 required viewports (320×568 … 1440×900): first/middle/final item,
Prev/Next, boundary disabled state, position indicator, internal scroll reset, no
duplicate controls, no stale content, no horizontal overflow, **0 page errors**.

---

## 6. Accessibility evidence

- **Native disabled** boundaries (plus `aria-disabled`), not colour alone — Prev
  disabled at item 1, Next disabled at the final item, on all five readers.
- **Arrow keys scoped per component** via `arrowRoot` — verified: ArrowRight inside
  the Elements reader advances only it; inside Flow advances only it; an arrow on
  `document.body` advances nothing. Arrows are also ignored on inputs, `role=tab`,
  `role=slider`, video/audio and contenteditable (controller `isTypingTarget`).
- **Position** announced via `aria-live="polite"` on each `…Pos` element.
- **Elements & Symbols (modal):** visible `.es-close`, Escape closes, focus saved on
  open and restored on close, body scroll-locked (`es-locked`); carousel intentionally
  interactive while open (`aria-modal="false"`).
- **Reduced motion:** no new animation introduced; content swaps in place on step.

---

## 7. Mobile & desktop

- **Mobile (≤760px):** all four inline reader bars fit within the viewport with no
  horizontal overflow and no document overflow at 320 / 360 / 768 (measured). The
  `.wx-reader-nav` buttons keep 44×44px minimum targets. The Elements & Symbols
  modal remains full-screen with the modal card scrolling internally.
- **Desktop (1366 / 1440):** each component keeps its established visual character —
  the inline decision list, the journey path, the hex map and the element board are
  unchanged; the reader bar is an additive strip beneath each.

---

## 8. Version normalisation

- **Display** version stays `2026.9.1J` (VERSION, README, CHANGELOG, `site-config.js`,
  generator meta).
- **Package** semver bumped to `2026.9.1-j.5` (`package.json`, `package-lock.json`).
- **Version-normalised diff vs 9.1J.4** (ignoring version strings): only
  `creative-direction.html` (+129 / −1, functional) and `tools/smoke.spec.mjs` (+6
  tests) differ; the controller and every other runtime file are identical.

---

## 9. Checks (all green)

| Check                                   | Result                                                         |
| --------------------------------------- | -------------------------------------------------------------- |
| `tools/audit.mjs`                       | **PASSED — 0 errors, 0 warnings** (11 HTML files, 308 scanned) |
| `html-validate creative-direction.html` | **exit 0**                                                     |
| `prettier --check` (tools)              | **All matched files use Prettier code style**                  |
| `eslint`                                | **0 errors**                                                   |
| Playwright smoke                        | **37 passed**                                                  |

---

## 10. Screenshot evidence (`screenshots/pass-9.1j-5/`)

`sys-first.png` (Every zone, 1 of 7) · `sys-mid.png` (04 · Imagery, 4 of 7) ·
`ele-tempo.png` (Tempo & Pulse, 1 of 7) · `ele-last.png` (Guardrails, 7 of 7) ·
`fji-first.png` (God Is Good, 1 of 4) · `fji-last.png` (God Is Glorified, 4 of 4) ·
`fyp-first.png` (Acoustic Guitar, 1 of 12) · `fyp-last.png` (Backing Vocals, 12 of 12) ·
`es-modal.png` (Elements & Symbols modal open, 1 / 9).

---

## 11. Completion

**All 15 reader families are complete.** The unified detail-reader system is fully
satisfied: every family lets the viewer read through its items without closing, with
an accurate position indicator, correct boundaries, internal scroll reset and — where
modal — focus trap/Escape/restore. Pass 9.1J.5 / 9.1K were **not** begun beyond this
batch's scope.

## 12. Deliverables

- `PASS-9.1J-5-REPORT.md` (this file)
- Complete split working-copy package `wx2026-pass-9.1J-5.zip.part-*`
- `REASSEMBLE-9.1J-5.txt` (Windows `copy /b` reassembly)
- `SHA-256` checksum of the reassembled ZIP
