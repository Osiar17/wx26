# PASS 9.1J.6 — Elements & Symbols in-panel reader

**Site:** Worship Experience 2026 (static HTML/CSS/vanilla JS, GitHub Pages subpath)
**Display version:** `2026.9.1J` (unchanged) · **Package semver:** `2026.9.1-j.6`
**Pass label:** Pass 9.1J.6 — Elements & Symbols in-panel reader
**Working copy:** `wx2026-pass-9.1J-6` (duplicated from `wx2026-pass-9.1J-5`; the 9.1J.5 source was **not** modified)
**Date:** 2026-07-23

Adds a **Prev/Next reader on the open Elements & Symbols detail panel itself**, in
addition to the existing carousel arrows, so a viewer can move element-to-element
without going back to the carousel. Exactly one runtime file changed,
`creative-direction.html` (+20 lines), plus one Playwright smoke test. The shared
controller `assets/js/wx-detail-reader.js` is **byte-identical** to 9.1J.5. No other
family changed; all 15 reader families remain complete.

---

## 1. What was added

When an element or symbol is clicked and the detail modal opens, a reader bar now
sits at the top of the modal card:

```
‹ Prev        2 of 9        Next ›
```

- **Markup** — `.es-modal-nav` (`#esmReaderNav`) with `#esmPrev`, `#esmPos`
  (`aria-live="polite"`) and `#esmNext`, reusing the site's existing
  `.wx-reader-nav` button/position styling (no new component styles beyond
  placement).
- **Placement** — sticky to the top of the scrolling modal card, with right padding
  so it clears the absolute Close button; a bottom divider separates it from the
  detail content. A mobile rule (≤760px) adjusts the negative margins to the card's
  smaller padding.

## 2. How it works (single source of truth)

The Elements & Symbols carousel already owns the stepping logic (`rotate()`), the
carousel arrows (`#esPrev`/`#esNext`), and the live position (`#esLive`, e.g.
"2 / 9 · Night"). The in-panel buttons **reuse `rotate()`** rather than introducing a
second index:

```js
if (emPrev) emPrev.addEventListener("click", function () { rotate(active - 1); });
if (emNext) emNext.addEventListener("click", function () { rotate(active + 1); });
```

Because everything funnels through `rotate()` → `showDetail()`, all four surfaces stay
in one sync:

- the carousel tile selection,
- the open detail article,
- the carousel's `#esLive` indicator, and
- the new in-panel `#esmPos` indicator (updated inside `showDetail(i)`):

```js
var emp = document.getElementById("esmPos"); if (emp) { emp.textContent = (i + 1) + " of " + N; }
```

The in-panel control steps the **element** (not the detail's tabs) and inherits the
carousel's established wrap-around character, so it is consistent with the existing
Prev/Next arrows. Stepping also resets the modal card's internal scroll to the top
(the 9.1J.5 behaviour, now exercised by the new control too).

No page-specific data or selectors were added to `wx-detail-reader.js`.

## 3. Verification

Live-tested (`file://`, desktop + mobile), 0 page errors:

| Action | Result |
|--------|--------|
| Open card 0 | in-panel `1 of 9` · `#esLive` `1 / 9 · Garden` · title "Garden" |
| In-panel **Next** | `2 of 9` · `2 / 9 · Night` · title "Night" |
| In-panel Next after scrolling the card | scroll reset to 0, `3 of 9` "Earth" |
| In-panel **Prev** | steps back to `2 of 9` "Night" |
| Carousel arrow (`#esNext`) | in-panel `#esmPos` syncs to `3 of 9` |
| Wrap-around | Prev past item 1 wraps, matching the carousel |

Screenshots: `screenshots/pass-9.1j-6/es-inpanel-desktop.png`,
`es-inpanel-mobile.png` — the bar renders below the Close button with a divider and
no collision at 1280 and 390 wide.

## 4. Checks (all green)

| Check | Result |
|-------|--------|
| `tools/audit.mjs` | **PASSED — 0 errors, 0 warnings** |
| `html-validate creative-direction.html` | **exit 0** |
| `prettier --check` (tools) | **All matched files use Prettier code style** |
| `eslint` | **0 errors** |
| Playwright smoke | **38 passed** (new test 38: in-panel Prev/Next mirrors the carousel + scroll reset + sync) |

## 5. Version normalisation

- **Display** version stays `2026.9.1J`.
- **Package** semver bumped to `2026.9.1-j.6` (`package.json`, `package-lock.json`).
- **Version-normalised diff vs 9.1J.5:** only `creative-direction.html` (+20 lines)
  and `tools/smoke.spec.mjs` (+1 test) differ; the controller and every other runtime
  file are identical.

## 6. Deliverables

- `PASS-9.1J-6-REPORT.md` (this file)
- Complete split working-copy package `wx2026-pass-9.1J-6.zip.part-*`
- `REASSEMBLE-9.1J-6.txt` (Windows `copy /b` reassembly) + `UNPACK-9.1J-6.bat` (double-click)
- `SHA-256` checksum of the reassembled ZIP
