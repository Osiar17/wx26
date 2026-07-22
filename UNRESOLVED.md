# WX 2026 — UNRESOLVED (owner decisions required)

Everything technically fixable was fixed in Pass 9. The following remain open
because they need a decision or input only the project owner can give — none is a
code defect.

## 1. Production URL — Open Graph / Twitter / canonical tags

These social/canonical tags are deliberately **not** present because the final
production URL and per-page public-visibility are not yet decided. Once the
domain is fixed, add per public page: `<link rel="canonical">`, `og:title`,
`og:description`, `og:image`, `twitter:card`. **Do not** add social previews to
Playbook/Blueprint (they carry internal task data). Owner input needed: the
production origin and which pages are public.

## 2. Confirm the visibility / indexing defaults

Current policy (per-page `robots` meta + `robots.txt`): public — index, concept,
theme-brief, setlist, music-workshop, bible-study; **noindex** —
creative-direction, blueprint, playbook (operational) and lyrics (copyright).
These are conservative defaults chosen without an explicit public decision.
Owner confirmation needed before launch, especially: is the full Lyric Book
cleared (licensing) for public indexing, and should the operational workspaces
stay private?

## 3. Firefox / Safari (WebKit) verification — environment limitation

Cross-browser testing was completed on Chromium/Blink. Firefox and WebKit
**could not be run in this environment**: the Playwright browser-download host is
not permitted here (HTTP 403), so those engines could not be installed. All Pass
9 changes are standards-based CSS/HTML/vanilla JS with graceful fallbacks, so no
engine-specific issue is expected, but a **manual spot-check on current Firefox
and Safari is recommended before release** (particularly the `<picture>`/WebP
fallback, the print/export dialog, and the `inert` floating bar on Playbook).
This is a testing-coverage limitation, not a known defect.
