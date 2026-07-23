# PASS 9.1L.1 — Header Action Grouping and Playbook Footer Correction

**Site:** Worship Experience 2026 (static HTML/CSS/vanilla JS, GitHub Pages subpath)
**Display version:** `2026.9.1L` (unchanged) · **Package semver:** `2026.9.1-l.1`
**Pass label:** Pass 9.1L.1 — Header Action Grouping and Playbook Footer Correction
**Working copy:** `wx2026-pass-9.1L-1` (duplicated from `wx2026-pass-9.1L-rebuild`; that source was **not** modified)
**Date:** 2026-07-23

Two visual-integration corrections, strictly limited to the two defects and their
tests. Navigation order, Creative Direction branch logic, Setlist branch metadata,
dropdown contents, Workspace ordering, page content and exports are unchanged;
`assets/js/wx-detail-reader.js` is **byte-identical**.

## Header — exact root cause

`site-nav.js` injected the All Pages arrow with `ws.parentNode.insertBefore(btn, ws)`,
i.e. as an **independent flex child of the header, between the logo and Workspace**. The
countdown is `position:absolute; left:50%; top:50%; transform:translate(-50%,-50%)`
(out of flow) and the header (`.site-nav` / `.topbar`) uses
`justify-content:space-between`. With three flex children (logo, arrow, Workspace),
space-between placed the arrow in the **centre** — directly over the absolutely-centred
countdown.

### Fix (wrapper/injection change — `assets/js/site-nav.js`)

`injectTrigger()` now finds the header (`.topbar, .site-nav`) and its `.site-nav__ws`,
inserts one right-side group in Workspace's former slot, and moves both controls into it:

```
<div class="wx-header-actions">
  <a class="site-nav__ws">… Workspace</a>      <!-- first -->
  <div class="wx-pages-control">               <!-- second -->
    <button class="wx-allpages">▾</button>
    <div class="wx-menu">…</div>                <!-- dropdown anchors here -->
  </div>
</div>
```

The header is again `logo | centred countdown | right action group`, so the arrow is
never a middle item. The dropdown anchors to `.wx-pages-control` (`position:relative`),
`top:100%; right:0` — beneath the arrow, aligned to the group's right edge, inside the
viewport.

### CSS (`assets/css/components.css`)

```
.wx-header-actions{display:flex;align-items:center;justify-content:flex-end;
  gap:clamp(.45rem,1vw,.7rem);flex:0 0 auto;min-width:0}
.wx-pages-control{position:relative;display:inline-flex;align-items:center}
```

No `transform:translateX()` or negative margins. Narrow phones (≤480 / ≤360) reduce the
Workspace padding and the group gap, and (≤414) drop Workspace's decorative back-arrow,
so the group never clips, overflows or overlaps the countdown — text is never hidden and
the countdown is never hidden.

## Header geometry measurements (after)

Countdown centre vs viewport centre and clearances, measured across 320–1440:

| Page @ width            | countdown-centre offset | cd∩trigger | cd∩Workspace | Workspace→arrow gap | arrow inside viewport |
| ----------------------- | ----------------------: | :--------: | :----------: | ------------------: | --------------------: |
| index @1366             |                     0px |     no     |      no      |                11px |                  38px |
| index @320              |                     0px |     no     |      no      |                 7px |                  12px |
| Creative Direction @320 |                     0px |     no     |      no      |                ≥6px |                  12px |
| Theme Brief @320        |                     0px |     no     |      no      |                ≥6px |                  12px |
| Playbook @320           |                     0px |     no     |      no      |                ≥6px |                  12px |

All reader header families use `.site-nav` (concept, theme-brief, bible-study,
music-workshop, blueprint, setlist, lyrics, creative-direction, playbook) or `.topbar`
(index); every one now groups the arrow with Workspace, never in the countdown region.
Exactly one `.wx-header-actions` and one `.wx-allpages` per page.

## Playbook footer — exact root cause

The Playbook footer contained four children — `eco-yes`, the legacy `.eco-mid`
"Playbook · WX 2026" label, the injected `.wx-fnav`, and `eco-ccc` — so the navigation
could not be the true centre element.

### Fix (`playbook.html`)

- **Markup:** the `<span class="eco-mid">Playbook · WX 2026</span>` element is removed
  (it had no remaining semantic purpose and is not part of any print/export output; the
  now-unused `.eco-mid` rule was dropped too).
- **CSS:** the Playbook `.eco-foot` uses a true three-column grid so the nav is centred
  independently of the unequal YES/CCC widths:
  ```
  .eco-foot{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center}
  .eco-foot .eco-yes{justify-self:start}
  .eco-foot [data-wx-fnav]{justify-self:center}
  .eco-foot .eco-ccc{justify-self:end}
  ```
  YES and CCC clamp sizes are preserved from Pass 9.1K; mobile reflow (shared 9.1K
  centred row) is preserved.

## Footer centring measurements (after)

| Playbook @ width | legacy label | visible top-level groups | nav offset from footer centre | footer height |
| ---------------- | :----------: | ------------------------ | ----------------------------: | ------------: |
| 320              |    absent    | YES · nav · CCC          |                           2px |         108px |
| 390              |    absent    | YES · nav · CCC          |                           2px |         108px |
| 1366             |    absent    | YES · nav · CCC          |                           0px |         150px |

Previous → `creative-direction.html#identity` and Next → `setlist.html?from=playbook`
are preserved. No fourth child, no floating label, no logo displacement, no horizontal
overflow.

## I. Other footers

No other page had a page-specific centre label competing with `.wx-fnav` (only Playbook
carried `.eco-mid`). Pages already correct are visually unchanged. No footer gained a
fourth child; print/export output is unchanged.

## Tests & validation

**51 Playwright tests pass** (48 retained — one 9.1K Playbook-label test updated to the
corrected three-part expectation — plus 3 new: header action grouping across
index/Playbook/CD/Theme-Brief at desktop + 320; desktop countdown centred within ≤2px;
Playbook footer YES/nav/CCC with the legacy label gone and nav centred). All fifteen
reader families, the branch logic, Setlist metadata, Workspace ordering and print/export
safeguards remain green. audit 0/0, html-validate exit 0, prettier clean, eslint 0. No
horizontal overflow at 320–1440.

## Screenshots (screenshots/pass-9.1l-1/)

Header before/after: `header-index-320-*`, `header-index-1366-*`,
`header-playbook-320-*`, `header-playbook-1366-*`; `dropdown-open-1366-after.png`.
Footer before/after: `footer-playbook-320-*`, `footer-playbook-390-*`,
`footer-playbook-1366-*`.

## Version-normalised diff

Changed: `assets/js/site-nav.js` (`injectTrigger`/`placeMenu` grouping),
`assets/css/components.css` (`.wx-header-actions`/`.wx-pages-control` + narrow-width
rules; removed the `margin-right` on `.wx-allpages`), `playbook.html` (removed `.eco-mid`
element + rule, `.eco-foot` grid), `tools/smoke.spec.mjs` (+3 tests, 1 updated), and the
package semver. Display version, generator meta, `wx-detail-reader.js` and all content
are unchanged.

## Confirmation

Navigation order and branching were **not** touched. No content or export data changed.
Pass 9.1L.1 is complete; no subsequent pass was begun.

## Deliverables

`PASS-9.1L-1-REPORT.md`; split working-copy package; `UNPACK-9.1L-1.bat`;
`REASSEMBLE-9.1L-1.txt` + SHA-256.
