# PASS 9.1L (Rebuild) — Restrained Header Directory and Footer Navigation

**Site:** Worship Experience 2026 (static HTML/CSS/vanilla JS, GitHub Pages subpath)
**Display version:** `2026.9.1L` · **Package semver:** `2026.9.1-l`
**Pass label:** Pass 9.1L — Restrained Header Directory and Footer Navigation
**Working copy:** `wx2026-pass-9.1L-rebuild` (duplicated from `wx2026-pass-9.1K`; the 9.1K source was **not** modified)
**Date:** 2026-07-23

Reader navigation now has exactly **two** restrained visible parts and **nothing in the
body of any page**. The discarded 9.1L mid-page navigation block, markup and CSS were
**not** reused. `assets/js/wx-detail-reader.js` is **byte-identical**; the fifteen
readers, Creative Direction routing, Theme Brief panorama, page content, exports and
Setlist/Lyrics data are untouched.

## Sole source & Concept resolution
- **Sole base:** the accepted Pass 9.1K working copy. No 9.1L artifacts were carried in
  (verified: no `site-navigation.js`, `wx-pagenav`, or `wx-dir` anywhere before edits).
- **Concept page:** resolved to **`concept.html`** (hub label "The Worship Experience
  Concept"; its own H1 is "About Worship Experience"). No page invented or renamed.

## Final nine-page reader sequence
1. The Worship Experience Concept — `concept.html`
2. WX Theme Brief — `theme-brief.html`
3. WX Creative Direction — `creative-direction.html`
4. Playbook — `playbook.html`
5. Blueprint — `blueprint.html`
6. Setlist — `setlist.html`
7. Lyrics Book — `lyrics.html`
8. Music Workshop — `music-workshop.html`
9. Bible Study — `bible-study.html`

## Creative Direction branch map
```
Theme Brief ──▶ Creative Direction
                 ├─ #story / #elements / #mood : Prev → Theme Brief · Next unavailable
                 ├─ #identity (Visual Identity) : Prev → Theme Brief · Next → Playbook
                 └─ #musical  (Musical Identity): Prev → Theme Brief · Next → Blueprint

Playbook  ──▶ Setlist?from=playbook       Blueprint ──▶ Setlist?from=blueprint
                       └───────────┬───────────────┘
                                   ▼
                    Setlist ▶ Lyrics Book ▶ Music Workshop ▶ Bible Study
```
Playbook and Blueprint are **parallel branches**, never consecutive reader steps. The
footer Next never jumps from Story straight to Playbook/Blueprint; Explore Sections
remains the primary way between CD segments. The CD footer updates on direct hash
entry, segment change, Back/Forward and Explore-Sections selection (a `hashchange`
listener), with no stale text/href.

## Setlist branch-context design
Playbook's Next = `setlist.html?from=playbook`; Blueprint's Next =
`setlist.html?from=blueprint`. Setlist reads `?from` and accepts **only** `playbook`
or `blueprint`; any other value (or none) falls back to **Playbook** as Previous. No
`history.back()`, no external targets, relative links only; the parameter never affects
Setlist content, exports or printing.

## Exact route/nav metadata (`assets/js/site-nav.js`)
| Page | Previous | Next |
|------|----------|------|
| concept.html | — (off) | theme-brief.html |
| theme-brief.html | concept.html | creative-direction.html |
| creative-direction.html #story/#elements/#mood | theme-brief.html | — (off) |
| creative-direction.html #identity | theme-brief.html | playbook.html |
| creative-direction.html #musical | theme-brief.html | blueprint.html |
| playbook.html | creative-direction.html#identity | setlist.html?from=playbook |
| blueprint.html | creative-direction.html#musical | setlist.html?from=blueprint |
| setlist.html | playbook.html \| blueprint.html (from ?from; default playbook) | lyrics.html |
| lyrics.html | setlist.html | music-workshop.html |
| music-workshop.html | lyrics.html | bible-study.html |
| bible-study.html | music-workshop.html | — (off) |

## Files, selectors and JS changed
- **New `assets/js/site-nav.js`** — the whole behaviour: footer Prev/Next (`.wx-fnav`,
  branch-aware, CD hashchange-reactive), and the All Pages dropdown (`.wx-allpages`
  trigger injected beside Workspace + `.wx-menu` popover).
- **`assets/css/components.css`** — appended `.wx-fnav`, `.wx-allpages`, `.wx-menu`
  styles + footer child ordering (nav between marks, `eco-mid` below) + print hiding.
- **Per page:** one `<span data-wx-fnav>` inserted **between the YES and CCC marks** in
  each of the nine reader footers (no other footer markup changed), plus the
  `<script defer src="assets/js/site-nav.js">` tag and the generator-meta version bump.
- **Unchanged:** `wx-detail-reader.js` (byte-identical), all page content, the
  Workspace hub markup/order, Setlist/Lyrics data, exports.

## B–C. Header All Pages control
A dainty ~38px chevron button (`.wx-allpages`) injected **immediately before** the
existing Workspace control (`[ ▾ ] [ ← Workspace ]`), lighter than the Workspace
button, arrow-only, `aria-label="Open all pages"`, `aria-haspopup`, `aria-expanded`,
`aria-controls="wxAllPages"`, visible focus. It opens a compact anchored dropdown
(`.wx-menu`) — not a full-page modal — of the nine reader pages as **real anchors** in
sequence, current page marked with weight + gold left-border + a "Current" badge and
`aria-current="page"`; closes on selection, Escape and outside click, returning focus
to the arrow. Narrow phones (≤480px) use a compact full-width anchored panel that
scrolls internally and restores body scroll. The dropdown order is reader-facing only;
the Workspace card order is not touched.

## D/L/M. Footer controls
`.wx-fnav` lives **inside the footer identity row, between the YES and CCC marks** — two
destinations only, **no current-page title**, no separate section, no blank band.
Desktop shows short named controls (`← Theme Brief` / `Playbook →`); phones show arrows
only with the full destination on each anchor's `aria-label` ("Previous: WX Theme
Brief"). Restrained (thin, no heavy pill, Bone/gold text, small arrows), visually
secondary to the marks, 44px targets, visible focus, genuine non-link boundaries
(`<span aria-disabled>`, not in the tab order). No overlap, no logo displacement, no
footer-height explosion, no horizontal overflow (320–1440 verified).

## Accessibility
Trigger: semantic button, accessible name, `aria-expanded`/`aria-controls`, visible
focus. Dropdown: labelled `nav` region of real anchors, `aria-current` on the active
page, Escape + outside-click close, focus returns to the trigger. Footer: real anchors
for enabled destinations, disabled boundaries as non-tabbable `<span aria-disabled>`,
accessible names on all controls, logical order YES → Previous → Next → CCC.

## Safeguards
- **Creative Direction:** Explore Sections dropdown, five segment hashes, segment-top
  landing, Five Moods, all fifteen readers, overlays and internal reader Prev/Next are
  preserved; the page-level footer Prev/Next is separate markup and cannot be confused
  with a reader's controls; footer reachability retained.
- **Setlist/Lyrics/Playbook/Blueprint:** no order, medleys, lyrics, translations,
  arrangement, tasks, status, filters, or export/print/PDF/Word logic touched. The nav
  is hidden in print (`@media print { .wx-fnav,.wx-allpages,.wx-menu{display:none} }`)
  and is not part of any export; `?from` never affects content or exports.
- **Workspace:** hub tile order unchanged (test asserts the first-card list is
  concept, theme-brief, creative-direction, music-workshop, bible-study — as in 9.1K).

## Tests & validation
48 Playwright tests pass (43 retained + 5 new): footer Prev/Next per reader page +
boundaries; Setlist branch-context Previous (playbook/blueprint/none/evil); CD footer
per segment + live hashchange with no stale state; All Pages dropdown (open, order,
current, Escape, outside, focus return); print-hidden nav + Workspace order unchanged.
audit 0/0, html-validate exit 0, prettier clean, eslint 0. No horizontal overflow at
320–1440; no JS errors; no failed local assets; all fifteen reader tests green.

## Screenshots (screenshots/pass-9.1l/)
Header dropdown: `dropdown-closed-320.png`, `dropdown-open-320.png`,
`dropdown-closed-1366.png`, `dropdown-open-1366.png`. Footers (full context, both
marks): `footer-concept-390.png`, `footer-theme-brief-390.png`,
`footer-theme-brief-1366.png`, `footer-cd-identity-390.png`, `footer-cd-musical-390.png`,
`footer-playbook-390.png`, `footer-blueprint-390.png`,
`footer-setlist-from-playbook-390.png`, `footer-setlist-from-blueprint-390.png`,
`footer-bible-study-390.png`.

## Version-normalised diff
New `assets/js/site-nav.js`. Changed `assets/css/components.css` (nav styles + print),
`tools/smoke.spec.mjs` (+5 tests), and each reader page's one-line `data-wx-fnav` mount
+ nav `<script>` + generator-meta bump. `wx-detail-reader.js` and all content unchanged.

## Confirmation
No content or export data changed. Pass 9.1L (rebuild) is complete; no subsequent pass
was begun.

## Deliverables
- `PASS-9.1L-REPORT.md`; split working-copy package; `UNPACK-9.1L.bat`;
  `REASSEMBLE-9.1L.txt` + SHA-256.
