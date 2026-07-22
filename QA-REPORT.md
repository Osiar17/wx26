<!-- CURRENT STATUS is kept at the top of this report by request. -->
# QA REPORT — CURRENT STATUS (read this first)

This section supersedes earlier per-pass "limitations" notes so resolved items
are not mistaken for current defects. The historical sections below are retained
as an audit trail; individual statements there are marked resolved/superseded
where applicable.

Resolved / no longer a defect (do not re-report):
- **Mobile header countdown overlap** — resolved in Pass 2 (centralised fix).
- **Embedded `data:image`** — resolved in Pass 2; source contains none.
- **Google Fonts unescaped ampersands** — resolved in Pass 2 (`&amp;`); pages now
  parse with 0 messages.
- **Blueprint `link:"#"` / filename availability inference** — resolved in Pass 2
  (explicit `route` + `availability`).
- **Index missing H1 / nav / skip link; "Ministries WX Playbook" label** —
  resolved in Pass 3.
- **theme-brief two headers / no main** — resolved in Pass 3 (one header, one main).
- **creative-direction H1/intro not first in DOM** — resolved in Pass 3.
- **bible-study "Flight or Surrendered", "in every sphere" phrasing** — resolved
  in Pass 3.
- **Lyric Book "placeholder" assumption** — obsolete since Pass 1; Lyrics is the
  authoritative current file.
- **Wildflower Purple `#8E6E9E`** — corrected to `#7A4CB8` (Pass 1); consistent.
- **Skip links missing on some pages** — resolved in Pass 4: all ten pages have a
  visible-on-focus skip link whose activation moves focus into `<main>` (verified).
- **creative-direction H1/intro not inside the main landmark** — resolved in
  Pass 4 (H1 + `#home` are now the first content inside `<main>`).
- **Empty JS-populated headings** — resolved in Pass 4 (all named).
- **Sticky header could cover anchor destinations** — resolved in Pass 4
  (`scroll-padding-top`; verified anchor target sits below the bar).
- **Pass 4 `scrollTo` wrapper broke object-form scrolling site-wide** — FIXED in
  Pass 5. The reduced-motion wrapper passed an extra `undefined` argument, making
  the browser pick the `(x,y)` overload and cancel the scroll. This silently broke
  playbook navigation (the two reported playbook regressions), the concept carousel
  arrows, theme-brief phase scrolling, creative-direction workspace scrolling and
  blueprint view/task scrolling. All repaired.
- **Global `scroll-padding-top` offset the index `#hub` gateway** — FIXED in Pass 5
  (replaced with a scoped `:target` scroll-margin; `#hub` opts out so the gateway
  composition lands at the top). Section-heading anchors keep their header clearance.
- **Small touch targets** — largely resolved in Pass 4 via invisible hit-area
  expansion; see the Pass 4 matrix for the few remaining AAA (44px) gaps that were
  left to preserve dense layouts (all meet or are documented against AA 24px).

Still open / deferred by design (not defects introduced here):
- Full CSS token/component migration into the shared stylesheets, removal of the
  superseded per-page countdown updaters, broad page CSS/JS externalisation,
  Blueprint/Playbook data-from-logic separation, and shared Setlist/Lyrics
  catalogue modules — all deliberately deferred to the performance/code-health and
  music-data passes (see Pass 2 "Deferred").
- Firefox/Safari not executed in this environment (Blink only). Standards-based
  changes; manual spot-check recommended before release.

---


---

# WX 2026 — QA REPORT (Pass 1)

## Updated audit assumptions (corrections to the earlier audit)
- **Lyric Book is no longer a placeholder.** `lyrics.html` and `setlist.html`
  are authoritative current working files; their lyric text, order, translations
  and arrangement notes were treated as source of truth and left unaltered.
- **Google Fonts are acceptable.** The site is a static GitHub Pages deployment;
  full offline operation is not required, so the Google Fonts `<link>`s are a
  valid dependency and were retained.
- **Decorative `alt=""` is valid.** Empty alt on decorative images is the
  correct accessible pattern and was preserved; it is not a missing-alt defect.
- **Musical Identity is an internal Creative Direction segment.** Its canonical
  location is `creative-direction.html#musical`; there is no standalone
  `musical-identity.html` page, and links were pointed at the segment.

## Tools / methods
- **Rendering & layout measurement:** headless Chromium (Playwright, Chromium
  1194 — the current Chrome engine). Each page loaded from `file://` and the
  document `scrollWidth − clientWidth` measured, with the overflowing elements
  identified where present.
- **JavaScript health:** `pageerror` capture on every page load, before and
  after edits.
- **Reference integrity:** a script enumerated every `href`, `src` and CSS
  `url()` (data URIs excluded) plus JS `*.html` string links and checked each
  against the packaged files.
- **HTML parse validation:** `html5lib` strict parse of all ten pages.
- **Deep-link / history:** scripted navigation of the Creative Direction hash
  routes including a real browser Back action.
- **Visual regression:** before/after full-viewport screenshots of representative
  pages from a pristine extraction of the original ZIP versus the revised site.

## Widths / engines tested
- Widths: **320, 360, 390, 430 px** (mobile blocker range) and **1280 px**
  (desktop regression).
- Engine: Chromium (Blink) — the shared engine of Chrome and Edge. Firefox and
  Safari were not run in this environment (see Limitations).

## Results

### Layout / overflow (document width vs viewport)
| Page | 320 | 360 | 390 | 430 | Notes |
|------|-----|-----|-----|-----|-------|
| concept.html | ✅ | ✅ | ✅ | ✅ | Was +6,592 → +8,013px overflow; now 0. Carousel scrolls inside its component. |
| theme-brief.html | ✅ | ✅ | ✅ | ✅ | No document overflow before/after; band `<h1>` was **clipped** and is now fully visible & wrapped. |
| index / creative-direction / lyrics / setlist / playbook / blueprint / music-workshop / bible-study | ✅ | ✅ | ✅ | ✅ | No document overflow. |

