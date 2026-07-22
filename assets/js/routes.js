/* ============================================================
   WX 2026 — Routes & availability (route source of truth)
   Canonical internal routes, anchors and availability states —
   each defined once here. Repository-subpath-safe (relative URLs).
   Load AFTER site-config.js:
     <script src="assets/js/routes.js"></script>
   ============================================================ */
(function (root) {
  "use strict";
  var WX = root.WX || (root.WX = {});

  /* Canonical named routes (relative, subpath-safe). */
  WX.routes = {
    home: "index.html",
    hub: "index.html#hub",
    concept: "concept.html",
    creativeDirection: "creative-direction.html",
    musicalIdentity: "creative-direction.html#musical",
    visualIdentity: "creative-direction.html#identity",
    themeBrief: "theme-brief.html",
    setlist: "setlist.html",
    worshipRoadmap: "setlist.html#roadmap-intro",
    lyrics: "lyrics.html",
    playbook: "playbook.html",
    blueprint: "blueprint.html",
    musicWorkshop: "music-workshop.html",
    bibleStudy: "bible-study.html"
  };

  /* Creative Direction deep-link segments (hash routing). */
  WX.creativeDirectionSegments = ["story", "elements", "mood", "identity", "musical"];

  /* Planned pages that are intentionally NOT yet built — a linked route
     exists but the destination page does not, so it renders "Coming Soon". */
  WX.pendingRoutes = [
    "flow-map.html",
    "production-cue.html",
    "running-order.html",
    "experience-report.html"
  ];

  /* True when href targets a planned-but-absent page. */
  WX.isPending = function (href) {
    if (!href) return false;
    var base = String(href).split(/[?#]/)[0];
    return WX.pendingRoutes.indexOf(base) !== -1;
  };
})(typeof window !== "undefined" ? window : this);
