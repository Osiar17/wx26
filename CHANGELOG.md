# WX 2026 — CHANGELOG (Pass 1)

Pass 1 scope: source-of-truth canonical content, broken routes, missing local
references, availability states, and the two confirmed mobile layout blockers.
This is a controlled consolidation and repair, not a redesign. No page
composition, atmosphere, lyric text, arrangement instruction, song order,
title, credit or intentional placeholder was altered. A broad architecture
rewrite and the base64 asset externalisation were deliberately **not** performed
in this pass (see QA-REPORT.md → Deferred to a later pass).

---

## Pass 1.1 — follow-up corrections (blueprint.html only)

Two targeted Blueprint fixes; no Pass 2 architecture or asset work performed.

- **Worship Roadmap route.** The deliverable pointed at `setlist.html#roadmap`,
  an anchor that does not exist in `setlist.html`. Repaired to the existing
  canonical anchor **`setlist.html#roadmap-intro`** (the `id` on the Worship
  Roadmap section). Verified in-browser: activating it loads `setlist.html` and
  scrolls the Worship Roadmap section to the top of the viewport.
- **Vocal & Instrumental Training Frameworks — unified Coming Soon state.** This
  deliverable used `link:"#"`, which previously rendered as an `href="#"`
  "Link pending" control (an anchor that could jump to the top). It now receives
  the **same** non-clickable "Coming Soon" treatment as the other unfinished
  deliverables: the "pending" test is now "not a live link" (covering both the
  four pending pages and the `"#"`/empty case). In the deliverable list it is a
  non-clickable `<div class="pending" aria-disabled="true">` tagged
  "Coming soon"; in the detail panel the call-to-action is now a
  `<span class="dlv-open disabled" aria-disabled="true">Coming soon</span>` —
  **no `href`**, so it cannot jump to the top, is not an active link, and (being
  a plain `<span>` with no `tabindex`) is not in the tab order.

---

## Site-wide

### New — Canonical registry
- Added `assets/js/canonical.js`, a single shared source of truth exposing
  `window.WX` (theme, four phase names + subtitles, event date
  `Sunday, 29 November 2026`, Wildflower Purple `#7A4CB8`, parent ministry
  `The Flow Experience`, preserved line, Wade-In dimensions, canonical routes,
  and the list of not-yet-built "pending" routes with an `isPending()` helper).
- Linked the registry from every page (`<script src="assets/js/canonical.js">`,
  relative / repository-subpath-safe) so future edits read one authority.

### Brand — Wildflower Purple (canonical #7A4CB8)
Five pages defined "Wildflower Purple" as `#8E6E9E`, a different, muted mauve.
Corrected to the canonical `#7A4CB8` (and the matching RGB tuple
`142,110,158` → `122,76,184`) in:
- `lyrics.html` (`--wildflower-purple`)
- `setlist.html` (`--wildflower-purple`)
- `playbook.html` (`--purple`, `--purple-rgb`)
- `blueprint.html` (`--purple`, `--purple-rgb`, and one inline data colour)
- `music-workshop.html` (`--purple`)

This is a deliberate, visible brand correction mandated by the canonical
instruction; layouts are unaffected (see QA-REPORT.md).

---

## index.html
- No content deviations found. Event-date logic already resolves to
  29 November 2026 and the accent colour was already `#7A4CB8`. Registry linked.

## concept.html — *Mobile layout blocker (fixed)*
- **Content quality:** none required — canonical strings already correct.
- **Layout — history/documentary carousel horizontal overflow.** The carousel
  lives in a CSS grid item (`.hist-main`) whose default `min-width:auto` refused
  to shrink below the intrinsic width of the full card row, so the `.car-track`
  `overflow-x:auto` scroller never engaged and the **document** stretched to
  ~6,900px at 320–430px. Added `min-width:0` to `.hist-main` and
  `min-width:0; max-width:100%` to `.carousel`. The horizontal scroll is now
  fully contained inside the intended component; document width equals the
  viewport at 320 / 360 / 390 / 430px (measured 0 overflow).

## creative-direction.html
- **Phase subtitles (canonical):**
  - Phase I `The Threshold of Trust` → `The Threshold of Goodness` (2 places:
    the eyebrow map and the phase-data object).
  - Phase III `The Cup of Surrender` → `The Will Laid Down` (eyebrow map) and
    `A Will Laid Down` → `The Will Laid Down` (phase-data object).
- **Routing — deep links + Back/Forward:** the workspace wheel segments
  (`#story`, `#elements`, `#mood`, `#identity`, `#musical`) previously activated
  only on click and never touched the URL. Added hash routing: a valid hash on
  load activates the matching panel (so `creative-direction.html#musical` opens
  the Musical Identity segment directly), navigation writes the hash, and
  `hashchange` / `popstate` listeners make the browser Back/Forward buttons move
  between segments and back to the home wheel. Behaviour verified in-browser.

## theme-brief.html — *Mobile layout blocker (fixed)*
- **Layout — hero band title clipped.** The top band `<h1>Our WX 26 Theme</h1>`
  used `white-space:nowrap` inside an `overflow:hidden` band, so at 320px it was
  cut to "OUR WX 26 THE". Added a `≤560px` rule allowing the title to wrap
  (`white-space:normal; text-wrap:balance`) with a slightly reduced clamp so the
  full title is visible and intentionally wrapped at 320 / 360 / 390 / 430px.
- **Phase content (canonical):**
  - `The Threshold of Trust` → `The Threshold of Goodness`.
  - `A Will Laid Down` → `The Will Laid Down`.
  - `God is Good` → `God Is Good`; `God is Glorified` → `God Is Glorified`.
- **Alt text (informative image):** footer YES mark alt
  `YES — Not my will, but Yours` → `YES: Not My Will, But Yours` (fixes the
  lower-case theme phrase and aligns to the canonical theme string).

