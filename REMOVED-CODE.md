# WX 2026 — REMOVED CODE

> **Status note (kept at top).** Entries below are cumulative across passes.
> Several historical statements have been **superseded** by later passes and are
> marked inline. In particular:
> - The Blueprint **`link:"#"`** deliverable model described in the Pass 1.1 and
>   Pass 2 notes was **superseded in Pass 2** by explicit `route` + `availability`
>   fields, and there is no remaining `link:"#"` in the source. Treat any earlier
>   `link:"#"` reference as historical.
> - The former embedded `data:image` assets (Pass 1/2 notes) were **externalised in
>   Pass 2**; none remain.
> - The former `canonical.js` registry was **removed in Pass 2** (split into
>   `site-config.js` + `routes.js`).

---

# WX 2026 — REMOVED CODE (Pass 1)

Pass 1 is a scoped repair, not the broad safe-cleanup pass. Only one reference
was removed; no CSS selector families, JS functions or assets were deleted. Every
"unused" finding below that was *not* removed is recorded as a verified candidate
for a later cleanup pass, with the evidence gathered so far.

## Removed

### 1. `bible-study.html` — missing background image reference
- **Removed:** the image layer `url("assets/calibrate-reading-night.jpg") center right/cover no-repeat,`
  from the `.recog__img` background shorthand.
- **What remains:** the same rule's `radial-gradient(…)` and solid `#070a14`
  fallback, so the section keeps its dark atmospheric field.
- **Evidence it was safe to remove:** the referenced file is **not** present in
  `assets/` (confirmed by directory listing); it produced a failed network
  request on every load. The canonical instruction directs removing this exact
  reference unless a valid packaged replacement is unambiguously intended — none
  exists. No other rule or script references the image or the removed layer.

## Candidates identified but NOT removed in Pass 1 (verify before deleting)

### `theme-brief.html` — `.hero__title` / `.hero__title .y` CSS
- **Status:** appears unused — no element in `theme-brief.html` carries class
  `hero__title`; the hero uses `.lead-h`. No JS injects `hero__title`.
- **Why not removed yet:** static "unused" is only a candidate. It was left in
  place to keep Pass 1 free of cleanup risk; a dedicated cleanup pass should
  confirm no dynamic/inherited use across shared patterns before deleting.

### Site — Google Fonts URL ampersands
- Not code to remove; a validation nit (see QA-REPORT.md). No deletion warranted.

## Explicitly preserved (checked, deliberately kept)
- All lyric text, song order, arrangement notes, translations, credits and
  intentional placeholders.
- Empty `alt=""` on decorative images.
- The `"#"`-linked "Vocal & Instrumental Training Frameworks" deliverable in the
  Blueprint. The `link:"#"` data value is retained (no page exists yet), but its
  rendering was changed from an `href="#"` "Link pending" control to the same
  non-clickable "Coming Soon" state as the other unfinished deliverables
  (Pass 1.1; see CHANGELOG.md / QA-REPORT.md). No data or content was deleted.
- The four pending deliverable routes — surfaced as "Coming Soon", not removed.

---

# REMOVED CODE — Pass 2

## Removed
### `assets/js/canonical.js` — superseded registry (deleted)
- **Removed:** the whole file.
- **Replaced by:** `assets/js/site-config.js` (content) + `assets/js/routes.js`
  (routes/availability), which together carry every value `canonical.js` held,
  each defined once. Every page's include was updated to load the two modules
  plus `site.js`.
- **Evidence safe:** grep confirms no remaining reference to `canonical.js` in
  any page; all pages expose the same `window.WX` API (verified: routes + phases
  + palette present, no JS errors, countdown renders).

### All `data:image` URIs — externalised (removed from source)
- Every embedded base64/percent-encoded image (6 rasters + decorative SVG
  textures) was decoded to a file under `assets/images/` and replaced with a
  relative reference. **Evidence safe:** before/after pixel diff is 0 on 9/10
  pages (1 antialiasing px on music-workshop); no failed requests; no broken
  images. The one `data:image` token inside a `creative-direction.html` CSS
  *comment* was reworded (it was never a real image).