### JavaScript
- No `pageerror` on any page, before or after the edits (all 10 pages ×
  4 mobile widths, and desktop).

### Reference integrity
- All static `href` / `src` / `url()` and JS `*.html` links resolve, **except**
  the four intentional pending routes (Flow Map, Production Cue Book, D-Day
  Running Order, Post-Experience Report), which now render as "Coming Soon"
  states inside the Blueprint rather than active links. See ROUTE-MANIFEST.md.
- The previously missing `assets/calibrate-reading-night.jpg` reference was
  removed; no other missing assets remain.

### Blueprint follow-up fixes (Pass 1.1) — verified
- **Worship Roadmap route** `setlist.html#roadmap` → `setlist.html#roadmap-intro`.
  In-browser: loading `setlist.html#roadmap-intro` scrolls the page
  (`scrollY ≈ 762`) and places the Worship Roadmap section at the top of the
  viewport (section top ≈ 88px under the sticky header). ✅
- **Vocal & Instrumental Training Frameworks** (`link:"#"`) now uses the unified
  "Coming Soon" treatment. Verified: list item renders as a non-clickable
  `<div class="pending" aria-disabled="true">` with "Coming soon" (not an
  anchor); detail CTA renders as `<span class="dlv-open disabled"
  aria-disabled="true">Coming soon</span>` with **no `href`** (cannot jump to
  top), not an active link, and not a tab stop. No `pageerror` on blueprint.html. ✅

### Deep links & history (Creative Direction)
- `creative-direction.html#musical` opens the Musical Identity segment on load. ✅
- Selecting another segment updates the URL hash. ✅
- Browser **Back** returns to the previous segment (verified `#story` → Back →
  `#musical`). ✅
- Unknown/empty hash resolves to the home wheel. ✅

### HTML parse validation
- All ten pages parse. The only messages are two per page: `expected-named-entity`
  on the Google Fonts `<link>` URL, caused by literal `&` before `family=` /
  `display=` in the query string. These are cosmetic — browsers parse the URL
  correctly and fonts load — and are **pre-existing** (present in the original
  files, not introduced here). Left unchanged to keep Pass 1 strictly scoped;
  logged here as an accepted, harmless item.

### Visual regression (before vs after, 1280px)
- lyrics, setlist, creative-direction, music-workshop, blueprint, index —
  composition, hero copy and atmosphere identical. No unintended regression
  observed. The Wildflower Purple correction (`#8E6E9E → #7A4CB8`) is the one
  intended visible change on the five affected pages; it changes accent hue
  only, not layout.

## Unresolved limitations / notes
1. **Firefox & Safari not executed here.** Only Blink (Chromium) was available.
   All changes are standards CSS/JS (`min-width:0`, `white-space`, `text-wrap`,
   `hashchange`/`popstate`, `history.pushState`) with broad support; manual spot
   checks in Firefox and Safari are recommended before release.
2. **`text-wrap:balance`** (theme-brief band title) is progressively enhanced —
   unsupported browsers simply wrap normally; the title is still fully visible.
3. **Header countdown overlap at ≤~340px.** On the shared sticky header, the
   centred day-countdown ("132") can visually crowd the logo at the very
   narrowest widths. It is legible and not a document-overflow issue; it is a
   shared-component tweak outside the two named Pass-1 blockers and was left for
   a later pass to avoid risk to every page.
4. **Google Fonts ampersands** — see HTML validation above (cosmetic).
5. **theme-brief `.hero__title` CSS is unused** (the hero uses `.lead-h`).
   Flagged as a safe-cleanup candidate but **not** removed in Pass 1
   (see REMOVED-CODE.md).
6. **Stylised pause line** `Not my will, But His will Be Done.`
   (theme-brief) has irregular capitalisation but reads as deliberate liturgical
   styling; left unchanged to avoid altering intent. Flagged for editorial review.

## Deferred to a later pass (intentionally NOT done in Pass 1)
- **Base64 asset externalisation.** 6 JPEG + 1 WebP raster data URIs remain
  embedded (chiefly in `theme-brief.html`, plus one each in `index.html` and
  `creative-direction.html`), and 11 inline SVG data URIs remain. Per the Pass 1
  instruction ("do not perform a broad architecture rewrite yet") these were not
  externalised in this pass; they are catalogued for the asset pass.
- **Broad safe-cleanup / reformatting** of HTML/CSS/JS (dead-selector removal,
  formatting) beyond the targeted repairs above.

---

# QA REPORT — Pass 2 (Shared foundation & image externalisation)

## Tools / methods
- Headless Chromium (Playwright, Chromium engine) for rendering, JS-error
  capture, failed-request capture, computed-layout assertions and screenshots.
- Pillow to validate every externalised raster decodes to a valid image.
- ImageMagick `compare -metric AE` for before/after pixel-diff of all pages.
- Standalone-file validation of every externalised SVG.

## Widths / engines
- Desktop 1280px (visual regression), mobile 320 / 340 / 360 / 390 / 430px
  (header fix + no-overflow). Engine: Chromium (Blink). Firefox/Safari not run
  here (see Limitations).

## Results
### Image externalisation
- `data:image` URIs remaining in source: **0** (HTML + CSS + JS).
- Externalised rasters validated: `index-garden.jpg` 1376×768, theme-brief
  photos 1260×720 / 1376×768 / 2800×390 (webp) / 1345×896 — all decode cleanly.
- No failed asset requests and no broken `<img>` on any page after externalisation.
- Externalised SVG textures are valid standalone files (percent-encoding decoded
  so `100%` and `url(#n)` resolve as files, not `%25`/`%23`).

