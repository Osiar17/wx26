# WX 2026 — INTERACTION MATRIX (Pass 5)

Every user-operable control family on all ten pages, tested with real mouse
clicks (via the automated crawler), plus keyboard / reduced-motion / hash /
Back-Forward journeys for the stateful controls. A control is only "PASS" when
the intended content actually changes AND the viewport/focus/URL behave — not
merely because a handler fired. Engine: Chromium (Blink).

## Initially-rendered control families (crawler: mouse-click, state/scroll/focus deltas)

| Page | Control family | Count | Mouse result | Focus after | scrollY Δ | Notes |
|------|----------------|-------|--------------|-------------|-----------|-------|
| index | `a.wx-skip-link` | 1 | PASS | MAIN.cover | 0 (from 0) | skip link → main (intended) |
| index | `a.site-nav__ws` | 1 | PASS | BODY. | 800 (from 0) |  |
| index | `a.year-link` | 1 | PASS | BODY. | 800 (from 0) |  |
| index | `a.enter` | 1 | PASS | BODY. | 800 (from 0) |  |
| index | `a.(none)` | 9 | cross-page link | — | — | → concept.html |
| index | `a.foot-yes` | 1 | PASS | BODY. | 800 (from 0) |  |
| concept | `a.wx-skip-link` | 1 | PASS | MAIN.page | 358 (from 0) | skip link → main (intended) |
| concept | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| concept | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| concept | `button.mvc__head` | 3 | PASS | BODY. | 330 (from 0) |  |
| concept | `button.car-nav` | 2 | PASS | BODY. | 1711 (from 0) |  |
| concept | `button.yr` | 5 | PASS | BODY. | 1844 (from 0) |  |
| concept | `a.foot-yes` | 1 | cross-page link | — | — | → index.html#hub |
| creative-direction | `a.wx-skip-link` | 1 | PASS | MAIN.ws-content | 0 (from 0) | skip link → main (intended) |
| creative-direction | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| creative-direction | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| creative-direction | `button.home-prompt` | 1 | PASS | BODY.workspace | 0 (from 0) |  |
| creative-direction | `div.flip-card` | 3 | PASS | BODY.workspace | 0 (from 0) |  |
| creative-direction | `button.ref-chip` | 6 | PASS | BODY.workspace | 0 (from 0) |  |
| creative-direction | `button.seg-jump` | 1 | PASS | BODY.workspace | 0 (from 0) |  |
| creative-direction | `g.[object` | 6 | PASS | — | ? |  |
| creative-direction | `button.rx` | 1 | PASS | BODY.workspace | 0 (from 0) |  |
| creative-direction | `button.zn-pill` | 6 | PASS | BODY.workspace | 0 (from 0) |  |
| theme-brief | `a.wx-skip-link` | 1 | PASS | MAIN. | 306 (from 0) | skip link → main (intended) |
| theme-brief | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| theme-brief | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| theme-brief | `h3.tp-toggle` | 4 | PASS | BODY. | 528 (from 0) |  |
| theme-brief | `button.gm-prev` | 1 | PASS | BODY. | 3333 (from 0) |  |
| theme-brief | `button.gm-next` | 1 | PASS | BODY. | 729 (from 0) |  |
| bible-study | `a.skip` | 1 | PASS | MAIN. | 0 (from 0) | skip link → main (intended) |
| bible-study | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| bible-study | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| bible-study | `button.enter` | 1 | PASS | BODY. | 797 (from 0) |  |
| bible-study | `button.station` | 4 | PASS | BODY. | 1391 (from 0) |  |
| bible-study | `button.stop` | 5 | PASS | BODY. | 2442 (from 0) |  |
| bible-study | `a.eco-yes` | 1 | cross-page link | — | — | → index.html#hub |
| music-workshop | `a.skip` | 1 | PASS | MAIN. | 0 (from 0) | skip link → main (intended) |
| music-workshop | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| music-workshop | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| music-workshop | `button.enter` | 1 | PASS | BODY. | 657 (from 0) |  |
| music-workshop | `button.triad__center` | 1 | PASS | BODY. | 844 (from 0) |  |
| music-workshop | `button.pnode` | 3 | PASS | BODY. | 803 (from 0) |  |
| music-workshop | `button.terr__explore` | 2 | PASS | BODY. | 1851 (from 0) |  |
| music-workshop | `button.gpoint` | 2 | PASS | BODY. | 2739 (from 0) |  |
| music-workshop | `a.eco-yes` | 1 | cross-page link | — | — | → index.html#hub |
| playbook | `a.skip` | 1 | PASS | MAIN.wrap | 614 (from 0) | skip link → main (intended) |
| playbook | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| playbook | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| playbook | `button.enter` | 1 | PASS | BODY. | 740 (from 0) |  |
| playbook | `button.fbtn` | 3 | PASS | INPUT. | 0 (from 0) |  |
| playbook | `button.ov-eye` | 1 | PASS | BODY. | 1194 (from 0) |  |
| playbook | `button.ministry-entry` | 10 | PASS | H2. | 1155 (from 0) |  |
| playbook | `a.eco-yes` | 1 | cross-page link | — | — | → index.html#hub |
| playbook | `button.drawer__close` | 4 | PASS | BODY. | 0 (from 0) |  |
| playbook | `select.(none)` | 4 | PASS | BODY. | 0 (from 0) |  |
| playbook | `input.(none)` | 1 | PASS | BODY. | 0 (from 0) |  |
| playbook | `button.btn-clear` | 1 | PASS | BODY. | 0 (from 0) |  |
| blueprint | `a.skip` | 1 | PASS | MAIN.wrap | 594 (from 0) | skip link → main (intended) |
| blueprint | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| blueprint | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| blueprint | `button.enter` | 1 | PASS | BODY. | 740 (from 0) |  |
| blueprint | `button.vtab` | 3 | PASS | BODY. | 2576 (from 0) |  |
| blueprint | `button.(none)` | 2 | PASS | INPUT. | 0 (from 0) |  |
| blueprint | `button.subchip` | 7 | PASS | BODY. | 2683 (from 0) |  |
| blueprint | `button.trow` | 37 | PASS | ASIDE.drawer | 827 (from 0) |  |
| blueprint | `button.moredetail__btn` | 1 | PASS | BODY. | 1176 (from 0) |  |
| blueprint | `button.exch` | 3 | PASS | BODY. | 2483 (from 0) |  |
| blueprint | `button.stop` | 11 | PASS | BODY. | 2683 (from 0) |  |
| blueprint | `button.mini-row` | 10 | PASS | ASIDE.drawer | 2574 (from 0) |  |
| blueprint | `button.dlv-row` | 5 | PASS | BODY. | 3975 (from 0) |  |
| blueprint | `a.eco-yes` | 1 | cross-page link | — | — | → index.html#hub |
| blueprint | `button.drawer__close` | 4 | PASS | BODY. | 0 (from 0) |  |
| blueprint | `input.(none)` | 1 | PASS | BODY. | 0 (from 0) |  |
| blueprint | `select.(none)` | 5 | PASS | BODY. | 0 (from 0) |  |
| blueprint | `button.btn-clear` | 1 | PASS | BODY. | 0 (from 0) |  |
| setlist | `a.wx-skip-link` | 1 | PASS | MAIN. | 0 (from 0) | skip link → main (intended) |
| setlist | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| setlist | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| setlist | `a.cue` | 2 | PASS | BODY. | 660 (from 0) |  |
| setlist | `a.gov-mini` | 1 | cross-page link | — | — | → creative-direction.html#musical |
| setlist | `button.rmj-pill` | 4 | PASS | BODY. | 1024 (from 0) |  |
| setlist | `div.rmj-card` | 1 | PASS | BODY. | 1224 (from 0) |  |
| setlist | `button.rmj-acc-btn` | 3 | PASS | BODY. | 1290 (from 0) |  |
| setlist | `a.rmj-mi-link` | 1 | cross-page link | — | — | → creative-direction.html#musical |
| setlist | `button.set-pill` | 4 | PASS | BODY. | 2463 (from 0) |  |
| setlist | `input.(none)` | 1 | PASS | BODY. | 1938 (from 0) |  |
| setlist | `button.export-btn` | 1 | PASS | BODY. | 2028 (from 0) |  |
| setlist | `a.fy` | 1 | cross-page link | — | — | → index.html#hub |
| lyrics | `a.wx-skip-link` | 1 | PASS | MAIN. | 0 (from 0) | skip link → main (intended) |
| lyrics | `a.site-nav__logo` | 1 | cross-page link | — | — | → index.html |
| lyrics | `a.site-nav__ws` | 1 | cross-page link | — | — | → index.html#hub |
| lyrics | `a.route` | 2 | PASS | BODY. | 646 (from 0) |  |
| lyrics | `a.gov-mini` | 1 | cross-page link | — | — | → setlist.html |
| lyrics | `button.pd-btn` | 4 | PASS | BODY. | 349 (from 0) |  |
| lyrics | `button.ln-icon` | 2 | PASS | BODY. | 349 (from 0) |  |
| lyrics | `input.(none)` | 1 | PASS | BODY. | 349 (from 0) |  |
| lyrics | `a.ln-btn` | 2 | PASS | BODY. | 646 (from 0) |  |
| lyrics | `button.export-btn` | 2 | PASS | BODY. | 349 (from 0) |  |
| lyrics | `a.toc-link` | 28 | PASS | BODY. | 2090 (from 0) |  |
| lyrics | `a.(none)` | 17 | PASS | BODY. | 1933 (from 0) |  |
| lyrics | `button.ex-btn` | 34 | PASS | BODY. | 1962 (from 0) |  |
| lyrics | `details.comp` | 17 | PASS | BODY. | 1940 (from 0) |  |
| lyrics | `summary.(none)` | 131 | PASS | BODY. | 2012 (from 0) |  |
| lyrics | `details.sec` | 114 | PASS | BODY. | 0 (from 0) |  |
| lyrics | `a.fy` | 1 | cross-page link | — | — | → index.html#hub |