### `theme-brief.html` inline `on*` handlers — replaced (not deleted blindly)
- The four accordion `onclick`/`onkeydown` attributes were removed and replaced
  by an `addEventListener` binding (click + Enter/Space) that also maintains
  `aria-expanded`. **Evidence safe:** accordion verified working by click and
  keyboard after the change.

### Blueprint `PENDING_ROUTES` / `isPendingRoute()` / `link` field — replaced
- The filename-inference helpers and the `link` field were removed in favour of
  explicit `route` + `availability` fields and an `isLiveLink()` derived from
  them. **Evidence safe:** deliverable rendering re-verified (live → anchor;
  pending page and route-less pending → non-anchor "Coming soon", no href, not
  focusable). No residual `d.link` / `PENDING_ROUTES` references remain.

## Candidates identified but NOT removed (verify before deleting)
- **Per-page countdown updaters**: now superseded at load by `site.js`, but left
  in place because they are interwoven with each page's reveal/observer scripts;
  removing them safely needs per-page scope analysis. No functional conflict
  (they set the same value site.js authoritatively re-renders).
- **theme-brief `.hero__title` CSS** (unused; carried over from Pass 1) — still a
  candidate, still not removed pending confirmation across all states.

---

# REMOVED CODE — Pass 3

## Removed / replaced (with evidence)
- **concept.html** — `tabindex="0"` removed from five non-interactive Scripture
  reference headings (`h4.ref`). Evidence safe: they are references, not controls;
  the verse tooltip still shows on hover (`.ref:hover .verse`); keyboard focus on
  a non-interactive heading was the reported defect. No selector targets the
  attribute.
- **playbook.html** — the rule `@media(max-width:560px){.site-nav__ws .txt{display:none}}`
  was replaced with compact spacing so the mobile Workspace control keeps a
  visible text label. Evidence safe: verified the "Workspace" label is visible at
  400px and the control still fits.

## Named (not removed)
- **blueprint.html** — the dynamically-populated drawer heading
  (`#drawerTitle`) was given an initial name "Task detail" (was empty in static
  markup); JS overwrites it on open. Not deleted — it is a live target.

## Not removed (verified in use)
- Playbook per-page reveal/observer scripts and the empty JS-populated headings
  in playbook/music-workshop (`#pd-title`, `#prog-name`) remain — they are filled
  at runtime and are not static empty headings.
- No dead-code deletions were performed in Pass 3 (an editorial pass); verified
  dead-code removal remains a code-health-pass item.


---

# REMOVED CODE — Pass 4

Pass 4 is additive accessibility hardening; it removed no page markup or data.
Changes were shared-CSS/JS additions plus attribute additions:
- Added `tabindex="-1"` to each `<main>` (skip-link focus target), `id` where
  missing, and visible-on-focus skip links to the five pages that lacked one.
- Named the previously-empty JS-populated headings (creative-direction mood/phase
  titles, playbook drawer title, music-workshop pillar/progression titles).
- **Reverted** the intrinsic `width`/`height` image attributes trialled early in
  this pass: on CSS-constrained / object-fit images (e.g. `flow-logo.png` in
  plates) they changed the rendered aspect ratio. Evidence: `flow-logo` rendered
  282×113 before and 282×230 with the attributes — a regression — so the
  attributes were removed. A per-image `aspect-ratio` audit is left for a future
  targeted pass (no CLS regression versus the Pass 3 baseline).
- No selectors, functions or assets were deleted.

---

# REMOVED CODE — Pass 5

Behaviour repairs only; no page markup, content or data removed.
- **Replaced** the `scrollTo`/`scrollBy` wrapper body in `assets/js/site.js` (the
  arity-losing `orig.call(this, a, b)` form) with an arguments-preserving version.
  Evidence it was unsafe: `window.scrollTo({top:500,behavior:'smooth'})` returned
  scrollY 0 with the old code and 500 with the new code.
- **Replaced** `html { scroll-padding-top: 4.75rem }` in `assets/css/base.css` with
  scoped `:target { scroll-margin-top: 3.25rem }` + `#hub:target { scroll-margin-top: 0 }`.
  Evidence: index `#hub` landed at y-top 76 (cut off) before, 0 after.

---

# REMOVED CODE — Pass 6

