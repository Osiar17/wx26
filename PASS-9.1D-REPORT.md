# WX 2026 — Pass 9.1D Report

**Pass:** 9.1D — Musical Identity mobile artefact repair **only**
**Route:** creative-direction.html#musical
**Display version:** 2026.9.1D **Package semver:** 2026.9.1-d
**Base:** completed Pass 9.1C source **Date:** 2026-07-22

## 1. Objective

Remove the large unintended vertical shape running through the Musical Identity
segment on mobile, without touching any other view, page, content or the desktop
design.

## 2. Root cause (verified in the 9.1C source before editing)

The Musical Identity "journey" nodes are buttons `.fyp-hex`, each containing a
decorative `.fyp-hexshape` styled `position:absolute; inset:0; clip-path:polygon(hexagon)`.

The mobile rule set (`@media(max-width:900px)`) reflows the nodes into a 2-column
grid and, in doing so, set:

```
.fyp-map-panel{position:static}
.fyp-hexmap{… position:static …}
.fyp-hex{position:static !important; … transform:none !important}
```

Making `.fyp-hex` `static` removed the containing block for its absolutely
positioned child. With `.fyp-hexmap` and `.fyp-map-panel` also `static`, the
`.fyp-hexshape` resolved its `inset:0` against the nearest **positioned**
ancestor — `.ws-content` — and expanded to fill it. This is exactly the
hypothesised failure mode (positioning context stripped, `inset:0` child escapes
to a much larger ancestor), confirmed by measurement rather than assumed.

## 3. Before / after computed dimensions (375 × 667)

| | `.fyp-hexshape` size | offsetParent | `.fyp-hex` position |
|--|--|--|--|
| **Before** | **375 × 9186 px** (full page height) | `.ws-content` | static |
| **After**  | **375 × 136 px** (matches its hex) | `.fyp-hex` | relative |

Confined at every tested width (shape height = its hex height): 320→112px,
360→129px, 375→136px, 390→142px, 414→153px, 768→292px, 1366/1440→106px.

## 4. Exact change

File **`creative-direction.html`**, mobile block `@media(max-width:900px)`, one
declaration:

- Before: `.fyp-hex{position:static !important; width:100% !important; height:auto !important; aspect-ratio:1.15/1; left:auto !important; top:auto !important; transform:none !important}`
- After:  `.fyp-hex{position:relative !important; …unchanged…}`

`relative` flows identically inside the grid (no offsets applied) but restores
`.fyp-hex` as the containing block, re-confining `.fyp-hexshape` (`inset:0`) to
the hex. No markup, no JS, no desktop rule, and no other selector was changed.

## 5. Verification (Chromium/Playwright, repo-subpath static server)

All eight required widths, loaded directly at `#musical`:

| Width | Artefact shape H | Nodes visible | H-overflow | JS errors | Failed local reqs |
|------:|-----------------:|--------------:|-----------:|----------:|------------------:|
| 320×568 | 112 | 2 | 0 | 0 | 0 |
| 360×640 | 129 | 2 | 0 | 0 | 0 |
| 375×667 | 136 | 2 | 0 | 0 | 0 |
| 390×844 | 142 | 2 | 0 | 0 | 0 |
| 414×896 | 153 | 2 | 0 | 0 | 0 |
| 768×1024 | 292 | 2 | 0 | 0 | 0 |
| 1366×768 | 106 | 2 | 0 | 0 | 0 |
| 1440×900 | 106 | 2 | 0 | 0 | 0 |

- Vertical artefact absent; journey nodes ("Instruments", "Voices") render as
  proper hexagons confined to their own cards; headings/descriptions readable;
  no decorative layer over content.
- Inactive Musical Identity panels (story, elements, mood, identity) are
  `display:none` (height 0); only the active `musical` panel renders. The page's
  remaining height is legitimate Musical Identity content, not an escaped shape.
- Direct `#musical` load works; Creative Direction Back/Forward hash navigation
  works (set `#mood` → Back → `#musical` → Forward → `#mood`); journey-node
  keyboard focus + Enter activation work; 0 JS errors; no failed local requests.
  (Only console noise is the sandbox-blocked Google Fonts host — environment
  limitation, not a site defect.)

## 6. Five standard checks

audit **0 errors / 0 warnings**; html-validate **pass**; prettier format:check
**pass**; eslint **pass**; Playwright smoke **24/24 pass**.

## 7. Scope confirmation — what did NOT change

Unchanged: the Creative Direction navigation wheel, Mood Board, Theme Brief,
Playbook, Setlist, Lyrics, favicon/404 assets, global navigation, footer,
cross-page navigation, exports, wording, routes, indexing policy, and all Musical
Identity content / instrument data. A version-normalized diff shows every other
HTML page differs only in its shared version string; creative-direction's
functional diff is the single `.fyp-hex` position declaration (plus an explanatory
comment). Desktop Musical Identity is visually unchanged.

## 8. Before / after screenshots

`screenshots/pass-9.1d/`: before-320/375/390, after-320/375/390,
before-desktop-1440, after-desktop-1440, and hexmap-after-375 (confined nodes).
