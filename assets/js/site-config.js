/* ============================================================
   WX 2026 — Site configuration (content source of truth)
   Canonical theme, phases, palette, date and labels — each value
   defined once here. Repository-subpath-safe. Load with a RELATIVE
   src BEFORE routes.js and any page script:
     <script src="assets/js/site-config.js"></script>
   Consumers read window.WX.* — do not fork these values into pages.
   ============================================================ */
(function (root) {
  "use strict";
  var WX = root.WX || (root.WX = {});

  /* Release identifier — bumped each pass. Also recorded in README.md, VERSION
     and CHANGELOG.md. Format: 2026.<pass>[.patch]. */
  WX.version = "2026.9.0";
  WX.releaseName = "Pass 9 — independent final QA & release";

  WX.theme = "YES: Not My Will, But Yours.";
  WX.themePlain = "YES: Not My Will, But Yours";
  WX.parentMinistry = "The Flow Experience";

  /* Palette — canonical brand tokens (mirrors assets/css/tokens.css). */
  WX.palette = {
    wildflowerPurple: "#7A4CB8",
    wildflowerPurpleRGB: "122,76,184"
  };
  /* Back-compat accessors (single underlying definition above). */
  WX.wildflowerPurple = WX.palette.wildflowerPurple;
  WX.wildflowerPurpleRGB = WX.palette.wildflowerPurpleRGB;

  /* Event date — the single canonical experience date. */
  WX.eventDate = { weekday: "Sunday", day: 29, month: "November", year: 2026 };
  WX.eventDateText = "Sunday, 29 November 2026";
  WX.eventDateISO = "2026-11-29";
  /* Month is 0-indexed for Date(): November = 10. */
  WX.eventDateUTCParts = [2026, 10, 29];

  WX.preservedLine = "So the only surprise is how God shows up.";

  /* Wade-In dimensions ("the minister" describes the integrated outcome only). */
  WX.wadeIn = ["The Christian", "The Musician", "The Performer"];

  /* Four phases in order. Names + subtitles are canonical and exact. */
  WX.phases = [
    { roman: "I",   name: "God Is Good",        subtitle: "The Threshold of Goodness" },
    { roman: "II",  name: "God Helps Us Yield", subtitle: "The Help in the Dark" },
    { roman: "III", name: "We Say Yes",         subtitle: "The Will Laid Down" },
    { roman: "IV",  name: "God Is Glorified",   subtitle: "The Gateway to Glory" }
  ];

  /* Reduced-motion helpers (shared, non-invasive — no native scroll override). */
  WX.prefersReducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  WX.smoothBehavior = function () { return WX.prefersReducedMotion() ? "auto" : "smooth"; };
})(typeof window !== "undefined" ? window : this);
