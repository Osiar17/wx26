/* ============================================================
   WX 2026 — Shared global behaviour
   Truly global behaviour only (the day countdown shown in the
   shared header). Page-specific behaviour stays in each page.
   Loaded with `defer`, reads the canonical date from
   window.WX.eventDateUTCParts (site-config.js).
   ============================================================ */
(function () {
  "use strict";

  function eventTarget() {
    var p = (window.WX && window.WX.eventDateUTCParts) || [2026, 10, 29];
    return new Date(p[0], p[1], p[2]);
  }

  /* Days remaining until the event date, floored at 0. */
  function daysRemaining() {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.round((eventTarget() - today) / 86400000));
  }

  function renderCountdown() {
    var days = daysRemaining();
    // Header countdown chips (all shared headers).
    var nums = document.querySelectorAll(".cd-num");
    for (var i = 0; i < nums.length; i++) nums[i].textContent = days;
    // Legacy cover countdown element (index hero), if present.
    var legacy = document.getElementById("days");
    if (legacy) legacy.textContent = days;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCountdown);
  } else {
    renderCountdown();
  }
})();

/* ============================================================
   Reduced-motion (Pass 5→6): JS-driven smooth scrolling is neutralised at each
   call site via window.WX.smoothBehavior() (defined in site-config.js). No
   native scrollTo/scrollBy/scrollIntoView override is used, so unrelated
   scrolling is never intercepted. window.WX.reducedMotion() kept for back-compat.
   ============================================================ */
(function () {
  "use strict";
  window.WX = window.WX || {};
  if (!window.WX.reducedMotion) {
    window.WX.reducedMotion = function () {
      return !!(window.WX.prefersReducedMotion
        ? window.WX.prefersReducedMotion()
        : (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches));
    };
  }
})();
