# WX 2026 — EXPORT LIFECYCLE MATRIX (Pass 7.1)

Repair of the release-blocking Print / Download-PDF freeze on `setlist.html`,
`lyrics.html` (and the related `window.print()` path on `playbook.html`).

## 1. The shared code path (before)

The Print and Download-PDF controls on Setlist and Lyrics called **one shared
helper** (`doExport(act,…)` → the non-`word` branch on Lyrics; `wxOpenPrint()`
on Setlist). That helper did:

```
var w = window.open('', '_blank');     // new about:blank popup window
w.document.open();
w.document.write(buildExportDocument(...));   // full export HTML written in
w.document.close();
w.focus();
setTimeout(function(){ w.print(); }, 350);    // print the popup
```

- **Shared function:** yes — Print and PDF are the *same* path; **PDF is merely
  Print with a "Save as PDF" page title/hint**, not a real PDF file.
- **`window.open()`:** yes (`'', '_blank'`). **`document.write()`:** yes.
  **`window.print()`:** yes, on the popup. **iframe:** no.
- Did **not** replace/clone `document.body`, inject overlays, or modify
  `html`/`body` on the parent directly, and did not depend on `afterprint`.

**Download Word** used a completely separate path — build HTML → `Blob` →
`URL.createObjectURL` → a temporary `<a download>` click. No window, no print.
**That is why Word never froze.**

`playbook.html` used a third, different pattern: build a hidden `#printDoc` in
the live page, then **`window.print()` on the parent** with an
`@media print{ body>*{display:none} #printDoc{display:block} }` stylesheet.

## 2. Root cause (before → after)

**Before.** The popup is an `about:blank` window created by `window.open`,
same-origin, populated with `document.write`. It shares the opener's renderer
process. When the modal print dialog for that popup is **cancelled**, the
opener's input/compositor can wedge: mouse hover, click, wheel, scrollbar,
Page Down, arrows and Space all stop responding, and a refresh can paint only
the background. Because the popup was `document.write`n (never navigated), its
`afterprint` / `pagehide` / `unload` never fire reliably, so nothing tears the
popup down — repeated attempts **accumulate orphan popups** (reproduced below:
the old code left **2 open popup windows** after 3 prints). Word avoided all of
this because it never opens a window or calls print.

This was present in the **original pre-audit files** and carried through Pass 7 —
it is not introduced by Pass 7. The Pass 7 `beforeprint`/`afterprint` details
handler on the parent is **not** the button-path amplifier: instrumentation
showed the parent's `beforeprint`/`matchMedia('print')` never fire when the
child popup prints.

**After.** Print and PDF now render the standalone export document in a
**hidden, offscreen, `pointer-events:none` iframe** (a child browsing context in
the *same* document) and print only that iframe. No popup, no `document.write`
to a foreign window, no mutation of the live page. `window.print()` is
synchronous/blocking, so teardown runs right after it returns; five independent,
idempotent cleanup triggers guarantee no state is ever left behind.

## 3. Live-page state after a real Print/PDF (proof of usability)

Verified with a **real** Chromium print pathway (`--kiosk-printing`, headed
under Xvfb — the real print lifecycle, not print-media emulation) and via the
real export code path across repeated cycles:

| Probe | OLD (popup) | NEW (iframe) |
|-------|-------------|--------------|
| popups opened / left open | 2 opened, **2 left open** | **0 / 0** |
| `document.body` visibility | visible | visible |
| `body` `pointer-events` | (wedged in real Chrome) | **auto** |
| `body` `overflow` / `opacity` | — | visible / 1 |
| `matchMedia('print').matches` after | — | **false** |
| `elementFromPoint(centre)` | — | **real content** (BUTTON/DIV/P) |
| leftover print iframe | n/a | **0** |
| original body nodes intact | — | **yes** (child count unchanged) |
| wheel scroll after | (dead) | **works** |
| TOC click after | — | navigates to `#item-1` |
| search after | — | returns results |
| prev/next after | — | advances |
| JS errors / failed requests | 0 | **0** |

After a single real print the parent is **fully usable**: wheel scroll, TOC
navigation, search and prev/next all respond; body is visible with
`pointer-events:auto`; the centre of the viewport resolves to real content, not
an overlay.

## 4. Architecture of the repair

`assets/js/wx-export.js` — one shared engine used by Setlist, Lyrics and
Playbook:

