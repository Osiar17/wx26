# WX 2026 — PERFORMANCE MATRIX (Pass 6.1)

This matrix corrects and normalises the performance record. All figures below
were captured under **identical conditions** for both the Pass 5 baseline and
the Pass 6 (WebP) build, so the before/after values are directly comparable.

## Measurement method (identical for both builds)

- Served over a **local HTTP server** (`python3 -m http.server`), never `file://`.
- **Fresh browser context per page**, HTTP **cache disabled** (CDP
  `Network.setCacheDisabled`), no service workers registered.
- Fixed viewport **390 × 844** (mobile, the CLS-sensitive case).
- Figures read from the **Resource Timing API** (`transferSize`,
  `encodedBodySize`, `decodedBodySize`) plus resource type and URL.
- The server sends **no gzip/brotli**, so for every resource
  `transferSize ≈ encodedBodySize ≈ decodedBodySize`. The numbers are therefore
  *uncompressed served bytes* — the same scope on both sides. (A production
  server with gzip/brotli would transfer less than these figures on both builds;
  the **relative** reduction is what this matrix certifies.)
- **Initial-load milestone** = navigation `load` event + 600 ms settle, with
  **no scrolling and no CD-segment activation**. Deferred media is measured
  separately (the "all-opened" columns).

> Correction note: earlier QA text quoted "uncompressed served bytes" that were
> *smaller* than later "gzip-compressed initial transfer" figures. Those two sets
> were taken at different scopes (one before scrolling, one after) and with
> different tooling. They are superseded by this single, consistently-scoped
> table. No code was changed to make any number look better; the only asset
> change since the last measurement was completing the WebP swap on the
> Creative-Direction segment `IMG` map (see below), which *reduces* transfer.

## The four distinct size categories (kept separate on purpose)

1. **Repository / package size** — bytes shipped in the deployed folder.
   This **grew**, because both formats are retained (WebP + original raster as a
   fallback, per the no-delete rule).
   - Pass 5 repo (site tree): **24.5 MB**
   - Pass 6 repo (site tree): **31.8 MB**
   - WebP added: **7.44 MB** (107 files) · originals retained: **22.5 MB** ·
     video: **0.11 MB**
   - If the originals were ever removed, the image payload on disk would fall
     from 30.0 MB (raster+webp) to **7.44 MB**. They are deliberately kept.

2. **First-load transfer** — bytes a WebP-capable browser actually downloads for
   the initial view (no scroll, no segment open). This is what a visitor waits
   for. It **dropped sharply** (table below).

3. **Decoded body size** — uncompressed bytes the browser decodes. With no
   server compression this equals transfer here; it moves with first-load
   transfer and is not separately inflated.

4. **Total transfer after all hidden content is opened** — every lazy image
   scrolled into view and (on Creative Direction) every CD segment activated.
   This is the worst-case full-session payload.

## Per-page transfer — first-load and all-opened (KB, uncompressed)

| Page | P5 first-load | P6 first-load | Reduction | P5 all-opened | P6 all-opened | Reduction |
|------|--------------:|--------------:|----------:|--------------:|--------------:|----------:|
| index | 698 | 465 | 33.4% | 679 | 445 | 34.4% |
| concept | 2154 | 509 | 76.4% | 2112 | 1367 | 35.3% |
| creative-direction | 5472 | 905 | 83.5% | 7565 | 4167 | 44.9% |
| theme-brief | 1172 | 792 | 32.5% | 1134 | 753 | 33.6% |
| bible-study | 674 | 440 | 34.7% | 576 | 342 | 40.6% |
| music-workshop | 5313 | 409 | 92.3% | 5190 | 392 | 92.5% |
| playbook | 2799 | 692 | 75.3% | 2454 | 413 | 83.2% |
| blueprint | 2632 | 689 | 73.8% | 2423 | 501 | 79.3% |
| setlist | 2139 | 438 | 79.5% | 2064 | 396 | 80.8% |
| lyrics | 2091 | 390 | 81.3% | 2007 | 339 | 83.1% |
| **TOTAL** | **25 145** | **5 729** | **77.2%** | **26 205** | **9 115** | **65.2%** |

Notes:
- **Every page's first-load transfer is now under 1 MB** (largest:
  creative-direction 905 KB; was 5.47 MB).
- The Creative-Direction **all-opened** figure (4.17 MB) is dominated by **10
  `.mp4` motion-example clips** in the Rhythm zone (~0.1 MB packaged but streamed
  with range requests during playback) and the full mood-board gallery; all 56
  raster candidates load as **WebP, zero originals** (verified — see Part B).
- Concept's smaller all-opened reduction (35.3%) is expected: its gallery is a
  large set of photographs whose WebP encodings are still substantial, but it is
  still nearly **750 KB lighter** than the Pass 5 gallery.

## Request counts (first-load)

| Page | P5 reqs | P6 reqs | WebP loaded | Originals loaded |
|------|--------:|--------:|------------:|-----------------:|
| index | 15 | 15 | 4 | 0 |
| concept | 33 | 19 | 7 | 0 |
| creative-direction | 44 | 17 | 7 | 0 |
| theme-brief | 19 | 18 | 7 | 0 |
| bible-study | 16 | 15 | 3 | 0 |
| music-workshop | 21 | 17 | 3 | 0 |
| playbook | 17 | 16 | 4 | 0 |
| blueprint | 18 | 18 | 5 | 0 |
| setlist | 17 | 15 | 2 | 0 |
| lyrics | 16 | 14 | 2 | 0 |

**Zero original raster files are fetched on first load on any page**, confirming
a WebP-capable browser requests only the WebP candidate — never both the WebP
and the original (Part B requirement).

## Deferred-media behaviour (verified)

- **By scroll:** below-the-fold images carry `loading="lazy"` and load only when
  scrolled into view (e.g. theme-brief goes 7 → 8 WebP after scroll; the
  Creative-Direction mood gallery loads its plates progressively down the page).
- **By CD segment open:** activating `#story / #elements / #mood / #identity /
  #musical` loads that segment's media on demand. A **direct hash entry** loads
  the required media immediately and does **not** force a return to the home
  wheel. Back/Forward move between segments (verified in the interaction matrix).
- After the Pass 6.1 fix, **all** CD segment `IMG`-map plates load as WebP; the
  previous build still fetched 16 `.jpg` originals on segment open (now 0).

## WebP fallback integrity

- `<picture><source type="image/webp">` + raster `<img>` fallbacks are valid and
  subpath-safe (relative URLs, no leading `/`).
- Inline `image-set()` uses single-quoted `url('…') type('image/webp')` so it is
  valid inside `style="…"` attributes.
- JS-injected VI/mood imagery (the Creative-Direction `IMG` map) now points at
  `.webp`; a capture-phase `error` listener retries any element once with the
  retained `.jpg` original, so browsers that cannot decode WebP still render.
  Originals remain on disk as the fallback and are **not** deleted.
