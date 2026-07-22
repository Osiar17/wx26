# Worship Experience 2026 — website

A static site for **Worship Experience 2026** (theme: **YES: Not My Will, But
Yours**), produced by **The Flow Experience**. Plain, standards-based
HTML/CSS/vanilla JavaScript — no framework, no build step, no server. It is
designed to be served as static files, including from a **GitHub Pages
repository subpath**.

- **Version:** `2026.8.0` (Pass 8). See `VERSION` and `CHANGELOG.md`.
- **Last updated:** 2026-07-21.

---

## Pages, routes and purpose

All pages live at the repository root and use **relative, subpath-safe URLs**
(no leading `/`, no hard-coded origin), so the site works at either
`https://user.github.io/<repo>/` or a custom domain root.

| File                      | H1 / purpose                                                                            | Key in-page anchors                                                                                | Indexing    |
| ------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| `index.html`              | Hub landing — gateway to every resource                                                 | `#hub`                                                                                             | public      |
| `concept.html`            | The Worship Experience concept / story                                                  | —                                                                                                  | public      |
| `theme-brief.html`        | The theme and the four-phase journey                                                    | —                                                                                                  | public      |
| `creative-direction.html` | Creative-direction workspace (Gethsemane visual world); **Musical Identity lives here** | `#story` `#elements` `#mood` `#identity` `#musical` (hash-routed segments, Back/Forward supported) | **noindex** |
| `setlist.html`            | The setlist — 28 items across four phases + the worship roadmap                         | `#roadmap-intro` `#setlist` `#item-1`…`#item-28`                                                   | public      |
| `lyrics.html`             | The Lyric Book — full lyrics keyed to the setlist                                       | `#contents` `#item-1`…`#item-28`                                                                   | **noindex** |
| `playbook.html`           | Ministries Playbook (operational task/ministry data)                                    | `#mainContent`                                                                                     | **noindex** |
| `blueprint.html`          | The Blueprint — deliverables and routes                                                 | `#mainContent`                                                                                     | **noindex** |
| `music-workshop.html`     | Wade-In (The Christian · The Musician · The Performer)                                  | `#beneath`                                                                                         | public      |
| `bible-study.html`        | Calibrate — bible study                                                                 | `#what`                                                                                            | public      |
| `404.html`                | Branded not-found page; links back to the Workspace                                     | —                                                                                                  | noindex     |

Canonical route notes: **Musical Identity = `creative-direction.html#musical`**
(there is no `musical-identity.html`). Full route/anchor inventory and the four
pending "Coming Soon" routes are in `ROUTE-MANIFEST.md`.

---

## GitHub Pages deployment

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   The included workflow (`.github/workflows/ci.yml`) runs the checks and then
   deploys the site on every push to `main`.
   (Alternatively, choose _Deploy from a branch_ → root of `main` to skip CI.)
3. The site is served at `https://<user>.github.io/<repo>/`. Because every link
   is relative, no base-path configuration is required. The `404.html` page also
   resolves its links to the deployment base at runtime, so it works from a
   subpath as well.

No server-side routing, redirects or rewrites are used or assumed. Filenames are
**case-sensitive** on GitHub Pages; `tools/audit.mjs` fails the build if any
link's case does not match a file on disk.

---

## Network dependency (Google Fonts)

The pages load **Google Fonts** (Cinzel, EB Garamond) from
`fonts.googleapis.com` / `fonts.gstatic.com`. This is an intentional external
dependency — the site is **not** designed for fully offline operation. The
self-hosted **TFArrow** label font ships in `assets/` and uses
`font-display:optional` (so a cold load never causes layout shift). If a font
host is blocked, the pages fall back to system serif/sans faces and remain fully
readable and functional.

---

## Visibility & indexing policy

Set per page via `<meta name="robots">` (authoritative, and correct under a
subpath deployment) and mirrored in `robots.txt`:

- **Public (indexable):** `index`, `concept`, `theme-brief`, `setlist`,
  `music-workshop`, `bible-study`.
- **noindex, nofollow (operational / internal):** `creative-direction`,
  `blueprint`, `playbook` — these carry internal task/brand data and default to
  noindex because no explicit public decision has been made.
- **noindex, nofollow (licensing):** `lyrics` — the Lyric Book reproduces full
  third-party copyrighted lyric text and is treated as an internal worship
  resource.

To make a page public later, remove its `robots` meta tag **and** its
`robots.txt` `Disallow` line. Open Graph / Twitter / canonical tags are
**deliberately omitted** because the final production URL and public-visibility
decisions are not yet known; add them per page once the domain is fixed (and
never expose internal Playbook/Blueprint task data through social previews).

---

## Shared foundation (tokens, config, data)

Single sources of truth — do not fork these values into individual pages:

- `assets/css/tokens.css`, `assets/css/base.css`, `assets/css/components.css` —
  design tokens and shared component styles.
- `assets/js/site-config.js` — `window.WX`: theme string, canonical phases
  (name + subtitle), Wildflower Purple `#7A4CB8`, event date, reduced-motion
  helpers, and `WX.version`.
- `assets/js/routes.js` — canonical route constants (e.g. `WX.routes.musicalIdentity`).
- `assets/js/site.js` — shared header countdown + global behaviour.
- `assets/js/wx-export.js` — the shared safe print/export engine (see below).

