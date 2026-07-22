/* ============================================================
   WX 2026 — safe print/export engine (Pass 7.1)

   Root cause this replaces: Setlist and Lyrics printed by opening an
   `about:blank` popup via window.open('', '_blank'), writing the export HTML
   with document.write(), then calling the popup's print(). That popup shares the
   opener's renderer; when the modal print dialog is cancelled the opener's input
   and compositor can wedge (mouse/keyboard/scroll dead, blank after refresh), and
   because the popup was document.write()n its afterprint/pagehide never fire, so
   nothing cleans up. Playbook used parent window.print() with `body>*{display:none}`
   print CSS — a live-page mutation. Both are replaced by this engine.

   Design: render the full standalone export document inside a hidden, offscreen
   IFRAME (a separate browsing context in THIS document), wait for its fonts and
   content, then print ONLY that iframe. The parent page is never mutated — no
   body hiding, no pointer-events, no overflow lock, no overlay, no popup. Cleanup
   is a single idempotent function fired from many lifecycle points, so a
   cancelled dialog can never leave state behind.
   ============================================================ */
(function () {
  "use strict";
  var FRAME_CLASS = "wx-print-frame";

  /* ---- idempotent cleanup: safe to run any number of times ---- */
  function cleanup() {
    try {
      var frames = document.querySelectorAll("iframe." + FRAME_CLASS);
      for (var i = 0; i < frames.length; i++) {
        var f = frames[i];
        if (f && f.parentNode) f.parentNode.removeChild(f);
      }
    } catch (e) {}
    /* Remove any stale legacy print state that an older build might have left on
       the live page (defensive — these should never be set by this engine). */
    try {
      var de = document.documentElement, bd = document.body;
      [de, bd].forEach(function (el) {
        if (!el) return;
        el.classList.remove("wx-printing", "is-printing", "print-active");
        if (el.style && el.style.pointerEvents === "none") el.style.pointerEvents = "";
        if (el.style && el.style.visibility === "hidden") el.style.visibility = "";
        if (el.style && el.style.overflow === "hidden" && el.getAttribute("data-wx-print-lock")) {
          el.style.overflow = ""; el.removeAttribute("data-wx-print-lock");
        }
      });
      var stray = document.querySelectorAll(".wx-print-overlay,[data-wx-print-overlay]");
      for (var j = 0; j < stray.length; j++) if (stray[j].parentNode) stray[j].parentNode.removeChild(stray[j]);
    } catch (e2) {}
  }

  /* ---- print a complete standalone HTML document in isolation ---- */
  function printDocument(html, opts) {
    opts = opts || {};
    cleanup(); /* never keep two frames around */

    var iframe = document.createElement("iframe");
    iframe.className = FRAME_CLASS;
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    /* Offscreen + inert, but still laid out so it renders/fonts load. Not
       display:none (which can suppress printing in some engines). */
    iframe.style.cssText =
      "position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;opacity:0;pointer-events:none;";

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      /* Delay removal slightly so the spawned print job is not cancelled by
         tearing down its document too early. */
      setTimeout(function () {
        try { if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe); } catch (e) {}
      }, 500);
      /* Detach the parent-side safety nets. */
      try { window.removeEventListener("focus", onParentBack); } catch (e) {}
      if (mq) { try { (mq.removeEventListener ? mq.removeEventListener.bind(mq, "change") : mq.removeListener.bind(mq))(onMq); } catch (e) {} }
    }

    function onParentBack() { finish(); }
    var mq = null;
    function onMq(e) { if (!e.matches) finish(); }

    document.body.appendChild(iframe);
    var win = iframe.contentWindow;
    var idoc = iframe.contentDocument || (win && win.document);
    if (!win || !idoc) { cleanup(); if (opts.onError) opts.onError(new Error("iframe unavailable")); return; }

    function go() {
      var printed = false;
      try {
        win.focus();
        /* Child + parent lifecycle nets. NONE is relied on exclusively — whichever
           fires first triggers the idempotent finish(): afterprint/pagehide/unload
           on the isolated frame, the parent regaining focus when the dialog closes,
           and the print media query flipping back to false. */
        try { win.addEventListener("afterprint", finish); } catch (e) {}
        try { win.addEventListener("pagehide", finish); } catch (e) {}
        try { win.addEventListener("unload", finish); } catch (e) {}
        window.addEventListener("focus", onParentBack);
        if (window.matchMedia) {
          mq = win.matchMedia ? win.matchMedia("print") : window.matchMedia("print");
          try { (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(onMq); } catch (e) {}
        }
        /* window.print() is synchronous/blocking in Chromium and most engines: it
           returns only AFTER the dialog is confirmed or cancelled. So the primary,
           most reliable teardown is scheduled right after it returns (a short delay
           lets the spawned job dispatch before the frame is removed). The listeners
           above cover engines where print() is asynchronous. */
        win.print();
        printed = true;
      } catch (e) {
        if (opts.onError) opts.onError(e);
      }
      setTimeout(finish, printed ? 800 : 1000);
      /* Far backstop in case an async engine never fires any signal. */
      setTimeout(finish, 120000);
    }

    /* Write the standalone document, then wait for load + fonts before printing. */
    try {
      idoc.open();
      idoc.write(html);
      idoc.close();
    } catch (e) { cleanup(); if (opts.onError) opts.onError(e); return; }

    function whenReady() {
      var fonts = idoc.fonts;
      if (fonts && fonts.ready && typeof fonts.ready.then === "function") {
        var settled = false;
        fonts.ready.then(function () { if (!settled) { settled = true; go(); } },
                         function () { if (!settled) { settled = true; go(); } });
        /* don't wait forever on fonts (export docs use system/fallback faces) */
        setTimeout(function () { if (!settled) { settled = true; go(); } }, 400);
      } else {
        go();
      }
    }
    if (idoc.readyState === "complete") { setTimeout(whenReady, 0); }
    else { try { win.addEventListener("load", whenReady); } catch (e) { setTimeout(whenReady, 300); } }
  }

  /* Defensive startup cleanup — clears any stale legacy export state without
     touching normal rendering. */
  cleanup();
  /* Also clean up when the page is restored from the bfcache. */
  window.addEventListener("pageshow", cleanup);

  window.WXExport = { printDocument: printDocument, cleanup: cleanup };
})();