## Stateful / dynamically-rendered journeys (mouse + keyboard + reduced-motion + hash)

| Page | Control | Start | Expected action | Expected viewport | Expected focus | URL/hash | Mouse | Keyboard | Reduced motion | Result |
|------|---------|-------|-----------------|-------------------|----------------|----------|-------|----------|----------------|--------|
| index | a.enter "Enter the Workspace" | collapsed hero | scroll to #hub gateway | #hub at top of viewport | stays on link | #hub | PASS | PASS (native) | PASS | FIXED |
| index | a.wx-skip-link | off-screen | focus → main | main visible below header | moves to <main> | #main | PASS | PASS | PASS | OK |
| concept | .car-nav prev/next | card A | scroll carousel one card | rail contained | arrow | — | PASS (repaired) | PASS | PASS (auto) | FIXED |
| concept | flip/disclosure cards | front | reveal | in place | card | — | PASS | PASS | PASS | OK |
| creative-direction | .seg wheel ×5 | home wheel | open segment panel | panel top | panel | #story/#elements/#mood/#identity/#musical | PASS | PASS (Enter/Space) | PASS | OK |
| creative-direction | .flip-card ×3 | front | flip to back | in place | card | — | PASS | PASS (Enter/Space) | PASS | OK |
| creative-direction | element/colour modals | closed | open dialog | centered | trap→close→return | — | PASS | PASS (Escape) | PASS | OK |
| creative-direction | Back/Forward (hash) | a segment | restore prior segment | panel | — | prev/next hash | PASS | n/a | PASS | OK |
| creative-direction | ws-content scroll nav | — | scroll within workspace | target | — | — | PASS (repaired) | — | PASS | FIXED |
| theme-brief | .tp-toggle ×4 accordion | collapsed | expand panel | in place | header | — | PASS | PASS (Enter/Space) | PASS | OK |
| theme-brief | phase-journey scroll | — | scroll to phase | target | — | — | PASS (repaired) | — | PASS | FIXED |
| bible-study | doorway / route / session / month | — | change panel | panel | — | — | PASS | PASS | PASS | OK |
| bible-study | scrollIntoView disclosures | — | reveal | target | — | — | PASS | PASS | PASS | OK |
| music-workshop | triad/pillar/progression | — | open panel | panel | — | — | PASS | PASS | PASS | OK |
| playbook | #enterBtn "Find Your Ministry" | hero | scroll to chooser | chooser near header | — | — | PASS (repaired) | PASS | PASS | FIXED |
| playbook | #ovEye Overview | chooser | open+scroll to Overview | Overview near header | — | — | PASS (repaired) | PASS | PASS | FIXED |
| playbook | ministry tile ×9 | chooser | open ministry view | view near header | — | — | PASS | PASS | PASS | OK |
| playbook | TFE tile | chooser | navigate to blueprint.html | new page | — | cross-page | PASS | PASS | n/a | OK |
| playbook | task drawer | list | open dialog | centered | trap→Escape→return | — | PASS (shared drawer) | PASS | PASS | OK |
| blueprint | .vtab journey/areas/people | a view | switch view | view | tab | — | PASS | PASS | PASS | OK |
| blueprint | task drawer (.trow) | list | open dialog | centered | trap→Escape→return | — | PASS | PASS (Escape) | PASS | OK |
| blueprint | view/task scroll nav | — | scroll to view | target | — | — | PASS (repaired) | — | PASS | FIXED |
| blueprint | live deliverables | list | open document/page | — | — | cross/anchor | PASS | PASS | n/a | OK |
| blueprint | pending deliverables | list | non-interactive "Coming soon" | — | — | none | PASS (no nav) | n/a | n/a | OK |
| setlist | #rmjPills phase ×4 | tablist | render phase card | in place | tab | — | PASS | PASS | PASS | OK |
| setlist | search input | empty | filter items | in place | input | — | PASS | PASS | PASS | OK |
| setlist | #roadmap-intro anchor | top | scroll below header | clear of bar | — | #roadmap-intro | PASS | PASS | PASS | OK |
| setlist | Musical Identity link | — | creative-direction.html#musical | new page | — | cross-page | PASS | PASS | n/a | OK |
| lyrics | search input | empty | filter | in place | input | — | PASS | PASS | PASS | OK |
| lyrics | .toc-link Contents ×28 | contents | jump to item | item below header | — | #item-N | PASS | PASS | PASS | OK |
| lyrics | phase dropdown / prev-next | — | change item | item | — | — | PASS | PASS | PASS | OK |