## Removed / replaced (with evidence)
- **`assets/js/site.js`** — removed the global prototype override of
  `Element.prototype.scrollTo/scrollBy/scrollIntoView` and `window.scrollTo/scrollBy`
  (added in Pass 4). Replaced by call-site use of `window.WX.smoothBehavior()`
  (defined in `site-config.js`). Evidence safe: all scroll interactions re-verified
  in normal and reduced-motion modes; no native method is intercepted; 0 JS errors.

## Not removed (verified live, kept)
- **Raster originals** (PNG/JPEG) — retained on disk as `<picture>`/`image-set`
  fallbacks alongside the new WebP files. Not deleted.
- **~18 large "unreferenced" images** — confirmed referenced *dynamically* via JS
  `IMG` arrays (creative-direction / concept). Kept.
- **Print/export and dynamically-generated classes** — treated as live; not removed.
- Only `media-03.png` (35 KB) is genuinely unreferenced; left in place pending the
  dead-code pass (below the effort/risk threshold to remove alone).

## Deferred (needs runtime coverage before deletion — not removed here)
Creative Direction duplicate/legacy layers; Playbook legacy dashboard/MM CSS and
unused functions; Bible Study bridge/distance/glance families; Setlist old
cue/governance families. Each requires exercising every tab/overlay/filter/export
state under coverage first; recorded for the dedicated dead-code pass.

---

## Pass 6.1 — removed / replaced code

**1. Setlist TFArrow `font-display: swap` → `optional` (replaced).**
The five self-hosted TFArrow `@font-face` rules in `setlist.html` were declared
`font-display:swap`. Swap caused a first-paint→web-font reflow that un-wrapped
the door's `.cues--row` and shifted the centred `.door-shell` (~0.196 CLS at
390 px). The `swap` descriptor was **replaced** with `optional` on all five
rules. Nothing else in the font stack changed. Rationale and evidence:
CHANGELOG.md → Pass 6.1 (C).

**2. Creative-Direction segment `IMG` map raster paths → WebP (replaced).**
In `creative-direction.html` the JS `IMG={…}` map (VI/mood segment plates) held
24 `.jpg` values that loaded original rasters on segment open. Those values were
**replaced** with their `.webp` equivalents (the 10 `.mp4` motion entries were
left unchanged). A capture-phase `error` listener was **added** just after
`<body>` to retry any failed WebP once with its `.jpg` original. The original
`.jpg` files remain on disk as fallbacks — **none were deleted**.

**3. Reverted mid-pass experiment (no net change).** A Georgia metric-fallback
`@font-face` pair (`Cinzel-fallback`, `EBGaramond-fallback`) and the associated
`--display`/`--serif` edits were trialled while diagnosing the shift, found not
to address it (the shift was TFArrow, not the Google serifs), and **reverted**.
`--display:'Cinzel',serif` and `--serif:'EB Garamond',Georgia,serif` are back to
their Pass 5 values. Recorded here only for audit completeness.

---

## Pass 7 — moved / replaced code (no content deleted)

No lyric text, title, artist, order, translation, arrangement note, medley
structure or placeholder was deleted. Data was **relocated to a single source**
and page-local copies were replaced with adapters that reproduce the originals.

**1. Duplicated catalogue + phase data → shared modules.**
- `setlist.html` `SETLIST_ITEMS` / `SETLIST_PHASES` and the shared fields of
  `ROADMAP_PHASES`, and `lyrics.html` `LYRIC_ITEMS` / `LYRIC_PHASES`, each held
  their own copy of the 28-item catalogue metadata and the four phases. These
  literals were **removed** and replaced by:
  - `assets/js/wx-music-data.js` — `WX_PHASES`, `WX_CATALOGUE` (single source).
  - `assets/js/wx-lyrics-data.js` — `WX_LYRICS` (lyric text, moved verbatim).
- Each page now derives its arrays from the shared data via small adapters.
  Evidence of safety: an automated reconstruction test rebuilt the original
  `LYRIC_ITEMS` and `SETLIST_ITEMS` from the shared modules and compared them
  field-by-field — **0 mismatches** (the only intended differences are the two
  documented reconciliations). A before/after DOM render diff of both pages
  showed a single intended change (Phase IV summary line).