### Visual regression (before vs after, 1280px, full page)
| Page | changed px (fuzz 3%) |
|------|----------------------|
| index, concept, creative-direction, theme-brief, setlist, lyrics, playbook, blueprint, bible-study | 0 |
| music-workshop | 1 (single antialiasing pixel on an externalised SVG pattern) |

Page heights identical before/after on all ten pages.

### Shared foundation / registry
- All ten pages load `site-config.js` + `routes.js` + `site.js` and expose
  `window.WX` (routes + phases + palette). `canonical.js` removed; no page
  references it. No JS errors on any page.
- Countdown renders `132` on all pages via the centralised `site.js`
  (single-sourced date from `site-config.js`).

### Header countdown fix (≤360px)
- Computed-geometry check at 320 and 340px on the topbar, band and pm-head
  header layouts: countdown overlaps neither the logo nor the Workspace control
  (position becomes `static`/in-flow). Countdown preserved (number visible) at
  all mobile sizes.

### Blueprint availability model
- `Setlist` → `{route:"setlist.html", availability:"live"}` renders as an anchor.
- `Flow Map` → `{route:"flow-map.html", availability:"pending"}` renders Coming Soon.
- `Vocal & Instrumental Training Frameworks` → `{route:null, availability:"pending"}`
  renders a non-anchor `<span>Coming soon</span>` — no `href`, not focusable.

### Preserved Pass 1 / 1.1 behaviour (re-verified)
- Creative Direction `#musical` deep-link opens the Musical Identity segment;
  Back returns to `#musical`. Setlist `#roadmap-intro` scrolls to the Worship
  Roadmap section (top ≈ 88px under sticky header). Theme-brief accordion works
  by click and keyboard (now via addEventListener + `aria-expanded`).

## Unresolved limitations
1. **Firefox & Safari not executed here** — only Blink was available. All added
   code is standards CSS/JS with broad support; manual spot-checks recommended
   before release.
2. **Reduced-motion safeguard** (base.css) applies only under
   `prefers-reduced-motion: reduce`; for those users some decorative loops/
   transitions become instant — intended accessibility behaviour, noted for review.
3. **Google Fonts ampersands** now `&amp;` (valid); fonts retained as hosted
   dependency by design.

## Deferred to a focused follow-up (explicitly NOT done in Pass 2)
- **Full CSS consolidation**: each page keeps its bespoke `:root` and styles.
  Shared `tokens.css`/`base.css`/`components.css` were added *additively*
  (namespaced `--wx-*` / `.wx-*`) rather than by rewriting 10 bespoke design
  systems, because a full extraction risks visual regressions the brief prioritises
  avoiding. The shared token layer is in place for incremental adoption.
- **Large page-data module separation** (Blueprint/Playbook data arrays;
  shared phase/music catalogue for Setlist & Lyrics): deferred for the same
  no-regression reason. The Blueprint deliverable *data model* was still
  normalised in place (route/availability) as requested.

---

# QA REPORT — Pass 3 (Editorial, UX & semantic structure)

## Tools / methods
- Headless Chromium (Playwright): full-page before/after screenshots of all ten
  pages, JS-error capture, computed-layout/geometry assertions, keyboard-focus
  checks, and a **rendered editorial proof** that reads `document.body.innerText`
  (including JS-generated copy) to confirm each correction is present and each old
  string is gone.
- ImageMagick `compare` for before/after pixel diffs.
- `html5lib` strict parse of all pages.

## Widths / engines
- Desktop 1280px (regression); mobile 320/340/360/390/400px (header, skip link,
  Workspace label). Engine: Chromium (Blink).

## Results
- **JS errors:** none on any page after all edits.
- **HTML parse:** 0 messages on all ten pages.
- **Rendered editorial proof:** all required corrections present in rendered
  output; all superseded strings absent. Two creative-direction corrections
  (typography, texture) live in the Visual Identity panel — confirmed rendered
  when `#identity` is active.
- **Derived data:** playbook ministry count renders "Nine" from `MINS.length`
  (=9, matches tiles); no raw legacy code ("MM") leaks — "C3 Media" is shown.
- **Accessibility spot-checks:** index first Tab focuses the skip link
  (→ `#main`); theme-brief has one header + one main; creative-direction H1 is the
  first heading in the DOM; concept reference headings no longer take focus;
  playbook mobile Workspace label visible at 400px.
- **Visual regression (before/after, 1280px):** index, concept,
  creative-direction, lyrics, playbook — 0 changed px. theme-brief and blueprint
  differ only by intended copy edits (top-of-page composition pixel-identical in
  side-by-side review). setlist and music-workshop grew ~30px from added copy
  (text reflow below the edit), not layout regressions. All structural changes
  (theme-brief header/main, CD home reorder) verified visually invisible.

## Notes on conservative interpretations (recorded, not defects)
- **creative-direction** "guidance primary / research in appendix": the existing
  tabbed disclosures (Scripture · Echoes · Setting · Imagery · Expression, incl.
  the labelled "Textual note") already separate actionable guidance from research
  notes; no risky information-architecture rewrite was undertaken.
- **index availability**: verified consistent with `routes.js`; no data-binding
  rewrite added (would be gold-plating with regression risk).
- **blueprint mobile collapsed defaults**: overdue/at-risk work remains surfaced
  in the Overview and "Due in the next 14 days"/"Overdue" panels; no urgent work
  is hidden by collapse.


---

# QA REPORT — Pass 4 (Responsive & accessibility hardening — WCAG 2.2 AA)

## Tools / methods
- Headless Chromium (Playwright): scripted keyboard interaction (Tab, Enter,
  Space, Escape, arrows, Back/Forward), computed geometry (effective hit area
  incl. ::before/::after overlays, anchor-vs-header coverage), overflow checks
  across the width matrix, reduced-motion emulation, and full-page before/after
  pixel diffs. `html5lib` parse. No visual character was changed.

