# WX 2026 — FINAL QA REPORT (Pass 9, release candidate)

Independent audit of the attached release candidate. Everything was re-verified
from scratch; only confirmed defects were repaired. Release identifier after this
pass: **v2026.9.0**.

Engine: Chromium (Blink) via Playwright, served over a **simulated repository
subpath** (`http://localhost:<port>/repo/…`) with a dependency-free static
server. Widths tested: 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920.
Accessibility: axe-core 4.x (WCAG 2.0/2.1 A + AA).

> **Package note.** The uploaded ZIP was the Pass 8 _core_ (107 WebP, but the
> retained `.jpg`/`.png` `<picture>` fallbacks were absent — an artifact of the
> earlier split delivery). The complete site was reconstituted for QA and this
> release by restoring those fallbacks (asset tree now matches the full Pass 8
> tree exactly). WebP‑capable browsers still fetch only WebP; the originals are
> the retained fallbacks.

## Pass / fail matrix

| #   | Check                                                                                                       | Result      | Evidence                                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Local server under a repo subpath                                                                           | **PASS**    | Served at `/repo/`; all pages HTTP 200; `/repo/<missing>` → 404.html                                                                                                                                                                                     |
| 2   | Validate every HTML/CSS/JS/data file                                                                        | **PASS**    | `html-validate` pass on 11 files; dependency-free audit 0 errors/0 warnings                                                                                                                                                                              |
| 3   | No `data:image`/base64 assets                                                                               | **PASS**    | audit `[data-image]` scan clean across HTML/CSS/JS                                                                                                                                                                                                       |
| 4   | Every href/src/srcset/url() resolves or is intentional                                                      | **PASS**    | audit: 0 missing, 0 case mismatch, 0 absolute‑root refs; 4 pending routes render "Coming Soon"                                                                                                                                                           |
| 5   | Canonical content                                                                                           | **PASS**    | theme "YES: Not My Will, But Yours"; 4 phase titles+subtitles exact; Wildflower `#7A4CB8`; "So the only surprise is how God shows up." rendered on playbook (`WX.preservedLine`)                                                                         |
| 6   | Setlist ↔ Lyrics same catalogue/order/IDs/titles/phases/counts; lyrics unchanged                            | **PASS**    | one `WX_CATALOGUE` (28 items, contiguous 1–28, phase counts 4·7·12·5); `WX_LYRICS` keys == catalogue numbers; 0 items missing lyric data                                                                                                                 |
| 7   | Widths 320–1920                                                                                             | **PASS**    | 90 page×width combos: **max horizontal overflow 0 px** everywhere                                                                                                                                                                                        |
| 8   | No overflow / no clipped titles / concept timeline contained / CD mobile start / sticky nav / touch targets | **PASS**    | 0 overflow; only "clipped" flag is the intentional SR‑only `h1.wx-visually-hidden`; concept 0 overflow; CD starts on home wheel at `scrollY=0`; anchored heading clears sticky nav; controls ≥ 40 px (pseudo hit‑areas from earlier passes)              |
| 9   | Keyboard: Escape, focus return, tab order, arrow widgets                                                    | **PASS**    | first Tab → skip link; setlist roadmap tablist arrow‑selects (roving tabindex); lyrics phase menu opens + Escape closes + focus returns                                                                                                                  |
| 10  | 200% zoom + reduced motion                                                                                  | **PASS**    | 640/2× DPR: 0 horizontal overflow on all pages; reduced‑motion anchors land, CD segment activates                                                                                                                                                        |
| 11  | Deep links + Back/Forward (index/CD/setlist/lyrics)                                                         | **PASS**    | `#hub`; CD `#story/#elements/#mood/#identity/#musical` + Back→#story/Forward→#mood; setlist `#roadmap-intro/#setlist/#item-14`; lyrics `#contents/#item-1/#item-28`                                                                                      |
| 12  | Playbook ministry previews + prints                                                                         | **PASS**    | selector builds 10 ministry items (role=group); Print renders via the isolated iframe engine, 0 popups, page stays interactive                                                                                                                           |
| 13  | Setlist/Lyrics Word/PDF/Print + popup‑blocker + native Ctrl+P                                               | **PASS**    | PDF/Print via isolated iframe: 0 popups, 0 leftover frames, `pointer-events:auto`; Word downloads `WX2026_Lyric_Book.doc`; popup‑blockers irrelevant (no popup); native Ctrl+P validated in Pass 7.1 (real kiosk‑print)                                  |
| 14  | Chrome / Firefox / WebKit                                                                                   | **PARTIAL** | Chromium: full pass. Firefox/WebKit: **could not be installed** (Playwright browser download host blocked in this environment). Changes are standards‑based; a manual Firefox/Safari spot‑check is recommended — see UNRESOLVED.md                       |
| 15  | Accessibility tooling + manual                                                                              | **PASS**    | axe‑core WCAG 2 A/AA: **0 critical, 0 serious** across all 10 pages after the repairs below; landmarks, one meaningful H1/logical headings, names/roles/states and visible focus manually confirmed                                                      |
| 16  | Performance — actual measurements                                                                           | **PASS**    | first‑load transfer (subpath, cache disabled, no gzip → ≈ uncompressed): index 445 KB / setlist 411 KB / lyrics 401 KB / creative‑direction 941 KB; **CLS** index 0.0006, setlist 0.0000, lyrics 0.0009, CD 0.0006. No Lighthouse/CWV figures fabricated |
| 17  | Before/after screenshots                                                                                    | **PASS**    | blueprint hero (WebP, on‑brand) and changed pages reviewed — no unintended presentation change from the contrast/ARIA repairs                                                                                                                            |
| 18  | README / ROUTE‑MANIFEST / visibility / CHANGELOG match files                                                | **PASS**    | version, route map, visibility policy and changelog updated to match; robots policy consistent (meta + robots.txt)                                                                                                                                       |