**2. `lyrics.html` blank-print rule (replaced).**
- `@media print{body{visibility:hidden}}` — which made native Ctrl+P print an
  empty page — was **removed** and replaced with a purposeful print stylesheet
  plus a `beforeprint`/`afterprint` details-expander. Evidence it was unsafe to
  keep: print-media emulation produced a blank body; after the change, all 28
  items and their full lyric text render.

**3. Stale end-of-file comment (removed).** The lyrics comment describing the old
"hide body via @media print" approach was removed with that rule.

Nothing else was deleted in Pass 7. No dead-code sweep, no CSS redesign, and no
Blueprint/Playbook data separation were performed (out of scope).

---

## Pass 7.1 — removed / replaced export code

**1. Popup print path (setlist.html, lyrics.html) — replaced.** The shared
`window.open('','_blank')` + `document.write()` + `w.print()` block (the non-Word
branch of the export action) was **removed** and replaced by a call to the new
shared `WXExport.printDocument()` engine (isolated iframe). Evidence it was
unsafe: under a real Chromium print pathway the old code left orphan popups open
(2 after 3 prints) and, on dialog cancel, wedged the live page; the new path
leaves 0 popups and the page stays fully interactive.

**2. Playbook parent-`window.print()` path — replaced.** `printMinistry()`
previously built `#printDoc` in the live page and called `window.print()`,
relying on `@media print{ body>*{display:none} }`. The button now builds a
standalone document and prints it via `WXExport`. The `@media print` block is
retained only as a fallback for a manual native Ctrl+P, now guarded by a
`beforeprint` builder so it can never print blank.

**3. Nothing else removed.** No content, data, lyric text, styling of the live
pages, or Word-export path was changed. New file added:
`assets/js/wx-export.js` (the shared engine).

---

## Pass 8 — removed / replaced code

**1. blueprint.html — invalid nested `<picture>` (replaced).** The hero markup
had a `<picture>` nested inside a `<picture>` (a Pass 6 webp-conversion
artifact — invalid HTML). Replaced with one valid `<picture>` whose children are
the mobile `<source media>`, the WebP `<source>` and the PNG `<img>` fallback.
Evidence safe: nested `<picture>` is not permitted content (html-validate
`element-permitted-content`); after the fix the desktop hero serves
`blueprint-hero-desktop.webp` with the PNG fallback and renders identically.

**2. creative-direction.html — lightbox `<img src="">` (replaced).** The empty
`src` attribute (which makes some browsers re-request the page) was removed; the
image element is populated by JS (`lbimg.src = …`) from the clicked cell before
the initially-hidden lightbox is shown. An inline `html-validate` directive
documents that the src is set at runtime.

**3. playbook.html — added `inert` to the hidden floating bar (additive fix).**
No code removed; the `#floatbar` gained the `inert` attribute (static + JS
toggle) so its buttons are not keyboard-focusable while the bar is off-view.

No content, lyric data, styling of visible content, or export behaviour was
removed in Pass 8. New files added: `404.html`, `assets/favicon.svg`,
`assets/apple-touch-icon.png`, `tools/*`, `package.json`, dev configs,
`.github/workflows/ci.yml`, `README.md`, `VERSION`.

---

## Pass 9 — removed / replaced (accessibility repairs)

1. **setlist.html** — removed `role="tablist"` from `<nav id="setRail">`.
   Evidence safe: axe `aria-required-children` (critical) — a tablist may only
   contain `role="tab"` children, but these are `aria-current` navigation
   buttons; the `<nav aria-label>` landmark is the correct semantics and the
   arrow-key handler is unaffected.
2. **playbook.html** — `#selector` `role="list"` → `role="group"`; removed
   `role="listitem"` from its ministry buttons (JS). Evidence safe: axe
   `aria-required-children` (critical) — the grid-centred `aria-live` node is not
   a `listitem` and cannot leave the DOM (`grid-area:centre`); a labelled group of
   buttons is valid and the selector still builds 10 operable items.
3. No content, lyric data, or visible layout was removed. Colour-token values
   (`--ink-faint`, `--crimson-bright`) were adjusted for AA contrast, not removed.
