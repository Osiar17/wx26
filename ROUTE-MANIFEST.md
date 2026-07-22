# WX 2026 — ROUTE MANIFEST

All routes are relative and repository-subpath-safe (no leading `/`, no
absolute origin). Every `href`, `src` and CSS `url()` in the delivered files was
enumerated and checked against the packaged files; every reference resolves
except the four intentional pending routes, which now render as "Coming Soon"
states rather than active links.

Legend — Availability (Blueprint deliverables now carry explicit
`availability` + `route` fields; no filename inference, no `"#"`):
- **Live** — destination exists; `availability:"live"` with a valid relative route.
- **Pending — planned page** — a specific page route is planned but the file does
  not exist yet (`availability:"pending"`, `route:"<file>.html"`). Four such routes.
- **Pending — no route yet** — the deliverable has no destination at all
  (`availability:"pending"`, `route:null`). One such deliverable (the training
  frameworks). It is not a broken page link — it simply has no route yet.

In every pending case the item renders as a marked, non-interactive
"Coming Soon" state: never an anchor, never `href="#"`, never in the tab order.

## Pages

| Page | Availability | H1 (meaningful) | Internal page links | In-page anchors / deep links |
|------|--------------|-----------------|---------------------|------------------------------|
| index.html | Live | Worship Experience 2026 — Workspace (added: skip link, `nav`, `main#main`) | bible-study, blueprint, concept, creative-direction, lyrics, music-workshop, playbook, setlist, theme-brief | `#hub` |
| concept.html | Live | The Worship Experience Concept | index, index#hub | — |
| creative-direction.html | Live | The Gethsemane Experience | index, index#hub | Deep links (JS hash routing): `#story`, `#elements`, `#mood`, `#identity`, `#musical` |
| theme-brief.html | Live | Our WX 26 Theme | index, index#hub | — |
| setlist.html | Live | Setlist | index, index#hub, **creative-direction.html#musical** | `#roadmap-intro`, `#setlist` |
| lyrics.html | Live | Lyric Book | index, index#hub | `#contents`, `#item-<n>` |
| playbook.html | Live | Ministries Playbook | index, index#hub | `#mainContent`; JS → blueprint.html (Flow Experience tile) |
| blueprint.html | Live | The Blueprint | index, index#hub | `#mainContent`; JS deliverable links (below) |
| music-workshop.html | Live | Wade-In | index, index#hub | `#beneath` |
| bible-study.html | Live | Bible Study | index, index#hub | `#what` |

## Creative Direction — deep-link segments (hash routing)

| Hash | Segment | On load | Back/Forward |
|------|---------|---------|--------------|
| `#story` | The Story | activates panel | supported |
| `#elements` | Elements & Symbols | activates panel | supported |
| `#mood` | Mood Board | activates panel | supported |
| `#identity` | Visual Identity | activates panel | supported |
| `#musical` | Musical Identity | activates panel | supported |

An unknown or empty hash returns the home wheel. `hashchange` and `popstate`
are both handled, so the browser Back/Forward buttons move between segments.

## Blueprint — deliverable routes (JS `DELIVERABLES`)

| Deliverable | Route | Availability |
|-------------|-------|--------------|
| Concept | concept.html | Live |
| Theme Brief | theme-brief.html | Live *(repaired from `themebrief.html`)* |
| Creative Direction | creative-direction.html | Live |
| Visual Identity | creative-direction.html#identity | Live |
| Musical Identity | creative-direction.html#musical | Live |
| Worship Roadmap | setlist.html#roadmap-intro | Live *(repaired from `setlist.html#roadmap`)* |
| Setlist | setlist.html | Live |
| Ministries Playbook | playbook.html | Live |
| Lyric Book | lyrics.html | Live |
| Vocal & Instrumental Training Frameworks | `route:null` | **Pending — no route yet** |
| **Flow Map** | flow-map.html | **Pending — planned page (absent)** |
| **Production Cue Book** | production-cue.html | **Pending — planned page (absent)** |
| **D-Day Running Order** | running-order.html | **Pending — planned page (absent)** |
| **Post-Experience Report** | experience-report.html | **Pending — planned page (absent)** |

The four planned-page routes above are absent files with a defined route; the
training-frameworks deliverable has `route:null` (no destination planned yet).
Both surface as "Coming Soon", but they are distinct availability cases in the
data model (`availability:"pending"` with a route string vs `null`).

## Canonical internal route (referenced by name across pages)

| Concept | Canonical route |
|---------|-----------------|
| Musical Identity | `creative-direction.html#musical` (not `musical-identity.html`) |
| Blueprint | `blueprint.html` (not `WX_2026_Blueprint.html`) |
| Theme Brief | `theme-brief.html` (not `themebrief.html`) |