## Viewport / zoom matrix (document-level horizontal overflow)
Widths tested: 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 px; plus 200%
zoom (≈640 CSS px effective) and a landscape app-like case (740×360).

| Page | 320–1920 | 200% zoom | landscape | Result |
|------|----------|-----------|-----------|--------|
| all ten pages | no overflow at any width | no overflow | no overflow | PASS |

`body { overflow-x: hidden }` is **not** used as the fix; the containment comes
from the Pass 1/2 structural repairs (e.g. the concept carousel `min-width:0`).

## Accessibility matrix
| Check | Result |
|-------|--------|
| One meaningful `<h1>` per page | PASS (10/10) |
| `<main>` landmark + `<nav>` where nav exists | PASS |
| Visible-on-focus skip link → focus enters `<main>` | PASS (10/10, activation verified) |
| Empty headings | PASS (0 remaining; JS-populated titles named) |
| creative-direction H1/intro first inside `<main>` | PASS |
| Focus visible on dark theme (`:focus-visible` fallback) | PASS |
| Keyboard: flip cards (Enter/Space) | PASS |
| Keyboard: wheel segments (Enter/Space → panel + hash) | PASS |
| Dialog/drawer: focus enters, Escape closes, focus returns | PASS (blueprint drawer, CD element modal verified; same components on playbook/CD colour panel) |
| Hash Back/Forward (creative-direction) | PASS (Back→#mood, Forward→#identity) |
| Non-interactive reference headings out of tab order | PASS (concept `.ref` fixed in Pass 3) |
| Status/selection not colour-alone | PASS (`aria-selected` tabs, `aria-expanded` accordions/chips, `aria-pressed` ministries, "Coming soon" text for pending) |
| Sticky header does not cover anchor targets | PASS (`scroll-padding-top`; target top 76px ≥ 51px bar) |
| Reduced-motion policy (CSS + JS smooth-scroll) | PASS (transitions neutralised; `scrollIntoView`/`scrollTo` forced to `auto`) |
| iOS safe-area insets on fixed bars | PASS (`max(clamp(...), env(...))` — preserves desktop padding, extends on notched devices) |

## Target size (WCAG 2.5.8 AA = 24px; 44px = AAA / this pass's goal)
Hit areas were enlarged **invisibly** via a centered transparent `::after`/`::before`
(no reflow — every page's document height is byte-identical to the Pass 3 baseline)
and, for the shared header/inline links, via padding that nets to zero layout change.

| Page | targets | < 24px (AA) | < 44px (AAA gap) |
|------|---------|-------------|-------------------|
| index | 14 | 0 | 0 |
| theme-brief | 9 | 0 | 0 |
| bible-study | 14 | 0 | 0 |
| concept | 14 | 0 | 2 (`.car-nav` 40×40, absolute) |
| music-workshop | 13 | 0 | 1 (`.triad__center` 34px) |
| creative-direction | 27 | 0 | 1 (`.rx` 44 via ::after) |
| setlist | 22 | 0 | 3 (inline ref links 27–32px + a filter input 38px) |
| playbook | 29 | 0 | ~9 (`.fbtn` 40×40, `.drawer__close` 34px — absolute icon buttons) |
| blueprint | 95 | 0 | ~25 (`.subchip` 40px, some 26px table buttons) |
| lyrics | 228 | remaining nested medley sub-links (16px, inline) | dense Contents/line controls |

Remaining sub-44 controls are (a) absolutely/fixed-positioned icon & close buttons
(40×40 / 34px) whose placement must not be disturbed, and (b) the deliberately
dense lyric-book Contents/line controls. All others meet AA (24px). The lyric-book
nested medley sub-links are compact inline links inside running Contents text —
kept per the lyric-book preservation mandate and the WCAG 2.5.8 inline/essential
exceptions; they remain fully keyboard-operable.

## Visual regression (before/after, 1280px, full page)
index, concept, creative-direction, theme-brief, playbook, blueprint,
music-workshop: 0 changed px. setlist / lyrics: ~570 px each — the intended
vertical hit-padding on inline reference links (net-zero layout). bible-study:
sub-pixel differences in a decorative feTurbulence noise background only
(height byte-identical; text/composition pixel-identical).

## Unresolved limitations
- Firefox / Safari not executed here (Chromium/Blink only). All changes are
  standards CSS/JS with broad support; manual spot-check recommended.
- AAA 44px target size not reached for the absolute icon/close buttons and the
  dense lyric-book Contents links (documented above); all meet AA 24px except the
  inline medley sub-links, which fall under the WCAG 2.5.8 inline exception.
- The deferred code-health / music-data items from earlier passes remain deferred.


---

# QA REPORT — Pass 5 (Interaction regression sweep)

## Method
Automated interaction crawler (Playwright / Chromium): enumerated every visible
operable control on all ten pages, grouped into families, and clicked one
representative of each from a clean reload — recording before/after `scrollY`,
`document.activeElement`, URL/hash, and `aria-expanded/selected/pressed`, then
flagging anomalies (focus jumping to `<main>`, scroll resetting to top, no state
change). Plus scripted stateful journeys for dynamically-rendered controls with
mouse, keyboard, `prefers-reduced-motion`, direct hash entry and Back/Forward.

## Root-cause diagnosis of the reported regressions
All three reported issues (and five more found by the sweep) trace to two Pass 4
shared changes:
1. **`site.js` reduced-motion scroll wrapper** forwarded `scrollTo`/`scrollBy`
   with an extra `undefined` second argument. `scrollTo({top:y}, undefined)` is
   read as the two-number overload → `NaN` → the scroll is cancelled. Repaired by
   forwarding the original `arguments` verbatim on the normal path and only
   substituting a reduced-motion options object (preserving arity) otherwise.
   Confirmed: object-form `scrollTo` now scrolls; playbook Find-Your-Ministry and
   Overview-eye scroll correctly; concept carousel arrows, theme-brief and
   creative-direction scrolling restored.
2. **Global `html { scroll-padding-top: 4.75rem }`** offset every anchor landing,
   pushing the index `#hub` gateway 76px down. Replaced with `:target {
   scroll-margin-top: 3.25rem }` (scoped to the actual destination) and
   `#hub:target { scroll-margin-top: 0 }`. Index gateway lands at the top; section
   anchors (e.g. setlist `#roadmap-intro`) still clear the sticky header.

These shared behaviours are now scoped: the skip-link handler only moves focus to
`<main>` for skip links; normal in-page links and state controls are untouched.

## Controls tested per page (families) — all passed
| Page | Families tested | Passed | Repaired | Deferred |
|------|-----------------|--------|----------|----------|
| index | 6 | 6 | 1 (Enter→#hub) | 0 |
| concept | 7 | 7 | 1 (carousel arrows) | 0 |
| creative-direction | 10 | 10 | 1 (workspace scroll) | 0 |
| theme-brief | 6 | 6 | 1 (phase scroll) | 0 |
| bible-study | 7 | 7 | 0 | 0 |
| music-workshop | 9 | 9 | 0 | 0 |
| playbook | 12 | 12 | 2 (Find-Ministry, Overview-eye) | 0 |
| blueprint | 18 | 18 | 1 (view/task scroll) | 0 |
| setlist | 13 | 13 | 0 | 0 |
| lyrics | 17 | 17 | 0 | 0 |
| **TOTAL** | **105** | **105** | **7** | **0** |

Plus the stateful journeys in INTERACTION-MATRIX.md (wheel segments, flip cards,
modals/drawers with focus-trap + Escape + focus-return, tabs, accordions, search,
Contents, deep hashes, Back/Forward) — all pass.

## Viewports / input methods exercised
1280×900 (crawl + diff); 320×568, 360×800, 390×844, 430×932, 768×1024, 1280×720,
1440×900, 1920×1080, landscape 740×360, and 200% zoom for the repaired flows;
mouse, keyboard, `prefers-reduced-motion: reduce`, direct URL/hash, Back/Forward.
The two reported playbook flows and the index gateway were re-verified at 390px
and under reduced-motion (still scroll correctly).

## Visual regression
Behaviour-only changes: before/after full-page diff is 0 changed px on 9/10 pages
(creative-direction 45px = wheel anti-aliasing). No composition or content changed.

## Could not be exhaustively automated
- The playbook task drawer opens from task lists reached several views deep; its
  open/focus-trap/Escape/focus-return machinery is the shared `openDrawer`/
  `closeBrief` code verified on the blueprint drawer.
- Real Firefox/Safari engines were unavailable (Chromium/Blink only).

## Engines used
Chromium (Blink) via Playwright. Firefox/Safari recommended for a manual pass.


---

# QA REPORT — Pass 6 (Performance, code health; measured)

Measurement engine: Chromium (Blink) via Playwright against a local HTTP server
(`python -m http.server`). Text transfer figures are gzip-compressed (computed
from response bodies); images/fonts are already compressed and counted as served.

## Correction to the Pass 4 target-size matrix (safeguard)
The Pass 4 table conflated "measured 44px" with "<44px gap". Corrected reading,
using the *effective* hit area (control box plus its transparent ::after/::before
expander), measured at 1280px:
- index, theme-brief, bible-study: 0 controls under 44px.
- concept: 2 (`.car-nav` 40×40 — absolutely positioned, excluded from the pseudo
  expander by design; ≥24px AA).
- creative-direction: `.rx` reaches 44 via ::after (not a gap).
- playbook / blueprint: the remaining sub-44 items are absolutely-positioned icon
  and close buttons (34–40px) — all ≥24px (WCAG 2.5.8 AA).
- **Lyrics inline exceptions, quantified:** `.toc-link` (28 Contents links) now
  reach 44px via the ::after expander. The remaining under-24px controls are the
  **17 nested medley component sub-links** (~74×16px) inside the Contents list —
  inline links in running text, which fall under the WCAG 2.5.8 *inline* exception
  and are kept compact per the lyric-book preservation mandate; they remain fully
  keyboard-operable. No other lyrics control is under 24px.
The pseudo hit-area expanders were re-audited for pointer conflicts: at every
control's centre point `elementFromPoint` returns that control (0 conflicts across
blueprint, lyrics (36 controls), setlist, playbook, creative-direction, concept).

## Reduced-motion (safeguard 1) — de-risked
The global `scrollTo`/`scrollBy`/`scrollIntoView` prototype override added in
Pass 4 was **removed**. Reduced motion is now honoured at each call site via
`window.WX.smoothBehavior()` (returns `"auto"` under `prefers-reduced-motion`,
else `"smooth"`), added to `site-config.js`. The 13 previously-unguarded literal
`behavior:"smooth"` calls (creative-direction ×10, blueprint, playbook,
theme-brief) now use it. Verified: every scroll interaction works in both normal
and reduced-motion modes, no native method is intercepted.

## Image optimisation (measured)
All referenced rasters (100) were encoded to WebP at q80–82; **originals are
retained** and used as fallbacks (`<picture><source type=image/webp>` for `<img>`;
`image-set(url(webp) type('image/webp'), url(original))` for CSS backgrounds).
Hidden Creative Direction segment images and below-fold `<img>` are `loading="lazy"`
(+`decoding="async"`); header logos and hero LCP images stay eager. Visual quality
verified — the Blue-Black/Midnight grading and shadow detail are preserved with no
banding (full-resolution before/after review of the Wade, Playbook and Blueprint
heroes; before/after page diffs 0.00–0.02%).

### Initial transfer per page (uncompressed served bytes)
> **⚠ Superseded by Pass 6.1.** The two transfer tables in this Pass 6 section
> (this "uncompressed served bytes" table and the "gzip-compressed initial
> transfer" paragraph that follows) were captured at **different scopes** — one
> before scrolling, one after, with different tooling — which is why some
> "uncompressed" values read smaller than the "gzip" ones. They are replaced by a
> single, consistently-scoped, directly-comparable table in **PERFORMANCE-MATRIX.md**
> (Pass 6.1). The numbers below are retained only as an audit trail; use the matrix.

| Page | Pass 5 baseline | Pass 6 | 
|------|-----------------|--------|
| index | 0.68 MB | 0.65 MB |
| concept | 2.09 MB | 0.97 MB |
| creative-direction | 5.33 MB | 1.50 MB |
| theme-brief | 1.14 MB | 1.11 MB |
| bible-study | 0.65 MB | 0.59 MB |
| music-workshop | 5.18 MB | 0.66 MB |
| playbook | 2.73 MB | 0.90 MB |
| blueprint | 2.56 MB | 0.83 MB |
| setlist | 2.08 MB | 0.62 MB |
| lyrics | 2.04 MB | 0.57 MB |
| **sum** | **~24.5 MB** | **8.4 MB** |

Gzip-compressed initial transfer (Pass 6): all standard pages ≤ ~1.1 MB; concept
1.49 MB; **creative-direction 1.63 MB** — the immersive exception, justified by
progressive (lazy) loading of its hidden segment media and documented here.
Safeguard 6 verified: a direct `creative-direction.html#musical` load activates the
Musical Identity segment and loads its media immediately; Back/Forward and all five
direct hashes still work.

## CLS (390px, scrolled to trigger lazy loads)
| Page | CLS |
|------|-----|
| index, concept, creative-direction, theme-brief, bible-study, music-workshop, playbook, blueprint, lyrics | ≤ 0.001 ✓ |
| setlist | **0.196 → 0.000 ✓ (repaired in Pass 6.1 — TFArrow `font-display:optional`; see Pass 6.1 section below and PERFORMANCE-MATRIX.md)** |

Because images sit in size-reserving containers, lazy-loading introduced no shift;
this is why intrinsic `width`/`height` were **not** applied blindly (safeguard 3) —
doing so previously distorted a CSS-cropped logo (Pass 4). The setlist door-shell
CLS was a non-media font-swap shift, **repaired in Pass 6.1** (details below).

## Verified no-regression
0 JS errors and 0 failed asset requests on all ten pages. Interaction re-check:
index `#hub`→top, playbook Find-Your-Ministry scroll, concept carousel, CD segment
Back/Forward, CD flip-card (Enter), blueprint drawer (open/Escape), skip link — all pass.

## Deferred to a focused follow-up (documented, not done here)
- **AVIF** variants (WebP already meets the transfer targets; AVIF adds a `<source>`
  and encode step — prepared as an additive next step).
- **Verified dead-code removal** (Creative Direction duplicate/legacy layers,
  Playbook legacy dashboard/MM CSS, Bible Study bridge/distance/glance families,
  Setlist old cue/governance families): requires per-state runtime coverage across
  every tab/overlay/filter/export before deletion; not performed to avoid removing
  live dynamic classes. `media-03.png` (35 KB) is the only truly unreferenced asset;
  the ~18 "unreferenced" large images are in fact referenced dynamically via JS `IMG`
  arrays (Creative Direction / concept) and were NOT removed.
- **Blueprint/Playbook data-from-logic separation** and the **Setlist/Lyrics shared
  catalogue** (safeguard 5 — reserved for the music-data pass): duplication inspected;
  safe module boundaries prepared; authoritative catalogue/lyric migration deferred.
- **External page CSS/JS**: the shared foundation is external; per-page bespoke
  CSS/JS remain inline to avoid regressions (documented trade-off).

---

# QA REPORT — Pass 6.1 (measurement normalisation & Setlist stability)

Engine: Chromium (Blink) via Playwright. **One identical protocol** for both
builds: local HTTP server, fresh context per page, HTTP cache disabled, no
service worker, viewport 390×844, initial-load milestone = `load` + 600 ms with
**no scroll and no CD-segment activation**; deferred media measured separately.
Full comparable tables live in **PERFORMANCE-MATRIX.md**.

## A. Corrected performance record
- First-load transfer, all ten pages, now **under 1 MB** (largest
  creative-direction 905 KB, was 5.47 MB). Site total **25.1 MB → 5.7 MB
  (−77.2%)**; all-opened total **26.2 MB → 9.1 MB (−65.2%)**.
- Four size categories kept distinct: (1) **repository/package** size *grew*
  24.5 MB → 31.8 MB because both WebP and original rasters are retained;
  (2) **first-load transfer**, (3) **decoded body**, and (4) **all-opened
  transfer** all fell sharply. No code was changed to improve a number.

## B. WebP fallback — verified, one gap closed
- **0 original rasters** fetched on first load on every page (WebP-only; never
  both candidates). `<picture>`/`image-set()` valid and subpath-safe.
- Lazy-on-scroll confirmed; direct CD hash entry loads its media without a home
  return; Back/Forward across segments confirmed.
- **Gap fixed:** the Creative-Direction segment `IMG` map still loaded 16 `.jpg`
  originals on segment open. Repointed to `.webp` + capture-phase `error`
  fallback to the retained `.jpg`. CD now **16 → 0** originals on full open.
  Originals kept on disk; none deleted.

## C. Setlist CLS — diagnosed and repaired (0.196 → 0.000)
- **Source element:** the vertically-centred `.door-shell` (and the nav CTA
  `.site-nav__ws`), both `font-family:var(--sans)` = TFArrow.
- **Before/after rects (390×844, cold):** at t≈208 ms the two `.cue` links
  measured 182 px + 170 px and **wrapped to two rows** (`.cues--row` height
  118 px, `.door-inner` 620 px, `.door-shell` top 93 / height 722); at t≈237 ms
  TFArrow swapped in, the same links narrowed to 161 px + 145 px and **collapsed
  to one row** (`.cues` 46 px, `.door-inner` 549 px, `.door-shell` top 129 /
  height 650). The centred shell's 72 px collapse moved the door content 36 px —
  the shift.
- **Cause:** self-hosted **TFArrow** (`assets/*.ttf`, `font-display:swap`) — a
  font swap, but **not** the Google serifs (CLS stayed 0.196 with
  googleapis/gstatic blocked; it vanished only when TFArrow was addressed).
- **Fix:** the five TFArrow `@font-face` rules changed `swap` → **`optional`**.
  No fixed heights, no `overflow:hidden`, no delayed visibility, no offsets.
- **After:** CLS **0.000** at 320/360/390/430/768/1280/1440, at 200 % zoom, and
  under reduced motion; TFArrow still paints on warm cache (presentation intact).

## D. Interaction matrix — 32 / 32 PASS
Full re-run appended to INTERACTION-MATRIX.md (Pass 5 record retained). Covers
index #hub + nav, concept carousel, all five CD segments + Back/Forward,
theme-brief scroll, playbook ministry/task controls, blueprint views/drawer,
setlist doorway/anchors/phase pills/search/export, lyrics
contents/search/item-anchors/exports, and reduced-motion scrolling.

## Target-size matrix — reconfirmed (no change needed)
The Pass 6 correction (measured 44 px effective hit area ≠ a <44 px gap) remains
accurate; the pseudo-expander pointer re-audit (0 conflicts) still holds. The
only sub-24 px controls remain the **17 inline medley sub-links** in the Lyrics
Contents list (WCAG 2.5.8 inline exception, kept per the lyric-book preservation
mandate, fully keyboard-operable). No target-size regression in Pass 6.1.

## Routes
No route or anchor changed — ROUTE-MANIFEST.md is unchanged.

---

# QA REPORT — Pass 7 (Setlist, Lyric Book and Shared Music Data)

Engine: Chromium (Blink) via Playwright, local HTTP server. Widths incl. 390 and
a 200%-zoom emulation (640 CSS px @ 2× DPR). Firefox/Safari not run in this
environment (standards-based changes; manual spot-check advised before release).

## What was tested and the results
- **Data single-source integrity.** A reconstruction test rebuilt the original
  `LYRIC_ITEMS` and `SETLIST_ITEMS` from the new shared modules and compared them
  field-by-field: **0 mismatches**. A before/after DOM render diff of both pages
  showed exactly one intended change (the Phase IV summary-line reconciliation).
  → No lyric text, translation, title, artist, order, medley structure or
  placeholder was altered.
- **Derived counts.** Setlist phase counts (4 · 7 · 12 · 5 = 28) and the Lyric
  Book export cover count are computed from the catalogue, not hard-coded.
- **Keyboard.** Setlist roadmap = a correct tablist/tab/tabpanel model (roving
  tabindex, Arrow keys move and select, `aria-selected` maintained). Lyric Book
  export menus and phase dropdowns open on click, close on Escape with focus
  returned, correct `aria-haspopup`/`aria-expanded`. Search returns results and
  Escape clears. Prev/next advances the current item and updates disabled state.
- **Exports.** Setlist Word/PDF/Print and Lyric Book Complete/Phase/Item ×
  Word/PDF/Print all build valid documents carrying the theme colon, official
  phases + subtitles and correct counts; PDF path shows the "Save as PDF" hint;
  pop-up-blocked print surfaces a clear error. Word downloads are labelled
  "Download Word (.doc)" — Word-compatible HTML, not a claimed true .docx.
  Filenames are safe (`WX2026_Lyric_Book.doc`, `WX2026_Lyrics_Phase_III.doc`,
  `WX2026_Lyrics_Item_14_Not_My_Will.doc`, `WX2026_Setlist.doc`).
- **Native Ctrl+P (fixed).** Previously the Lyric Book blanked `body` on print.
  Now both music pages have a purposeful print stylesheet; under print-media
  emulation the chrome is hidden, background is white, and all 28 items print. A
  `beforeprint` handler opens every collapsed lyric `<details>` (131/131) so full
  lyric text prints, then restores the on-screen state.
- **200% zoom.** Long lyric lines and translations wrap with **no horizontal
  scroll** (documentScrollWidth == clientWidth; 0 clipped lines).
- **Regression.** Full interaction matrix: **39/39 PASS**; 0 JS errors and 0
  failed requests across all ten pages. Setlist CLS still **0.000** at 390px;
  both music pages load **WebP-only** (0 originals).

## Visibility / noindex decision (Pass 7)
The Lyric Book reproduces the full lyric text of many third-party copyrighted
worship songs (Hillsong, Bethel, Kari Jobe, Tasha Cobbs Leonard, and others). It
is therefore treated as an **internal worship resource** and excluded from search
indexes via a per-page `<meta name="robots" content="noindex, nofollow">` (the
authoritative mechanism, and correct under a repository-subpath GitHub Pages
deployment) plus a root `robots.txt` Disallow. This is a deliberate, conservative
default — not an assertion that the content is private, and not a guess that it is
public. The **Setlist** (song titles, artists and running order only, no full
lyrics) remains publicly indexable. **To reverse:** delete the meta tag in
lyrics.html and the Disallow line in robots.txt once the lyric use is cleared for
public indexing.

## Unresolved limitations
- Word export is Word-compatible `.doc` HTML (opens in Word), not a binary
  `.docx`; this is stated on the control and in the label, per the brief.
- Firefox/Safari and physical-printer output were not exercised in this
  environment; print CSS is standards-based and emulation-verified.

---

# QA REPORT — Pass 7.1 (export engine repair)

Fixes a release-blocking freeze: activating **Print** or **Download PDF** on
Setlist/Lyrics could leave the live page unresponsive (mouse, click, wheel,
scrollbar, Page Down, arrows, Space dead; refresh sometimes blank). Download Word
was unaffected. Defect present in the original pre-audit files, not introduced by
Pass 7.

## Root cause
Print and PDF shared one path: `window.open('','_blank')` → `document.write(export)`
→ popup `print()`. The same-origin `about:blank` popup shares the opener's
renderer; cancelling its modal print dialog wedged the opener, and the
`document.write`n popup never fired `afterprint`/`pagehide`, so it was never torn
down (orphan popups accumulated). Word used a separate `Blob`+`<a download>`
path — hence unaffected.

## Repair
New shared engine `assets/js/wx-export.js` (`WXExport.printDocument`) renders the
standalone export document in a hidden, offscreen, `pointer-events:none` iframe
and prints only that iframe. The live page is never mutated (no body
replacement/hide, no pointer-events lock, no overflow lock, no overlay, no popup,
no exclusive `afterprint` dependence). Idempotent `WXExport.cleanup()` runs from
eight triggers incl. defensive startup and `pageshow`. Setlist, Lyrics and
Playbook all migrated to it; Download Word unchanged.

## Results (real print pathway, not emulation)
- Verified with headed Chromium `--kiosk-printing` (real print lifecycle) and the
  real export code path. After a real print the parent is **fully usable**:
  wheel scroll, TOC click → `#item-1`, search, prev/next all respond;
  `pointer-events:auto`; body visible; real `elementFromPoint`;
  `matchMedia('print')` false; **0 popups**; **0 leftover iframes**; **0 JS errors**.
- OLD build left **2 orphan popups** after 3 prints; NEW leaves **0**.
- **12/12** acceptance scenarios parent-safe (baseline, after search, after phase
  select, at item anchor, details open, reduced motion; both pages).
- 5× repeated Print and 5× repeated PDF cycles on all three pages — parent
  pristine each cycle.
- **Popup blocked** case is now moot: the engine never opens a popup, so a popup
  blocker cannot break export (improvement over the old "allow pop-ups" failure).
- **Download Word** still downloads `WX2026_Lyric_Book.doc` / `WX2026_Setlist.doc`.
- **Content** identical to Pass 7 (0 render diffs). Full interaction matrix 39/39;
  0 JS errors and 0 failed requests across all ten pages.

## Limitation
A browser's native print dialog cannot be scripted/cancelled by automation, so the
modal-cancel keystroke itself is not automated. The failure surface — parent
usability after a real print/return — was exercised with the real Chromium print
pathway, not print-media emulation. A final manual Print→Cancel in a normal
browser is recommended as a last check. See EXPORT-LIFECYCLE-MATRIX.md.

---

# QA REPORT — Pass 8 (GitHub Pages, metadata, documentation & checks)

Adds deployment-readiness, metadata, docs and automated checks. No page
composition, lyric data or export behaviour changed except the three targeted
fixes below.

## Tests run
- **Structural audit** (`node tools/audit.mjs .`, dependency-free): missing
  local refs, case-sensitive filename mismatch, subpath safety (no absolute-root
  refs), duplicate IDs, malformed anchors, residual `data:image`, per-page
  metadata (lang, single title, description, viewport, theme-color, favicon,
  img alt) and canonical drift (theme / phase titles+subtitles / `#7A4CB8`).
  Result: **0 errors, 0 warnings** across 11 HTML files.
- **HTML validation** (`html-validate`): pass. Config keeps correctness rules
  (empty-title, no-dup-id, required attributes, attribute-allowed-values,
  hidden-focusable) and disables opinionated/stylistic rules that conflict with
  the site's established, functional patterns (prefer-native-element,
  no-redundant-role, aria-label placement, unique-landmark, style-in-body).
- **Prettier** (`format:check`, tooling + docs only — site source is not
  reformatted): pass. **ESLint** (Node tooling): pass.
- **Playwright smoke** (desktop 1280×800 + mobile 390×844): **24/24 pass** — all
  ten pages load with 0 JS errors and 0 failed requests and carry
  title+description+favicon; setlist and lyrics render 28 items; lyrics is
  noindex; export leaves the page interactive; 404 renders and links back.
- Interaction matrix (39 checks) and the site-wide 0-error/0-failed-request
  sweep re-confirmed on the Pass 8 build.

## Widths / engines
320–1440 px covered by the audit + earlier passes; smoke tests at 1280 and 390.
Engine: Chromium (Blink). Firefox/Safari not run in this environment
(standards-based changes; manual spot-check advised before release).

## Fixes verified
- **blueprint.html** invalid nested `<picture>` flattened — desktop hero now
  serves `blueprint-hero-desktop.webp` (verified `currentSrc`, image decoded).
- **creative-direction.html** lightbox empty `src=""` removed (JS-populated).
- **playbook.html** floating bar gains `inert` when off-view — buttons no longer
  keyboard-focusable while hidden (verified `inert` + `aria-hidden` toggle).

## Metadata & deployment
- Unique titles (already present) + descriptions (added to 6 pages), favicon +
  apple-touch-icon, `theme-color`, and a `generator` version meta on every page.
- Robots policy applied (public vs noindex) via per-page meta + `robots.txt`;
  Open Graph/canonical intentionally omitted pending a known production URL.
- `404.html`, GitHub Actions CI (audit/validate/smoke/deploy), `README.md`,
  `VERSION`, `WX.version`.

## Unresolved limitations
- Firefox/Safari not exercised here.
- Word export is Word-compatible `.doc` HTML, not binary `.docx`.
- Open Graph / Twitter / canonical tags are deliberately absent until the
  production domain and per-page public-visibility decisions are finalized.
- The smoke suite requires `npx playwright install` in CI (the sandbox's
  pre-pinned browser differs); the delivered `playwright.config.mjs` is clean so
  CI installs the matching Chromium.
