# WX 2026 — Pass 9.1J.2 Report

**Pass:** 9.1J.2 — Detail-reader batch 2: Wade-In Dimensions + Musical Identity phase graph
**Display:** 2026.9.1J (unchanged) **Package semver:** 2026.9.1-j.2 **Base:** 9.1J **Date:** 2026-07-22

Extends the 9.1J `WXDetailReader` foundation to two more inventoried families. **The
shared controller was not modified** — no confirmed defect or missing capability was
needed; both families reuse it as-is. Eight of the twelve families remain pending.

## 1. Confirmed inventory (from source)

**A · Wade-In Dimension Cards** — `music-workshop.html`
- Trigger: `.triad` nodes `[data-pillar]` (1 The Christian, 2 The Musician, 3 The
  Performer; 4 = centre "Faithful Service").
- Panel: `#pillar-detail` / `#pillarBody` (with `#pillarEmpty` empty-first).
- Data: `PILLARS[n]`; open fn `selectPillar(n)`; **no close fn — inline panel** (not modal).
- Type: **inline detail**, empty-first. Item count for the reader: **3** (centre is separate).

**B · Musical Identity phase graph** — `creative-direction.html#musical`
- Phase triggers: `#mijPills .mij-pill` (`role=tab`) and graph `.mij-dot[data-d]`.
- Detail panel: `#mijCard` (aria-live); graph `#mijGraph`.
- State fn: `select(i)` → updates pills (`aria-selected`/`.on`), `renderCard()`,
  `syncGraph()` (guides + dots `.on`). Data: `PHASES[]` (4). Active-state: `.on` + index.
- Type: **inline**, graph-linked. Item count: **4**.

Difference vs the 9.1J inventory: none material — both were listed as inline. Noted:
Wade-In's centre pillar (4) is a distinct interaction, excluded from the 3-item reader
and it hides the reader nav (`#pillarBody.is-center #pillarReaderNav{display:none}`).

## 2. Family registrations (callbacks)

**Wade-In** (`music-workshop.html`):
```
WXDetailReader.attach({ count:3, prevBtn:#pilPrev, nextBtn:#pilNext, posEl:#pilPos,
  arrowKeys:true, arrowRoot:#pillar-detail, resetScroll:#pillar-detail,
  label:n=>(n+1)+' of 3',
  isActive:()=> pillarBody shown && !is-center,
  select:n=> selectPillar(String(n+1)) });
// the three data-pillar nodes sync the reader index via r.go()
```
**Musical Identity** (`creative-direction.html`, inside the mij IIFE):
```
WXDetailReader.attach({ count:PHASES.length, prevBtn:#mijPrev, nextBtn:#mijNext, posEl:#mijPos,
  arrowKeys:true, arrowRoot:#mijRoot, resetScroll:#mijCard,
  label:n=>(n+1)+' of 4',
  select:n=> pills[n].click() });   // reuses select() → pills + graph + card in sync
// a delegated listener on #mijRoot syncs the reader when a pill or graph dot is clicked
```

## 3. Shared-controller changes

**None.** `assets/js/wx-detail-reader.js` is byte-identical to 9.1J (no page-specific
selectors, no per-family data, no duplicated focus-trap). Registration is idempotent
(each family attaches once at init).

## 4. Files & selectors changed

- `music-workshop.html`: `<script src="assets/js/wx-detail-reader.js">`; `.wx-reader-nav`
  markup (`#pilPrev`/`#pilPos`/`#pilNext`) in `#pillarBody`; `.wx-reader-nav*` CSS +
  `#pillarBody.is-center` hide rule; `#pd-title` reader-title; one attach + node sync.
- `creative-direction.html`: `<script src="assets/js/wx-detail-reader.js">`;
  `.wx-reader-nav` markup (`#mijPrev`/`#mijPos`/`#mijNext`) after `.mij-band`;
  `.wx-reader-nav*` CSS; one attach + delegated pill/dot sync inside the mij IIFE.
- `tools/smoke.spec.mjs`: two reader journeys (Wade-In, Musical phases w/ graph-sync).
- Version strings: VERSION/README/CHANGELOG/site-config/package (display stays 2026.9.1J;
  semver 2026.9.1-j.2). Generator meta unchanged (display family 9.1J).

## 5. Verification (Chromium/Playwright)

**Wade-In** (375 & 1366): 1 of 3 The Christian (Prev disabled) → 2 The Musician → 3
The Performer (Next disabled) → Prev → 2; underlying `aria-pressed` on the triad node
synced; centre pillar hides the nav; scroll reset; doc-overflow 0; 0 JS errors.

**Musical Identity** (375 & 1366): 1 of 4 God Is Good / The Threshold of Goodness
(Prev disabled, pill 0, graph dot 0) → 2 God Helps Us Yield / The Help in the Dark
(pill 1, dot 1) → 3 We Say Yes / The Will Laid Down (pill 2, dot 2) → 4 God Is
Glorified / The Gateway to Glory (Next disabled, pill 3, dot 3) → Prev → 3. **Graph
marker, pills and detail stay synchronised** from the single `select()`. Scroll reset
on `#mijCard`; doc-overflow 0; 0 JS errors.

**Regression:** direct `#musical` works; `#identity` still lands at its top (heading
131); Explore Sections sheet opens; Back/Forward `#identity`↔`#musical` intact; the
9.1J Bible Study readers unchanged (`wkPos` = "1 of 4").

Boundary state: `disabled` + `aria-disabled` + dimmed treatment (not colour alone).
Buttons ≥44×44, `:focus-visible` rings. Arrow keys guarded — ignored on the mij
`role=tab` pills and inputs, so tablist/roving behaviour is unaffected. Reduced-motion:
inline state changes are immediate.

## 6. Accessibility notes (inline panels)

Both families are **inline** detail panels (not modal), so — consistent with the
"retain existing character" rule — there is no modal Escape-close/focus-trap here; the
reader adds Prev/Next/position/scroll-reset and keeps focus on the pressed control.
`data-reader-title tabindex="-1"` is present for the modal families in later batches.
The controller's modal mode (focus trap, Esc, scroll lock, focus restoration) is
reserved for the `#viOverlay` modal group.

## 7. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint **pass**;
Playwright smoke **27/27** (incl. the two new reader journeys with graph-sync asserts).

## 8. Status — families

Implemented & verified: **4 of 12** — Four Works, Five Sessions (9.1J); Wade-In
Dimensions, Musical Identity phase graph (9.1J.2). **Eight remain pending**: Elements &
Symbols, Flow of Our Journey, Colour Palette, Logo & Wordmarks, VI guidance cards, What
Are You Making?, Find Your Part, Musical Identity Elements. Footer / global-nav work
**not started**.

## 9. Version-normalized diff

Every page except music-workshop and creative-direction differs only in its version
string; those two carry the additive reader markup/CSS/wiring; the shared asset is
unchanged from 9.1J. No wording/data/order changed.

## 10. Screenshots (`screenshots/pass-9.1j-2/`)

Wade-In before/after (first, final, desktop); Musical Identity after (Phase I, Phase IV
with graph marker, desktop) + before.
