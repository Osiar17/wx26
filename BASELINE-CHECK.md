# WX 2026 — BASELINE CHECK (before Pass 9.1A)

Authoritative baseline: **v2026.9.0**, the last accepted / currently deployed
release (`C:\Users\HP\Downloads\Claude!\wx2026`). Verified and duplicated into an
isolated working copy (`wx2026-pass-9.1A`); the authoritative folder was not
modified. This record is the state **before** any Pass 9.1A edit.

## Contents verified present
- `index.html` + all HTML pages (concept, creative-direction, theme-brief,
  setlist, lyrics, playbook, blueprint, music-workshop, bible-study) and **404.html**.
- Complete `assets/` — **107 WebP** + **108 retained `.jpg`/`.png` fallbacks**,
  plus fonts/video/SVG.
- Shared Setlist/Lyrics data: `assets/js/wx-music-data.js` (WX_CATALOGUE = 28
  items) + `assets/js/wx-lyrics-data.js`.
- Safe iframe export engine: `assets/js/wx-export.js`.
- GitHub Actions: `.github/workflows/ci.yml`.
- Tools/tests: `tools/{audit.mjs,serve.mjs,smoke.spec.mjs}` + dev configs.
- Pass 9 reports + `VERSION`; version **2026.9.0** consistent in VERSION,
  package.json, package-lock.json, README and release reports.

## Baseline check results (working copy, no edits)
| Check | Command | Result |
|-------|---------|--------|
| Structural audit | `npm run audit` | **PASS** — 0 errors, 0 warnings |
| HTML validation | `npm run validate:html` | **PASS** (11 files) |
| Formatting | `npm run format:check` | **PASS** |
| Lint | `npm run lint` | **PASS** |
| Smoke tests | `npm run test:smoke` | **PASS** — 24 / 24 |

Baseline clean and green. Pass 9.1A (WX monogram icon correction only) proceeds
from this state.