## setlist.html
- **Route repair — Musical Identity.** `href="musical-identity.html"` (a page
  that does not exist) → `creative-direction.html#musical`; the JS constant
  `MUSICAL_IDENTITY_URL` now reads `window.WX.routes.musicalIdentity` with the
  same value as a hard fallback. Both the static link and the JS-injected
  Roadmap link now resolve.
- **Phase subtitle (canonical):** Phase I `The Ground of Goodness` →
  `The Threshold of Goodness`.

## lyrics.html
- **Theme string (canonical):** cover line `Yes — Not My Will, But Yours` →
  `YES: Not My Will, But Yours`.
- **Brand purple** corrected (see site-wide). Lyric text, order, translations
  and arrangement notes were **not** touched.

## playbook.html
- **Route repair — Blueprint tile.** The Flow Experience tile redirected to
  `WX_2026_Blueprint.html` (nonexistent). `BLUEPRINT_HREF` now reads
  `window.WX.routes.blueprint` with a `blueprint.html` fallback.
- **Setlist (one word):** two deliverable-dependency strings `(Set List)` /
  `(Set List frozen September 20)` → `(Setlist)` / `(Setlist frozen …)`.
- **Brand purple** corrected (see site-wide).

## blueprint.html
- **Route repair — Theme Brief.** Deliverable link `themebrief.html` →
  `theme-brief.html` (the file that exists).
- **Availability — Coming Soon states.** Four not-yet-built deliverable pages
  (`flow-map.html`, `production-cue.html`, `running-order.html`,
  `experience-report.html`) previously rendered as active links to missing
  files. Added a `PENDING_ROUTES` list (from the registry) and `isLiveLink()` /
  `isPendingRoute()` helpers. These deliverables now render as non-clickable,
  clearly-marked "Coming soon" states in both the deliverable mini-list and the
  detail panel (CTA reads "Coming soon", `aria-disabled`, removed from tab
  order). All other deliverable links remain live.
- **Brand purple** corrected (see site-wide).

## music-workshop.html
- **Wade-In dimensions (canonical):** the summary line listed the three
  dimensions as "the Christian, the Musician, and the **Minister**". Corrected
  the third to "the **Performer**", matching the triad nodes and the canonical
  rule. "The minister" is retained where it describes the integrated whole.
- **Brand purple** corrected (see site-wide).

## bible-study.html
- **Missing local reference removed.** `.recog__img` layered a background
  `url("assets/calibrate-reading-night.jpg")` that is not packaged. No valid
  replacement was unambiguously intended, so the `url()` layer was removed,
  leaving the existing radial-gradient + colour field so the section keeps its
  atmosphere with no broken request.

## READ ME FIRST.txt
- Updated the "What's inside" note: Setlist and Lyric Book are described as
  authoritative working files (not placeholders), the canonical registry is
  listed, and the in-development pages are described as marked "Coming Soon"
  states inside the Blueprint.

---

## Preserved exactly (verified unchanged)
- Theme wording, all lyric text, song order, arrangement notes, credits.
- The line "So the only surprise is how God shows up." (playbook.html).
- Empty `alt=""` on decorative images.
- Event date "Sunday, 29 November 2026"; all milestone / rehearsal / historical
  dates left intact (they are not the event date).

---

# WX 2026 — CHANGELOG (Pass 2 — Shared foundation & image externalisation)

Pass 2 builds a conservative shared static-site foundation and externalises all
embedded images, with **no page redesign**. Desktop before/after screenshots of
all ten pages show 0 changed pixels (fuzz 3%) except a single antialiasing pixel
on music-workshop. All Pass 1 / 1.1 repairs are preserved unchanged.

## Image externalisation (asset rule)
- Removed **every** `data:image` URI from the source. Final source contains none.
- Decoded and externalised into `assets/images/`:
  - Rasters: `index-garden.jpg` (index hero field), and theme-brief photos
    `theme-brief-color.jpg`, `theme-brief-slide-1.jpg`, `theme-brief-slide-2.jpg`,
    `theme-brief-slide-3.webp`, `theme-brief-slide-4.jpg`.
  - Decorative SVG textures (feTurbulence noise/grain): `texture-180.svg`
    (shared by bible-study, blueprint, concept, index, music-workshop, playbook),
    `texture-160.svg` (shared by lyrics, setlist), `texture-160-2.svg`
    (theme-brief), `texture-1.svg` / `texture-1-2.svg` (music-workshop patterns).
    Identical textures were de-duplicated to a single shared file (drift reduction).
  - Every embedded image was replaced with a repository-relative reference; crop,
    sizing, overlay, blend mode and opacity are unchanged (all live in the
    surrounding CSS, which was not touched). Ordinary CSS gradients remain CSS.
- `creative-direction.html`: the `.frame-bg` note contained a literal
  `data:image/jpeg;base64,...` placeholder **inside a CSS comment** (an authoring
  note, not a real image). Reworded to reference a relative `assets/images/…`
  path so no `data:image` token remains; rendering is unaffected.

## Shared foundation (added; page-specific styling kept page-local)
- `assets/css/tokens.css` — canonical `--wx-*` design tokens (palette incl.
  Wildflower Purple `#7A4CB8`, phase colours, gold, type stacks, spacing, radii,
  shadows, z-index, motion, breakpoints). One authoritative definition, available
  site-wide; consumed by the shared components.
- `assets/css/base.css` — additive accessibility utilities only
  (`.wx-visually-hidden`, `.wx-skip-link`, reduced-motion safeguard). Does **not**
  re-declare `body`/global resets, to avoid regressions.
- `assets/css/components.css` — shared component behaviour that reduces drift:
  the header countdown narrow-screen fix and a shared `.wx-coming-soon` status
  utility. Loaded after page styles so the shared responsive fix applies.