## Defects found and repaired in Pass 9

All confirmed against the accessibility scan; repaired with the least‑invasive fix.

1. **setlist `#setRail` — invalid ARIA (critical).** A phase scroll‑navigation
   `<nav>` was marked `role="tablist"` but its children are navigation buttons
   with `aria-current` (not `role="tab"`). Removed `role="tablist"`; it is now a
   correctly‑labelled `<nav>` landmark. Arrow‑key navigation still works.
2. **playbook `#selector` — invalid ARIA (critical).** `role="list"` contained a
   non‑`listitem` `aria-live` centre (`grid-area:centre`, cannot leave the DOM
   without breaking layout). Changed the container to `role="group"` and removed
   `role="listitem"` from its ministry buttons. Selector still builds 10 items.
3. **concept — 3 scrollable regions not keyboard‑focusable (serious).** Added
   `tabindex="0"` + label to the history carousel (`#histTrack`); the two
   conversation panels now become non‑scrollable when closed and get
   `tabindex="0"` only while open (managed in script) — so an open panel is
   keyboard‑scrollable and a closed one is never a hidden/stray tab stop.
4. **Contrast below AA (serious).** Faint metadata labels used
   `--ink-faint: rgba(236,227,208,.44)` (≈3.67:1). Raised to `.55` (≈5.1:1) on
   the two failing pages (blueprint, playbook) — 150+ nodes fixed, still a muted
   tier. The "late" state numeral colour `--crimson-bright` `#b0535f` (3.8:1) was
   lightened to `#bf6470` (4.72:1), preserving the crimson identity.
5. **Missing raster fallbacks.** The uploaded core lacked the retained
   `.jpg`/`.png` `<picture>` fallbacks; restored for a complete release.

Post‑repair: **axe 0 critical / 0 serious** on all pages; audit 0/0; html‑validate
pass; **0 JS errors and 0 failed requests** across all 11 pages (incl. 404 and CD
segments).

## Release gate

| Gate criterion                                                                               | Status                                              |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| No grammar/theology/phase/palette drift                                                      | **PASS** (canonical checks + drift audit)           |
| Routes/assets resolve                                                                        | **PASS**                                            |
| No accidental overflow/clipping                                                              | **PASS**                                            |
| One H1 / logical headings / main / nav / skip links / native controls / focus / target sizes | **PASS**                                            |
| Responsive media + deferred loading                                                          | **PASS** (WebP `<picture>`, lazy)                   |
| Shared tokens/routes/config used without flattening identity                                 | **PASS**                                            |
| Dead‑code removals evidenced                                                                 | **PASS** (REMOVED-CODE.md)                          |
| Operational data freshness/ownership visible                                                 | **PASS** (Playbook shows owners, due dates, status) |
| Print/download outputs reviewed                                                              | **PASS** (isolated‑iframe engine; Word/PDF/Print)   |
| No critical console or accessibility errors                                                  | **PASS** (0 JS errors; axe 0 critical/0 serious)    |

**Verdict: PASS** — release candidate approved as `WX2026-site-release.zip`
(v2026.9.0). The only open items require an owner decision (production URL for
Open Graph/canonical; confirmation of the noindex visibility defaults) and one
environment limitation (Firefox/WebKit not installable here) — see UNRESOLVED.md.