### How Setlist and Lyrics share data

The 28-item catalogue lives **once** and both pages read from it:

- `assets/js/wx-music-data.js` — `WX_PHASES` (phase id, numeral, title,
  subtitle, movement, summary line, handoff) and `WX_CATALOGUE` (per item:
  number, phase, title, subtitle, type, artist, and component
  letters/titles/artists). **No lyric text.**
- `assets/js/wx-lyrics-data.js` — `WX_LYRICS`, the lyrics-only module keyed by
  catalogue item number (sections, lines, translations, arrangement
  instructions, placeholders). Loaded only by `lyrics.html`.

`setlist.html` derives its phases/items (and **phase counts**) from
`WX_CATALOGUE`; `lyrics.html` joins `WX_CATALOGUE` with `WX_LYRICS`. To change a
title, artist, order or phase, edit `wx-music-data.js` **only** — both pages
update together. To edit lyric text, edit `wx-lyrics-data.js`. Never hard-code
counts or duplicate the catalogue into a page.

---

## Images & asset conventions

- All raster images are externalised under `assets/` (no `data:image` anywhere —
  enforced by `tools/audit.mjs`).
- Each raster ships as **WebP + the original** (`.jpg`/`.png`) behind a
  `<picture>` (`<source type="image/webp">` + `<img>` fallback) or a
  single-quoted `image-set()` in inline styles. WebP-capable browsers fetch only
  the WebP; originals are retained as fallbacks and are **not** deleted.
- Below-the-fold / segment-gated images use `loading="lazy" decoding="async"`;
  hero/LCP and logos load eagerly.
- Decorative images use `alt=""`; informative images have concise,
  purpose-based alt text. Ordinary CSS gradients are **not** externalised.
- Brand icons: `assets/favicon.svg` (scalable) and `assets/apple-touch-icon.png`;
  `theme-color` is `#0A0E1A`.

---

## Adding a future deliverable without breaking links

1. Add the page as a new root-level `*.html` using relative asset/links, with the
   standard `<head>` metadata block (title, description, viewport, icons,
   theme-color, and a `robots` meta if it is operational/internal).
2. If it is a Blueprint deliverable, add it to the `DELIVERABLES` data in
   `blueprint.html` with an explicit `route` and `availability`. Until the file
   exists, use `availability:"pending"` — it renders as a non-interactive
   **"Coming Soon"** state (never an `href="#"`, never in the tab order), so a
   missing planned page **does not** break the build.
3. Run `npm run audit` (or just `node tools/audit.mjs .`) — it lists any missing
   or mis-cased reference. Intentionally-pending routes are ignored.

### Known future files (planned, currently "Coming Soon")

`flow-map.html`, `production-cue.html`, `running-order.html`,
`experience-report.html`. The training-frameworks deliverable has `route:null`
(no destination yet). See `ROUTE-MANIFEST.md`.

---

## Printing & export (limitations)

Setlist, Lyrics and Playbook offer **Download Word**, **Save as PDF** and
**Print**:

- **Download Word** produces a Word-compatible `.doc` (HTML), **not** a true
  binary `.docx` — labelled accordingly.
- **Save as PDF / Print** render a standalone export document in an isolated,
  hidden **iframe** (`assets/js/wx-export.js`) and print only that iframe — the
  live page is never mutated and stays fully interactive after cancel. "Save as
  PDF" opens the browser print dialog with a _Choose Save as PDF_ hint; it is a
  print-to-PDF flow, not a direct file download.
- A browser's **native print dialog cannot be scripted**, so automated tests
  exercise the real print pathway (`--kiosk-printing`) and parent-page
  usability, not the modal itself. See `EXPORT-LIFECYCLE-MATRIX.md`.

---

## Development & CI

Dev tooling only — **the published site has no runtime dependency**. Node 20+.

```bash
npm install            # dev tools (html-validate, prettier, eslint, playwright)
npm run audit          # structural audit — runs with plain node, no install
npm run serve          # local static server at http://localhost:8080
npm run validate:html  # HTML validation (html-validate)
npm run format:check   # Prettier check (tooling + docs; site source is not reformatted)
npm run lint           # ESLint (Node tooling)
npm run test:smoke     # Playwright smoke tests (desktop + mobile)
npm run check          # audit + html-validate + format:check
npm run check:all      # everything above + lint + smoke
```

`.github/workflows/ci.yml` runs the audit, validators and smoke tests on every
push/PR, then deploys to GitHub Pages on `main`. The audit treats intentionally
"Coming Soon" routes as valid, so a disabled planned route never fails CI.

---

## Documentation set

- `CHANGELOG.md` — changes by page and quality domain, per pass.
- `QA-REPORT.md` — tests, widths/engines, results, limitations.
- `REMOVED-CODE.md` — deletions/replacements and the evidence they were safe.
- `ROUTE-MANIFEST.md` — every page, anchor, future route and availability.
- `PERFORMANCE-MATRIX.md` — normalized transfer/CLS measurements.
- `EXPORT-LIFECYCLE-MATRIX.md` — the print/export engine and its lifecycle tests.
- `VERSION` — current release identifier.