## Assets & shared files
All `assets/…` images, video and fonts referenced by the pages are packaged and
resolve. The formerly-missing `assets/calibrate-reading-night.jpg` reference was
removed (see REMOVED-CODE.md).

Pass 2 additions (all referenced by every page, relative paths):
- `assets/images/` — externalised images (no `data:image` remains anywhere):
  `index-garden.jpg`; theme-brief `theme-brief-color.jpg`,
  `theme-brief-slide-1.jpg`, `theme-brief-slide-2.jpg`, `theme-brief-slide-3.webp`,
  `theme-brief-slide-4.jpg`; decorative textures `texture-180.svg` (shared),
  `texture-160.svg` (shared), `texture-160-2.svg`, `texture-1.svg`, `texture-1-2.svg`.
- `assets/css/tokens.css`, `assets/css/base.css`, `assets/css/components.css`.
- `assets/js/site-config.js`, `assets/js/routes.js`, `assets/js/site.js`.
- `assets/js/canonical.js` was **removed** (superseded by site-config.js + routes.js).

## Creative Direction deep-link segments
`#story`, `#elements`, `#mood`, `#identity`, `#musical` — activated on load and
via Back/Forward (unchanged from Pass 1; segment list also declared in
`routes.js` as `WX.creativeDirectionSegments`).

## Pass 4 — accessibility landmarks (all pages)
Every page now exposes: one `<h1>`, a `<main>` landmark with `tabindex="-1"` as
the skip-link target, a `<nav>` landmark where navigation exists, and a
visible-on-focus skip link that moves focus into `<main>` (verified by activation).
Skip-link targets: index/concept/lyrics/setlist/theme-brief → `#main`;
creative-direction → `#ws-content`; bible-study/music-workshop → `#top`;
blueprint/playbook → `#mainContent`.

---

## Pass 7 update — no route or anchor changed

All page routes, in-page anchors and deep links listed above are unchanged in
Pass 7. Setlist ↔ Lyrics cross-links remain canonical (`setlist.html` ↔
`lyrics.html`), the Setlist item anchors (`#item-1`…`#item-28`), phase sections,
`#roadmap-intro` and `#setlist`, and the Lyric Book `#contents` / `#item-<n>`
anchors are all still present and were regression-tested. Creative Direction
`#musical` still resolves; `data-mi` links still target `creative-direction.html#musical`.

### New shared assets (referenced by setlist.html and lyrics.html)
- `assets/js/wx-music-data.js` — shared phase + 28-item catalogue (`WX_PHASES`,
  `WX_CATALOGUE`).
- `assets/js/wx-lyrics-data.js` — lyrics-only data (`WX_LYRICS`), loaded by
  lyrics.html only.
- `robots.txt` (site root) — Disallows `/lyrics.html`.

### Availability / visibility
- All ten pages remain **Live**. The four pending planned-page routes and the
  one `route:null` deliverable are unchanged (still "Coming Soon").
- **lyrics.html is now `noindex, nofollow`** (per-page meta + robots.txt) — an
  internal worship resource, not a broken or removed route. It is still reachable
  and fully functional; it is only excluded from search indexes.

---

## Pass 8 update — 404, metadata, visibility

Routes and in-page anchors are unchanged from Pass 7.1. Additions:

- **`404.html`** — branded not-found page (noindex). Not a route target; served
  by GitHub Pages for unmatched paths. Links resolve to the deployment base at
  runtime (works from a repository subpath).
- **New static assets** referenced by every page: `assets/favicon.svg`,
  `assets/apple-touch-icon.png`.
- **`robots.txt`** now disallows `creative-direction.html`, `blueprint.html`,
  `playbook.html` and `lyrics.html`.

### Availability / indexing (unchanged availability; indexing set in Pass 8)

| Page | Availability | Indexing |
|------|--------------|----------|
| index, concept, theme-brief, setlist, music-workshop, bible-study | Live | public (indexable) |
| creative-direction, blueprint, playbook | Live | **noindex, nofollow** (operational/internal) |
| lyrics | Live | **noindex, nofollow** (copyright) |
| flow-map, production-cue, running-order, experience-report | Pending — planned page | n/a (Coming Soon) |
| Vocal & Instrumental Training Frameworks | Pending — `route:null` | n/a (Coming Soon) |

All pages remain reachable and functional; noindex only affects search indexing.
The four pending planned-page routes and the one `route:null` deliverable are
unchanged and still surface as non-interactive "Coming Soon" states — CI does not
fail on them.

---

## Pass 9 update — no route changes

Routes, anchors, availability and the visibility/indexing policy are unchanged
from Pass 8. Pass 9 made only accessibility repairs (ARIA roles, keyboard focus,
contrast) and restored the retained raster fallbacks; no page, anchor, pending
route or robots entry was added, removed or renamed. Release: v2026.9.0.