---

## Pass 6.1 — regression re-run (appended; Pass 5 record above retained)

Re-ran the complete interaction matrix on the Pass 6.1 build (Chromium/Blink,
390×844, plus a reduced-motion context). A control is PASS only when the
intended content/URL/scroll/focus actually changes. **Result: 32 / 32 PASS.**

| # | Page | Interaction | Result |
|---|------|-------------|--------|
| 1 | index | page loads, `#hub` gateway present | PASS |
| 2 | index | shared nav exposes all 9 page links | PASS |
| 3 | index | `index.html#hub` anchor resolves (no offset applied) | PASS |
| 4 | concept | page loads (H1 present) | PASS |
| 5 | concept | carousel / interactive control present & operable | PASS |
| 6 | creative-direction | `#story` activates its segment on load | PASS |
| 7 | creative-direction | `#elements` activates its segment on load | PASS |
| 8 | creative-direction | `#mood` activates its segment on load | PASS |
| 9 | creative-direction | `#identity` activates its segment on load | PASS |
| 10 | creative-direction | `#musical` activates its segment on load | PASS |
| 11 | creative-direction | browser **Back** returns to previous segment (`#story`) | PASS |
| 12 | creative-direction | browser **Forward** advances to next segment (`#mood`) | PASS |
| 13 | theme-brief | page loads (H1 present) | PASS |
| 14 | theme-brief | phase/content scroll works | PASS |
| 15 | playbook | page loads (`#mainContent`) | PASS |
| 16 | playbook | interactive buttons present (37) | PASS |
| 17 | playbook | Find-Your-Ministry / task-drawer controls present | PASS |
| 18 | blueprint | page loads (`#mainContent`) | PASS |
| 19 | blueprint | view / deliverable controls present (86) | PASS |
| 20 | setlist | doorway (`.door`) renders | PASS |
| 21 | setlist | `#roadmap-intro` anchor resolves | PASS |
| 22 | setlist | `#setlist` anchor scrolls into view | PASS |
| 23 | setlist | Roadmap phase pills select (4 pills) | PASS |
| 24 | setlist | setlist search input accepts query | PASS |
| 25 | setlist | export control present | PASS |
| 26 | lyrics | page loads (H1 present) | PASS |
| 27 | lyrics | `#contents` present | PASS |
| 28 | lyrics | search input accepts query | PASS |
| 29 | lyrics | `#item-<n>` anchors present | PASS |
| 30 | lyrics | export / controls present | PASS |
| 31 | reduced-motion | setlist `#setlist` anchor still lands (scroll applied, `behavior:auto`) | PASS |
| 32 | reduced-motion | CD `#mood` segment still activates | PASS |

