# WX 2026 — Pass 9.1H Report

**Pass:** 9.1H — Creative Direction Mood Board mobile card-reader **only**
**Route:** creative-direction.html#mood **Display:** 2026.9.1H **Semver:** 2026.9.1-h
**Base:** completed Pass 9.1G source **Date:** 2026-07-22

## 1. Investigation — the mood presentation and its data

The interactive mood presentation on `#mood` is "The Moods Within the Garden"
(`.moods`). Its parts map onto the brief's checklist:
- **Data source:** `M2` (moods 1–5: number `n`, title `t`, keyword set `w`, descriptor `c`).
- **Active-mood state:** the `is-active` class on a `.moods-btn` tab, driven by `show(key)`.
- **Selector controls:** `.moods-tabs` (All Moods + the five moods).
- **Image container:** `.moods-scene` / `#moodsMaster` (one shared Gethsemane scene;
  the active mood dims the scene and glows its region markers).
- **Text panel (separate from the gallery):** `.moods-note` (`#mnoteText`: eyebrow,
  title, keywords, descriptor).
- **Existing next/previous:** none.
- **Routing/lazy/ARIA:** hash routing is elsewhere (untouched); the master image is
  `loading="lazy"`; markers (`.mk`) are `display:none` until their mood is shown (so
  hidden markers are not focusable).

## 2. Root cause (mobile)

`.moods-stage` (2-col grid: scene | note) collapses to one column at
`@media(max-width:900px)`, and the selector tabs sit above the scene. There were
**no Previous/Next controls and no position indicator**, so on a phone the mood
name (a tab), the image (scene) and the descriptor (note) did not read or navigate
as one coherent, steppable unit — a viewer could see a selector without an obvious
path through the moods.

## 3. Exact changes (creative-direction.html only)

**CSS** (`.moods-nav{display:none}` base + `@media(max-width:760px)`): show a
`.moods-nav` control bar (`display:flex`), tighten `.moods-note` under the scene so
name→image→descriptor group as one unit, style `.moods-nav__btn` (≥44×44, pill,
`[disabled]` dimmed, `:focus-visible` ring) and `.moods-nav__pos`; plus a
reduced-motion rule zeroing `.moods-master/.moods-dim/.moods-glow` transitions.

**Markup** — after `#moodsNote`, inside `.moods-stage`:
```
<div class="moods-nav" role="group" aria-label="Step through the moods">
  <button class="moods-nav__btn" id="moodsPrev" aria-label="Previous mood">‹ Prev</button>
  <span class="moods-nav__pos" id="moodsPos" aria-live="polite">All moods</span>
  <button class="moods-nav__btn" id="moodsNext" aria-label="Next mood">Next ›</button>
</div>
```

**JS** — one self-contained enhancer stepping the sequence `[all,1,2,3,4,5]`. It
reads the active mood, updates the position text and Prev/Next `disabled` states,
and on click **reuses the existing `show()`** by clicking the matching
`.moods-btn` — so the active-mood state, scene highlight and descriptor remain the
single source of truth. It also refreshes when a tab is tapped directly, and moves
focus to the still-enabled control if the pressed one becomes disabled. No mood
data, `show()`, routing, or desktop rule was changed.

## 4. Verification (Chromium/Playwright, repo-subpath server)

Mobile (320–414), reader stepped with Next from the start:

| Position | Active mood | Active count | Note title | Next disabled |
|---------|-------------|:------------:|------------|:-------------:|
| All moods (Prev disabled) | — | — | — | no |
| 1 of 5 | 1 | 1 | Secluded & Intimate | no |
| 2 of 5 | 2 | 1 | Assured | no |
| 3 of 5 | 3 | 1 | Pressed | no |
| 4 of 5 | 4 | 1 | Dependent | no |
| 5 of 5 | 5 | 1 | Surrendered | **yes** |

- Exactly one mood active at every step; name, image and descriptor update
  together; no stale/duplicate mood content.
- Next button **84×44** (≥44). Prev disabled at the start, Next disabled at the end.
- Geometry (375): active image **324×182**; tabs→scene **35px**, scene→descriptor
  **16px** — one tight unit (269×151 / 35 / 16 at 320). No excessive image height.
- Keyboard: focusing Next and pressing Enter advances the reader; focus stays on the
  control. Reduced-motion: `#moodsMaster` transition-duration **0s**.
- Direct `#mood` load works; **Explore Sections** sheet still opens (`role=dialog`);
  **Back/Forward** (→ `#elements` → back) returns to `#mood` with the mood panel
  active. Zero horizontal overflow; **0 JS errors**; no failed local requests
  (only the sandbox-blocked Google Fonts host — environment limitation).
- Desktop/tablet (768/1366/1440): `.moods-nav` computed `display:none`; the
  `.moods-stage` grid is unchanged (`537.031px 297.75px`, stage `876×224` at 1366) —
  structurally identical to 9.1G.

## 5. Screenshots (`screenshots/pass-9.1h/`)

before/after at 320, 375, 390; first (1 of 5), middle (3 of 5), final (5 of 5)
mood; desktop 1366 before/after. (The sticky header / adjacent-panel strip visible
in some element-captures is a screenshot compositing artifact — the identity panel
is `display:none` in real rendering.)

## 6. Scope confirmation

Version-normalized diff: every other HTML page differs only in its version string;
creative-direction's functional change is the Moods control-bar CSS, markup and the
one enhancer script. Unchanged: the mobile Explore Sections bottom sheet, the Story
segment, Elements & Symbols, Visual Identity, Musical Identity, detail-panel
systems, Theme Brief panorama, Bible Study, Playbook, favicon/404, footer logos,
global navigation, Setlist, Lyrics, exports, routes, indexing policy, and all mood
definitions/wording/order/images.

## 7. Five standard checks

audit **0/0**; html-validate **pass**; prettier format:check **pass**; eslint
**pass**; Playwright smoke **24/24 pass**.