1. `WXExport.printDocument(html, {onError})` builds nothing destructive — it
   creates a hidden offscreen iframe, `write()`s the **complete standalone**
   export document into it, waits for the iframe's `load` + `document.fonts.ready`
   (≤400 ms fallback), focuses the iframe and calls **`iframe.contentWindow.print()`**.
2. The parent page is never touched: no `document.body` replacement, no
   whole-body `visibility:hidden`, no `pointer-events:none`, no lingering
   `overflow:hidden`, no full-screen overlay, no dependence on `afterprint`, and
   no coupling to a child popup after cancellation.
3. **PDF** uses the same isolated print with a visible "Choose *Save as PDF* in
   the print destination" hint — it is honestly a print-to-PDF flow, not a
   claimed direct file download.
4. All lyric sections still appear in print because the **standalone export
   document is already fully expanded** (flat sections, no `<details>`), so the
   131 live `<details>` are not mutated for button exports. Native Ctrl+P on the
   live page keeps a hardened expand/restore (see §5).

## 5. Recovery & cleanup

`WXExport.cleanup()` is a single **idempotent** function (safe to run repeatedly)
that removes any print iframe(s) and strips stale legacy print classes/inline
locks/overlays. It runs from: normal completion (post-`print()` timeout),
cancellation (parent `focus`), the frame's `afterprint` / `pagehide` / `unload`,
the print media query returning to `false`, a far backstop timeout, the start of
every new `printDocument()` call, module load (**defensive startup cleanup**),
and parent `pageshow` (bfcache restore). The Lyric Book's native-Ctrl+P
detail-expander now restores from **four** independent triggers (`afterprint`,
print-media→false, `focus`, `pageshow`) so it never depends exclusively on
`afterprint`.

## 6. Acceptance tests

Parent-safety across conditions (real export code path; 2 cycles each; verified:
0 popups, 0 leftover frames, `pointer-events:auto`, body visible, real
`elementFromPoint`, `matchMedia('print')` false, wheel scroll works, body node
count unchanged, 0 JS errors, 0 failed requests):

| Scenario | Setlist | Lyrics |
|----------|:-------:|:------:|
| PDF — baseline | PASS | PASS |
| Print — baseline | PASS | PASS |
| PDF — after search | PASS | PASS |
| Print — after phase selection | — | PASS |
| Print — at direct item anchor | PASS | PASS |
| Print — with lyric details open | — | PASS |
| PDF/Print — reduced motion | PASS | PASS |
| **Result** | **all PASS** | **all PASS** |

Additional verification:
- **5× repeated Print cycles** and **5× repeated PDF cycles** on Setlist,
  Lyrics and Playbook — parent pristine every cycle (0 popups, 0 frames left).
- **Real kiosk-print lifecycle** (headed/Xvfb): single real print → parent
  fully usable; OLD build left 2 orphan popups, NEW leaves 0.
- **Popup allowed / blocked:** not applicable to the new engine — it never opens
  a popup, so a popup blocker cannot affect or break export. (A strict
  improvement over the old "please allow pop-ups" failure mode.)
- **Download Word:** unchanged Blob-download path; verified still downloading
  `WX2026_Lyric_Book.doc` and `WX2026_Setlist.doc`.
- **Content:** 0 differences versus the Pass 7 render (export engine only).
- **Regression:** full interaction matrix 39/39; 0 JS errors and 0 failed
  requests across all ten pages.

### Honest limitation
A browser's **native** print dialog cannot be programmatically driven or
cancelled by automation, so the modal-cancel keystroke itself is not scripted.
The failure surface — whether the **live parent page remains usable after a real
print and return** — was exercised with the real Chromium print pathway
(`--kiosk-printing`) and the real export code path, not print-media emulation. A
final manual Print→Cancel in a normal browser is recommended as a last check.

## 7. Broader audit (all ten pages)

Grep of every page for `window.print` / `window.open('','_blank')` /
`document.write` / `.print()`:

| Page | Legacy print/export? | Action |
|------|----------------------|--------|
| setlist.html | popup + `document.write` + `w.print()` | migrated to `WXExport` |
| lyrics.html | popup + `document.write` + `w.print()` | migrated to `WXExport` |
| playbook.html | parent `window.print()` + `#printDoc` + body-hiding print CSS | migrated to `WXExport`; native Ctrl+P kept non-blank via a `beforeprint` builder |
| index, concept, creative-direction, theme-brief, bible-study, music-workshop, blueprint | none | no change |

Download Word remains unchanged and functional on Setlist and Lyrics.