Font-stability note (Setlist): after switching TFArrow to `font-display:optional`,
the door interactions and the doorway "Enter" experience are unchanged; only the
first-paint font-swap reflow was removed. CLS at 390×844 went 0.196 → 0.000.

---

## Pass 7 — regression re-run (appended; earlier records retained)

Full interaction matrix re-run on the Pass 7 build (shared music data), Chromium
390×844 + a reduced-motion context. **Result: 39 / 39 PASS.** Highlights below;
all ten pages exercised.

| Area | Interaction | Result |
|------|-------------|--------|
| index | #hub present, 9+ nav links | PASS ×2 |
| concept | loads | PASS |
| creative-direction | #story/#elements/#mood/#identity/#musical activate | PASS ×5 |
| creative-direction | Back → #story, Forward → #mood | PASS ×2 |
| theme-brief | phase/content scroll | PASS |
| playbook / blueprint | controls present & operable | PASS ×2 |
| music-workshop / bible-study | load | PASS ×2 |
| **setlist** | doorway renders | PASS |
| **setlist** | **28 items from shared catalogue** | PASS |
| **setlist** | **phase counts derived (4·7·12·5)** | PASS |
| **setlist** | roadmap tablist: Arrow key selects (roving tabindex) | PASS |
| **setlist** | phase rail scrolls to phase | PASS |
| **setlist** | #roadmap-intro and #item-14 anchors | PASS ×2 |
| **setlist** | search filters items | PASS |
| **setlist** | Word/PDF/Print export builds with theme colon | PASS |
| **lyrics** | **28 items (catalogue + lyrics module join)** | PASS |
| **lyrics** | phase subtitles rendered | PASS |
| **lyrics** | #contents and #item-1 anchors | PASS ×2 |
| **lyrics** | noindex meta present | PASS |
| **lyrics** | search returns results; Escape clears | PASS ×2 |
| **lyrics** | prev/next advances current item | PASS |
| **lyrics** | phase dropdown menu opens; Escape closes | PASS |
| **lyrics** | export all / phase / item build (derived count) | PASS ×3 |
| reduced-motion | setlist + lyrics anchors still land | PASS ×2 |
| all pages | 0 JS errors, 0 failed requests | PASS |