- `assets/js/site-config.js` — content source of truth (theme, phases, palette,
  event date, labels, Wade-In). Replaces the content half of the old
  `canonical.js`.
- `assets/js/routes.js` — route source of truth (named routes, Creative Direction
  segments, pending routes, `isPending`). Replaces the route half of `canonical.js`.
- `assets/js/site.js` — shared global behaviour (the header day-countdown),
  bound with `addEventListener` / `DOMContentLoaded`, loaded with `defer`, and
  reading the canonical date from `site-config.js`. It authoritatively renders
  `.cd-num` on load, so the countdown is single-sourced from `site-config.js`.
- `assets/js/canonical.js` — **removed** (superseded by site-config.js + routes.js;
  see REMOVED-CODE.md). Every page now loads the split modules. No competing
  registry; each canonical value has a single authoritative definition.

## Shared header countdown — centralisation + 320–340px fix
- The day countdown behaviour is centralised in `site.js` (the per-page updaters
  now write the same value and are superseded at load by `site.js`).
- Narrow-screen fix (`components.css`, ≤360px): the countdown becomes a normal
  in-flow flex item in the shared space-between header bar, so it can no longer
  sit under the logo or crowd the Workspace control. Only the day number shows;
  the countdown is preserved across all mobile sizes (not removed). The shared
  Workspace control is slightly compacted so all three header items fit.
  Verified: no logo/Workspace overlap at 320 and 340px on every header layout.

## Google Fonts
- Encoded the query-string ampersands in the Google Fonts `<link>` as `&amp;`
  on all pages (valid HTML). Google Fonts retained as an accepted hosted-site
  dependency; not replaced with local copies.

## Blueprint — deliverable data model normalised
- Replaced `link:"#"` and filename-based availability inference with explicit
  fields on every deliverable: `route` (a valid relative URL, or `null`) and
  `availability` (`"live"` | `"pending"`).
  - Live deliverables: `availability:"live"` + relative route.
  - Four planned-but-absent pages (Flow Map, Production Cue Book, D-Day Running
    Order, Post-Experience Report): `availability:"pending"` + their route.
  - Vocal & Instrumental Training Frameworks: `route:null, availability:"pending"`.
- Rendering now derives state from `availability`/`route`
  (`isLiveLink = availability==="live" && route`). Pending deliverables never
  render as anchors, never use `"#"`, and never enter the tab order — the detail
  CTA is a non-anchor `<span>Coming soon</span>`.

## Inline handlers → addEventListener; script loading
- `theme-brief.html`: the four theme-point accordions had inline
  `onclick`/`onkeydown`. Replaced with a single `addEventListener` binding
  (click + Enter/Space), adding `aria-expanded` state. No inline `on*` handlers
  remain anywhere in the site.
- Shared config scripts are tiny and load in `<head>` before body scripts (so
  `window.WX` is available); `site.js` uses `defer`; page scripts remain at
  end-of-body (non-render-blocking).

## Deferred (recorded, not done in Pass 2 — see QA-REPORT.md)
- Full extraction of each page's bespoke CSS into the shared stylesheets, and
  splitting the large Blueprint/Playbook/Setlist-Lyrics data arrays into separate
  data modules. These carry real regression risk against the 10 bespoke pages for
  limited visible benefit; per the brief's "less invasive implementation" guidance
  they are deferred to a focused follow-up. The shared token/config/route/behaviour
  layer is in place so that follow-up can proceed incrementally.

---

# WX 2026 — CHANGELOG (Pass 3 — Editorial, UX & semantic structure)

Page-by-page editorial, accessibility and semantic-structure remediation.
Content and visual identity preserved: desktop before/after screenshots are
pixel-identical except where copy was intentionally edited (text-driven reflow
only; no layout regressions). All Pass 1 / 1.1 / 2 work is preserved — no
`data:image`, `canonical.js` not recreated, the shared css/js foundation intact.
HTML parses with 0 messages on all ten pages.

## index.html (Workspace hub) — quality: accessibility, editorial
- Added a meaningful `<h1>` ("Worship Experience 2026 — Workspace", visually
  hidden to preserve the clean gateway composition), a visible-on-focus skip link
  (`.wx-skip-link` → `#main`), `id="main"` on `<main>`, and a `<nav aria-label="Workspace sections">`
  landmark around the workspace launcher grid.
- Renamed the odd tile label "Ministries WX Playbook" → **"Ministries Playbook"**
  (the consistent ecosystem form).
- Availability states verified consistent with `routes.js` (the four pending
  routes surface as "Soon"; live pages are linked). Left the tile markup as-is —
  it already matches the manifest — rather than add a data-binding rewrite.

## concept.html — quality: accessibility, editorial
- Removed `tabindex="0"` from the five non-interactive Scripture reference
  headings (`h4.ref`) per the non-interactive interpretation.
- Regularised the pastor reference: "our pastor, Ps Sammy Aduama" → "our pastor,
  **Ps. Sammy Aduama**".
- Toned an abrupt casual caption: "with all its weird parts!" → "with all its
  **unusual parts.**" Retained "Dreeaaaam!" as a deliberate stylistic echo of the
  2023 **DREAM** edition (it sits in a distinct statement card — intentional
  oral-history voice).
- Timeline: one semantic source confirmed; the JS loop-clone already carries
  `aria-hidden="true"`, so no duplicate is read by assistive tech (no change needed).

## creative-direction.html — quality: semantic structure, accessibility, theology
- **Semantic order:** moved the `#home` block (the sole `<h1>` "The Gethsemane
  Experience" + introduction) ahead of `<main>` in the DOM, so the H1 and intro
  come first for assistive tech on both desktop and mobile. `.home` is
  position-fixed, so the visual result is unchanged (verified pixel-identical);
  the page still opens at the same home entry point on all widths.
- **Native controls:** added `role="button"` to the three flip-cards (they
  already had `tabindex`, `aria-label` and keyboard handlers). The `.vi-card` /
  `.seg` controls already expose complete button ARIA; full element conversion
  was not forced, to avoid regressing the 3-D flip and SVG-wheel visuals.
- **Theology / grammar corrections:**
  - "…the Father's will was death." → "He faced the full cost of obedience, which
    required Him to die, yet He freely yielded His will to the Father."
  - "His loneliness deepen" → "His loneliness **deepens**".
  - "His sweat turns to blood." → "His sweat **falls like drops of blood.**"
  - "…forcing Him into ultimate agony." → "…**strengthening Him to continue
    through the agony before Him.**"
  - "resolved still to drink to the very last drop." → "**still resolved to drink
    it,** to the very last drop."
  - "Three faces, each with a jurisdiction. No fourth is admitted. The YES
    wordmark signs · …" → "**Three typefaces, plus the locked YES wordmark.**
    Each has a jurisdiction, and no fourth is admitted. TFArrow speaks · …"
  - "Texture and surface can always add depth and atmosphere but it must not…" →
    "Texture and surface **can add depth and atmosphere, but** it must not…"
- Wildflower Purple confirmed `#7A4CB8` (swatch unchanged). All five segment
  hashes (#story #elements #mood #identity #musical) still deep-link and support
  Back/Forward (re-verified).

## theme-brief.html — quality: semantic structure, editorial
- **One header, one main:** the page now has a single `<header>` (the title band
  carrying the `<h1>`); the former second `<header class="hero">` is a
  `<section>`, and all content is wrapped in a single `<main id="main">`.
  Visually identical (verified).
- Corrections:
  - "Every WX theme creates a new experience. Never just a repeat of the songs we
    love." → "**Every Worship Experience theme creates a new experience; it is
    never merely a repeat of the previous year.**"
  - Corinth/Apollos: "…church in Corinth, who had been arguing over who they were
    following." → "…church in Corinth, **where believers had been arguing over
    whether it was he or Apollos who was their true leader.**"
  - Joseph: "…owned none of it, even after much profit." → "…owned none of it,
    **even while administering great wealth and increase.**"
  - "We begin with songs on who God is — GOOD!." → "**We begin with songs about
    who God is: good.**"
  - "Not my will, But His will Be Done." → "**Not my will, but His will be done.**"

## bible-study.html — quality: editorial
- Preserved the approved opening verbatim.
- "…not only in ministry, but in every sphere of life…" → "…**not only for
  ministry but also for every sphere of life…**"
- "…the instrument Calibrate returns to every time it opens the Word." → "…the
  **framework Calibrate returns to whenever we open the Word.**"
- "Flight or Surrendered" → **"Flight or Surrender"** (3 places: route rail,
  monthly progression, session data).
- No empty/future headings and no invalid image references remain (verified).

## blueprint.html — quality: editorial, casing
- "The WX Blueprint gathers all The Flow Experience's work…" → "**The WX 2026
  Blueprint gathers all of The Flow Experience's work…**"
- Casing standardised: "Set List" / "set list" → **"Setlist"** (31); "all
  Members" → "all members"; "Sound Equipment rental" / "sound equipment rental" →
  "sound-equipment rental"; "Moodboard" / "moodboard" → "mood board".
- The dynamically-populated drawer heading now has an initial name ("Task detail")
  so no empty heading ships in static markup.
- Ownership, status, deadlines, dependencies, "Last updated" and the
  manual-maintenance disclosure remain present and prominent (unchanged).

## music-workshop.html — quality: editorial
- Dimensions already canonical (The Christian · The Musician · The Performer);
  "the minister" remains the integrated outcome (no change needed).
- "we must be formed right." → "we must be **formed rightly.**"
- "For The Flow Experience, out of Stewardship, our sub-theme builds on
  faithfulness…" → "**For The Flow Experience, our 2026 focus on stewardship
  gives Wade-In its sub-theme** — faithfulness with our will, and with our gift."
- Parallel phrase improved: "a deeper life, an intentional gift and faithful
  service." → "a deeper life, an intentional gift, and faithful service."

## playbook.html — quality: UX, accessibility, data integrity
- **Mobile Workspace control** now keeps its visible text label ("Workspace") at
  ≤560px — replaced the `.txt{display:none}` rule with compact spacing.
- **Derived ministry count:** the three visible "Nine" statements now read from
  `MINS.length` (a data-derived count word), so they can never contradict the
  number of ministry tiles (currently 9 → "Nine").
- Legacy internal codes are normalised at the display layer (`displayName()`:
  MM → "C3 Media", TFE → "The Flow Experience"); verified no raw code leaks into
  visible labels. Preserved exactly: "So the only surprise is how God shows up."

## setlist.html — quality: editorial
- Journey summary now includes dependence/help: "…from trust, **through the help
  that meets us in the dark,** into a Yes that brings God glory."
- Export cover theme normalised: "Yes — Not My Will, But Yours" → "**YES: Not My
  Will, But Yours**". Musical Identity links already resolve to
  `creative-direction.html#musical`. Musical item order/content/phase allocations
  unchanged; "Can the church carry this with us?" left intact (it already has
  surrounding context).

## lyrics.html — quality: verified, no change
- Already compliant: official phase names, theme "YES: Not My Will, But Yours",
  and purple `#7A4CB8`. The page uses "movement" descriptors by design (not phase
  subtitles). Lyric/translation content, search, item nav, Contents, phase menus,
  expansion controls, export options and intentional arrangement placeholders all
  preserved untouched.

---

# WX 2026 — CHANGELOG (Pass 4 — Responsive & accessibility hardening)

WCAG 2.2 AA hardening with no change to visual character. Every page's document
height is byte-identical to the Pass 3 baseline; before/after screenshots are 0
changed px on 7/10 pages (the rest differ only by intended inline-link hit padding
or sub-pixel noise-texture rendering). No JS errors; no horizontal overflow at
320–1920 px, 200% zoom or landscape.

## Shared foundation (assets/css/base.css, components.css, assets/js/site.js)
- **Skip links & focus:** `:focus-visible` gold outline fallback (zero-specificity,
  dark-theme safe); `scroll-padding-top` so anchor targets and focused controls
  clear the sticky header; iOS `env(safe-area-inset-*)` applied as
  `max(clamp(...), env())` so desktop padding is preserved and only extends on
  notched devices.
- **Target size:** invisible hit-area expansion — a centered transparent
  `::after`/`::before` brings pointer targets toward 44×44 with no reflow, applied
  only to controls confirmed to be in normal flow; inline reference links get
  net-zero vertical padding; native selects get `min-height:44px`. Absolutely/
  fixed-positioned icon buttons were intentionally excluded to avoid moving them.
- **Reduced motion:** the shared CSS policy (animations/transitions/scroll-behavior)
  is joined by a JS policy in `site.js` that forces `scrollIntoView`/`scrollTo`/
  `scrollBy` to `behavior:"auto"` under `prefers-reduced-motion`, so JS smooth-
  scrolling is neutralised site-wide without editing each page. `window.WX.reducedMotion()` exposed.

## Per page
- **All pages:** every `<main>` is focusable (`tabindex="-1"`); every page has a
  visible-on-focus skip link whose activation moves focus into `<main>` (verified).
- **creative-direction:** the `<h1>` "The Gethsemane Experience" + `#home`
  introduction are now the **first content inside `<main>`** (were before it);
  `.home` stays position-fixed so the visual presentation is unchanged. Mood/phase
  detail headings named. Flip cards (Enter/Space), wheel segments (Enter/Space →
  panel + hash), the element modal (focus-in, Escape, focus-return) and hash
  Back/Forward all verified by keyboard.
- **playbook / music-workshop:** empty JS-populated headings named (drawer title;
  pillar / progression titles).
- **theme-brief:** the band `<h1>` remains fully visible and does not clip at 320–430px.
- **blueprint:** task drawer verified as a full dialog (focus trap, Escape,
  focus return); view tabs expose `aria-selected`; pending deliverables show
  "Coming soon" text (not colour-alone).
- **setlist / lyrics:** sticky navigation wraps without covering content; inline
  Musical-Identity/Contents links given larger hit areas; lyric/translation
  content and all controls (search, item nav, Contents, phase menus, expansion,
  export) preserved.

---

# WX 2026 — CHANGELOG (Pass 5 — Interaction regression repair)

A full interaction inventory + stateful regression sweep of all ten pages (105
control families + dynamic journeys). Two Pass 4 shared changes had introduced
user-visible navigation regressions; both are repaired with **scoped** fixes and
no change to page composition (before/after visual diff 0 on 9/10 pages).

## assets/js/site.js — reduced-motion scroll wrapper (bug fix)
The wrapper forwarded `scrollTo`/`scrollBy` as `orig.call(this, a, b)` with
`b === undefined`; a trailing `undefined` makes the browser choose the numeric
`(x, y)` overload and coerce an options object to `NaN`, silently cancelling the
scroll. Rewritten to forward `arguments` verbatim on the normal path and only
substitute a reduced-motion options object otherwise (preserving argument arity).
This repairs: **playbook** "Find Your Ministry" and the **Overview eye** (the two
reported playbook regressions), the **concept** carousel arrows, **theme-brief**
phase-journey scrolling, **creative-direction** workspace scrolling, and
**blueprint** view/task scrolling — all of which use object-form `scrollTo`.

## assets/css/base.css — anchor offset (regression fix)
Replaced global `html { scroll-padding-top: 4.75rem }` (which pushed the index
`#hub` gateway 76px down and "cut off" the at-a-glance composition) with a scoped
`:target { scroll-margin-top: 3.25rem }` plus `#hub:target { scroll-margin-top: 0 }`.
The index gateway now lands at the very top on "Enter the Workspace" and on direct
`#hub` load (desktop and mobile); section-heading anchors (e.g. setlist
`#roadmap-intro`) still clear the sticky header.

## Verification highlights
- Index "Enter the Workspace" / direct `#hub`: `#hub` top = 0 (was 76). 
- Playbook Find-Your-Ministry: chooser scrolls to just below the header (was no move).
- Playbook Overview-eye: Overview opens and scrolls into view (was bouncing back).
- Concept carousel Next: rail advances (was stuck).
- creative-direction Back/Forward + all five direct hashes: correct.
- Blueprint tabs + task drawer (focus-trap, Escape, focus-return): correct.
- All re-checked under `prefers-reduced-motion` and at 390px.

---

# WX 2026 — CHANGELOG (Pass 6 — Performance & code health, measured)

Evidence-led performance pass. Initial transfer across the ten pages dropped from
~24.5 MB to 8.4 MB (uncompressed served bytes) with no change to the visual design
(before/after page diffs 0.00–0.02%, full-resolution quality verified). All Pass 1–5
work preserved; 0 JS errors, 0 failed asset requests.

## Shared (assets/js/site-config.js, site.js) — reduced-motion de-risked
- Removed the Pass 4 global `scrollTo`/`scrollBy`/`scrollIntoView` prototype
  override. Added `WX.prefersReducedMotion()` and `WX.smoothBehavior()` to
  `site-config.js`; the 13 previously-unguarded literal `behavior:"smooth"` calls
  (creative-direction ×10, blueprint, playbook, theme-brief) now call
  `window.WX.smoothBehavior()`. No native scroll method is intercepted; every scroll
  interaction verified in normal and reduced-motion modes.

## Images (all pages) — WebP + responsive fallback + lazy loading
- Encoded all 100 referenced raster images to WebP (q80–82); **originals retained**.
  - `<img>` → `<picture><source type="image/webp" …><img … (original)></picture>`.
  - CSS `url(…)` backgrounds → `image-set(url(webp) type('image/webp'), url(original))`
    (single-quoted so it is valid inside inline `style="…"` attributes too).
- `loading="lazy"` + `decoding="async"` on hidden Creative Direction segment images
  and below-fold `<img>`; header logos and hero LCP images stay eager.
- Result: music-workshop 5.18→0.66 MB, creative-direction 5.33→1.50 MB, playbook
  2.73→0.90 MB, blueprint 2.56→0.83 MB, setlist/lyrics ~2.05→~0.6 MB, concept
  2.09→0.97 MB. Grading, shadow detail and crops preserved (no banding).
- Direct `#segment` hash entry still loads that segment's media immediately;
  Back/Forward and all five Creative Direction hashes intact.

## Not changed (safeguards)
- Intrinsic `width`/`height` NOT applied blindly — a per-image/CLS audit showed
  images sit in size-reserving containers (CLS ≤0.001 on all image pages), and
  blind intrinsic dims previously distorted a CSS-cropped logo. Reserved-space is
  already correct; dimensions deferred to a careful per-image audit.
- `route`/`availability` model, keyboard interaction, skip-link focus transfer,
  reduced-motion behaviour, Coming Soon semantics, sticky-header anchor clearance —
  all preserved.

## Deferred (documented in QA-REPORT.md)
AVIF variants; verified dead-code removal (needs runtime coverage of every state);
Blueprint/Playbook data separation; the Setlist/Lyrics shared catalogue migration
(reserved for the music-data pass). Only `media-03.png` (35 KB) is truly
unreferenced; the large "unreferenced" images are used dynamically via JS and kept.

---

## Pass 6.1 — performance measurement normalisation & Setlist layout stability

A narrow verification + Setlist-stability pass. No catalogue migration, no broad
dead-code deletion, no CSS redesign, no Blueprint/Playbook data separation.

**A. Performance record corrected.** Re-measured the Pass 5 baseline and the
Pass 6 (WebP) build under one identical protocol (local HTTP server, fresh
context per page, cache disabled, no service worker, 390×844, `load`+600 ms
milestone, no scroll/segment activation during the initial read). Earlier QA
mixed two scopes ("uncompressed served bytes" pre-scroll vs "gzip initial
transfer" post-scroll); both are superseded by the single comparable table in
**PERFORMANCE-MATRIX.md**. First-load transfer now under 1 MB on every page
(total 25.1 MB → 5.7 MB, −77.2%). No code was altered to flatter the numbers.

**B. WebP fallback verified — and one gap closed.** Confirmed a WebP-capable
browser fetches only the WebP candidate (0 originals on first load, every page).
Verified `<picture>`/`image-set()` validity, subpath-safe URLs, lazy-on-scroll,
direct CD hash entry loading its media without returning to the home wheel.
**Fix:** the Creative-Direction segment `IMG` map still pointed at 16 `.jpg`
originals that loaded on segment open; repointed the map to `.webp` and added a
capture-phase `error` fallback that retries the retained `.jpg` original once.
CD now loads WebP-only across all segments (16 → 0 originals on full open).
Originals remain on disk as fallbacks; none deleted.

**C. Setlist initial layout shift repaired (~0.196 CLS → 0.000 at 390px).**
Diagnosed the true cause (it was **not** the Google serif swap — CLS persisted
with googleapis/gstatic blocked). The self-hosted **TFArrow** label face
(`assets/*.ttf`, `font-display:swap`) painted first in the Arial-Narrow
fallback, then swapped ~230 ms in; the narrower TFArrow advance un-wrapped the
flex `.cues--row` (2 rows → 1, height 118→46 px), which collapsed the
vertically-centred `.door-shell` (722→650 px) and shifted the whole door.
**Repair:** changed the five TFArrow `@font-face` rules from
`font-display:swap` to `font-display:optional`, which deterministically removes
the mid-load swap (fallback is kept for that load if the font is not ready;
TFArrow paints immediately on warm cache). No fixed heights, no `overflow:hidden`,
no delayed visibility, no offset hacks. The ineffective Georgia serif-fallback
experiment from mid-pass was reverted (`--display`/`--serif` restored). CLS is
now **0.000** at 320/360/390/430/768/1280/1440 widths, at 200% zoom, and under
reduced motion; TFArrow still renders on warm load (presentation unchanged).

**D. Full interaction matrix re-run:** 32/32 PASS (index #hub + nav, concept
carousel, all five CD segments + Back/Forward, theme-brief scroll, playbook
ministry/task controls, blueprint views/drawer, setlist doorway/anchors/phase
pills/search/export, lyrics contents/search/item anchors/exports, reduced-motion
scrolling). Results appended to INTERACTION-MATRIX.md (Pass 5 record retained).

Routes/anchors: unchanged — ROUTE-MANIFEST.md not modified.

---

## Pass 7 — Setlist, Lyric Book and Shared Music Data

Removed the duplicated music data and made both music pages read from one
reliable catalogue, without redesigning either page or altering content.

### Shared data (new — assets/js/)
- **wx-music-data.js** — single source of truth: `WX_PHASES` (phase id, Roman
  numeral, title, subtitle, movement, summary line, handoff) and `WX_CATALOGUE`
  (the 28 items: number, phase, title, subtitle, type, artist, component
  letters/titles/artists/arrange-notes). No lyric text.
- **wx-lyrics-data.js** — `WX_LYRICS`, the lyrics-only module keyed by catalogue
  item number (sections, lines, translations, arrangement instructions,
  placeholders). Authoritative lyric content, moved verbatim from lyrics.html.

### setlist.html
- Now imports `WX_PHASES` + `WX_CATALOGUE`. `SETLIST_PHASES`, `SETLIST_ITEMS` and
  the shared fields of `ROADMAP_PHASES` are **derived** from the shared source;
  only the roadmap's coaching fields remain page-local. **Phase counts are
  derived from the catalogue** (4 · 7 · 12 · 5), never hard-coded. Rendering,
  the roadmap tablist, the phase rail, search and the zero-CLS doorway are
  unchanged (verified byte-identical except the reconciliations below).
- Added a purposeful print stylesheet so native Ctrl+P yields a clean Setlist.

### lyrics.html
- Now imports `WX_PHASES` + `WX_CATALOGUE` + `WX_LYRICS`; `LYRIC_ITEMS` is a join
  of catalogue metadata and the lyrics module. Full lyric text removed from the
  HTML (86 KB → 53 KB). Rendering, search, phase menus, prev/next, Contents and
  exports unchanged.
- **Phase subtitles added** to the phase headers and to Word/PDF/Print exports
  (The Threshold of Goodness / The Help in the Dark / The Will Laid Down / The
  Gateway to Glory) — improves consistency with the Setlist roadmap.
- **Native Ctrl+P fixed.** The page previously blanked `body` on print
  (`@media print{body{visibility:hidden}}`), so Ctrl+P produced an empty page.
  Replaced with a purposeful print stylesheet plus a `beforeprint` handler that
  opens every collapsed `<details>` (Chromium keeps closed content in
  `::details-content`, which CSS alone can't reveal) and restores them after.
  The dedicated Download/Print export (cover + contents, separate document) is
  unchanged and still available.
- Export cover **count is derived** ("28 Musical Items · Four Phases") rather
  than hard-coded.

### Content reconciliations (documented, minimal)
- **Phase IV summary line** differed between the two copies; the brief specifies
  summary lines as shared, so the canonical (Setlist) wording is now used on both
  pages. This is the only visible copy change.
- **Item 15 "Oceans"** subtitle "Where Feet May Fail" (previously only in lyrics)
  is now in the shared catalogue.
- **Item 28** keeps its two distinct, page-specific development notes (Setlist's
  "…components and exact closing sequence…"; Lyrics' "…final movement…") — these
  are per-page editorial prose, not catalogue data, so both are preserved.

### Corrections re-verified (already correct in the baseline, confirmed)
Theme "YES: Not My Will, But Yours" (with colon) everywhere incl. footers and
export covers; Phase I subtitle "The Threshold of Goodness"; Wildflower Purple
`#7A4CB8`; `data-mi` links resolve to `creative-direction.html#musical`; the
Setlist "Four phases. One movement…" line includes the help/dependence movement.

### Visibility
- Lyric Book set to **noindex, nofollow** (per-page meta + robots.txt Disallow),
  treated as an internal worship resource because it reproduces third-party
  copyrighted lyric text. The Setlist (titles/order only) stays public. See
  QA-REPORT.md → Pass 7 → Visibility for the rationale and how to reverse it.

### Preserved from Pass 1–6.1
WebP + original fallbacks; Setlist zero-CLS doorway (still 0.000 at 390px);
`font-display:optional` on TFArrow; Creative-Direction hashes + dynamic media;
Index #hub landing; Playbook/Blueprint scrolling; reduced-motion; skip links,
keyboard and focus; routes and Coming Soon states. Full interaction matrix
re-run: 39/39 PASS (appended to INTERACTION-MATRIX.md).

---

## Pass 7.1 — repair the legacy PDF/Print export engine

Release-blocking defect: on Setlist and Lyrics, activating **Print** or
**Download PDF** could freeze the live page (mouse, click, wheel, scrollbar,
Page Down, arrows, Space all dead; refresh sometimes painted only the
background). **Download Word was unaffected.** Present in the original pre-audit
files, not introduced by Pass 7.

### Root cause
Print and PDF shared one path that opened an `about:blank` popup
(`window.open('','_blank')`), wrote the export HTML with `document.write()`, and
called the popup's `print()`. The same-origin popup shares the opener's renderer;
cancelling its modal print dialog wedged the opener, and because the popup was
`document.write`n its `afterprint`/`pagehide` never fired, so orphan popups
accumulated. Word used a separate `Blob`+`<a download>` path, so it never froze.

### Fix — one safe shared engine (new `assets/js/wx-export.js`)
`WXExport.printDocument(html)` renders the standalone export document in a
hidden, offscreen, `pointer-events:none` **iframe** and prints only that iframe.
The live page is never mutated — no body replacement, no whole-body hidden, no
`pointer-events:none`, no lingering `overflow:hidden`, no overlay, no popup, and
no exclusive dependence on `afterprint`. Cleanup is a single idempotent function
fired from post-`print()`, parent `focus`, the frame's
`afterprint`/`pagehide`/`unload`, the print media query returning to false, a far
backstop, the next export call, module load (defensive startup), and `pageshow`.

- **setlist.html / lyrics.html** — Print and PDF now call `WXExport`. The old
  `window.open` popup path is removed. PDF is honestly print-to-PDF (with a
  "Choose Save as PDF" hint), not a claimed file download.
- **playbook.html** — the Print button previously called `window.print()` on the
  live page with a `body>*{display:none}` print stylesheet; it now builds its
  briefing document into an isolated iframe via `WXExport`. A `beforeprint`
  guard keeps a native Ctrl+P from ever printing blank.
- **Lyric Book native Ctrl+P** — the detail-expander is retained but hardened:
  restore now fires from four independent triggers (`afterprint`, print-media
  false, `focus`, `pageshow`), never exclusively `afterprint`.
- **Download Word** — unchanged on both pages (still the Blob download).

### Verification
Real Chromium print pathway (`--kiosk-printing`, headed/Xvfb) plus the real
export code path: after a real print the parent stays fully usable (wheel, TOC
navigation, search, prev/next all respond; `pointer-events:auto`, body visible,
real `elementFromPoint`, `matchMedia('print')` false, 0 popups, 0 leftover
frames). OLD build left 2 orphan popups; NEW leaves 0. 12/12 acceptance
scenarios parent-safe (baseline, after search, after phase select, at item
anchor, details open, reduced motion, both pages). Content unchanged vs Pass 7
(0 diffs). Full interaction matrix 39/39; 0 JS errors / 0 failed requests across
all ten pages. See EXPORT-LIFECYCLE-MATRIX.md.

---

## Pass 8 — GitHub Pages, metadata, documentation & automated checks

### Deployment (all pages)
- Confirmed **repository-subpath-safe**: every `href`/`src`/`url()` is relative,
  with no leading-slash or absolute-origin reference (enforced by
  `tools/audit.mjs`). Case-sensitive filename/link matching verified.
- Added **`404.html`** — a branded not-found page that resolves its links to the
  deployment base at runtime, so it works from a subpath as well as the root.
- Added `.github/workflows/ci.yml` (audit → validate → smoke → Pages deploy on
  `main`) and `.gitignore`.

### Metadata (all pages)
- Added `assets/favicon.svg` + `assets/apple-touch-icon.png` (brand mark),
  `theme-color` `#0A0E1A`, and an unobtrusive `generator` version meta to every
  page. Added concise, unique **meta descriptions** to the six pages that lacked
  them (index, concept, creative-direction, theme-brief, setlist, lyrics).
- **Robots policy** (per-page `meta` + `robots.txt`): public — index, concept,
  theme-brief, setlist, music-workshop, bible-study; **noindex** —
  creative-direction, blueprint, playbook (operational/internal) and lyrics
  (copyright). Open Graph/Twitter/canonical intentionally omitted until the
  production URL and public-visibility decisions are known.

### blueprint.html
- **Fixed an invalid nested `<picture>`** in the hero (a Pass 6 webp-conversion
  artifact): `<picture><source><picture>…</picture></picture>` flattened to a
  single valid `<picture>` with the mobile media source, the WebP source and the
  PNG fallback as direct children. The desktop hero now correctly serves WebP.

### creative-direction.html
- Mood-board **lightbox `<img src="">`** (empty src triggers a spurious request)
  replaced with a JS-populated `<img>` (src is set from the clicked cell before
  the hidden lightbox is shown).

### playbook.html
- The floating action bar (`#floatbar`) is `aria-hidden` when off-view but its
  buttons remained keyboard-focusable. Added the **`inert`** attribute (static +
  JS toggle alongside `aria-hidden`) so the hidden bar is removed from both the
  tab order and the accessibility tree, and restored when shown.

### Tooling & docs (dev-only; no runtime dependency)
- `tools/audit.mjs` (dependency-free structural audit), `tools/serve.mjs` (local
  static server), `tools/smoke.spec.mjs` (Playwright desktop+mobile smoke),
  `package.json` scripts, and `.htmlvalidate.json` / `.prettierrc.json` /
  `.prettierignore` / `eslint.config.mjs` / `playwright.config.mjs`.
- Rewrote **README.md** to match the package (route map, deployment, fonts,
  visibility policy, shared data, asset conventions, adding deliverables,
  Setlist↔Lyrics data sharing, print/export limits, commands, version, known
  future files). Added **VERSION** and `WX.version = "2026.8.0"` in site-config.

### Verification
`tools/audit.mjs`: 0 errors / 0 warnings. `html-validate`: pass. `prettier
--check` and `eslint`: pass. **Playwright smoke: 24/24 pass** (all pages load
clean desktop+mobile, metadata present, setlist/lyrics 28 items, lyrics noindex,
export leaves the page interactive, 404 renders). Full interaction matrix and
0-JS-error/0-failed-request sweep unchanged.

---

## Pass 9 — independent final QA, regression review & release (v2026.9.0)

Independent re-audit of the release candidate; only confirmed defects repaired.

### Accessibility (from an axe-core WCAG 2 A/AA scan)
- **setlist.html** — removed the invalid `role="tablist"` from the `#setRail`
  phase scroll-nav (its children are `aria-current` nav buttons, not tabs); it is
  now a correctly-labelled `<nav>`. (critical ARIA fix)
- **playbook.html** — `#selector` changed from `role="list"` to `role="group"`
  and the ministry buttons no longer carry `role="listitem"` (the grid-centred
  `aria-live` "YES" node made the list invalid). (critical ARIA fix)
- **concept.html** — the history carousel `#histTrack` is now keyboard-focusable
  (`tabindex="0"` + group label); the conversation panels are non-scrollable when
  closed and become focusable only while open (script-managed), removing the
  scrollable-region-without-focus finding without adding hidden tab stops.
- **Contrast (AA)** — faint metadata `--ink-faint` raised `.44`→`.55`
  (≈3.67→≈5.1:1) on blueprint and playbook (150+ nodes); the "late" state numeral
  `--crimson-bright` `#b0535f`→`#bf6470` (≈3.8→≈4.7:1). Design tier preserved.
- Post-repair: axe **0 critical / 0 serious** across all 10 pages.

### Packaging
- Restored the retained `.jpg`/`.png` `<picture>` fallbacks that were missing from
  the uploaded core, so the release is complete (WebP-capable browsers still fetch
  WebP only).
- Version bumped to **v2026.9.0** (`WX.version`, `VERSION`, `package.json`, page
  `generator` meta).

### Verification (evidence in FINAL-QA-REPORT.md)
Subpath serving; `html-validate` pass; audit 0/0; canonical + catalogue-parity
checks; 320–1920 px with 0 horizontal overflow; deep links/Back-Forward;
keyboard/zoom/reduced-motion; export engine parent-safety + Word downloads; real
performance measurements (all pages <1 MB first-load, CLS ≤0.0009); 0 JS errors /
0 failed requests on all 11 pages.