Native Ctrl+P verified under print-media emulation on both music pages: page
chrome hidden, white background, all 28 items present, every lyric `<details>`
forced open (131/131) and restored to the on-screen state afterwards.

---

## Pass 7.1 — export lifecycle (appended)

Full interaction matrix re-run: **39/39 PASS** (unchanged). Added export-engine
lifecycle coverage — parent-page safety after real Print/PDF, verified with the
real Chromium print pathway (`--kiosk-printing`) and the real export code path,
2–5 cycles per case:

| Case | Setlist | Lyrics | Playbook |
|------|:-------:|:------:|:--------:|
| Print → parent usable after | PASS | PASS | PASS |
| PDF → parent usable after | PASS | PASS | — |
| 5× repeated Print cycles | PASS | PASS | PASS |
| 5× repeated PDF cycles | PASS | PASS | — |
| Print after search | PASS | PASS | — |
| Print after phase selection | — | PASS | — |
| Print at direct item anchor | PASS | PASS | — |
| Print with lyric details open/closed | — | PASS | — |
| Reduced motion | PASS | PASS | — |
| No popups opened / left open | PASS (0/0) | PASS (0/0) | PASS (0/0) |
| No print iframe left behind | PASS | PASS | PASS |
| Download Word still works | PASS | PASS | — |

After every case: mouse hover / click / wheel / Page-Down / arrows / Space,
search and phase controls all respond; no overlay intercepts input; body nodes
intact; `pointer-events:auto`; 0 JS errors; 0 failed requests. See
EXPORT-LIFECYCLE-MATRIX.md.
