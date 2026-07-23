/* WX 2026 — restrained reader navigation (Pass 9.1L rebuild).
 *
 * Exactly two visible parts, nothing in the body of the page:
 *   1. a small "All Pages" arrow beside the existing Workspace control, opening a
 *      compact anchored dropdown of the nine reader-facing pages;
 *   2. dainty Previous / Next controls INSIDE the footer identity row, between the
 *      YES Crimson and CCC marks — two destinations only, no current-page title.
 *
 * The reader sequence branches at Creative Direction (Visual Identity → Playbook,
 * Musical Identity → Blueprint) and re-merges at Setlist, which reads a validated
 * ?from={playbook|blueprint} to pick its Previous. It never touches the Workspace
 * card order, page content, readers, exports, Setlist/Lyrics data, or routing.
 */
(function () {
  "use strict";

  // Reader-facing order + labels (approved public labels; real filenames).
  var PAGES = [
    { route: "concept.html", label: "The Worship Experience Concept" },
    { route: "theme-brief.html", label: "WX Theme Brief" },
    { route: "creative-direction.html", label: "WX Creative Direction" },
    { route: "playbook.html", label: "Playbook" },
    { route: "blueprint.html", label: "Blueprint" },
    { route: "setlist.html", label: "Setlist" },
    { route: "lyrics.html", label: "Lyrics Book" },
    { route: "music-workshop.html", label: "Music Workshop" },
    { route: "bible-study.html", label: "Bible Study" },
  ];
  var byRoute = {};
  PAGES.forEach(function (p) {
    byRoute[p.route] = p;
  });
  var CD_SEGMENTS = { story: 1, elements: 1, mood: 1, identity: 1, musical: 1 };

  function cur() {
    var f = (location.pathname.split("/").pop() || "").toLowerCase();
    return f || "index.html";
  }
  var CUR = cur();

  function dest(route, label) {
    return { route: route, label: label };
  }

  // Compute the two footer destinations for the current page + live context.
  function computeNav() {
    var hash = (location.hash || "").replace(/^#/, "").toLowerCase();
    var params = new URLSearchParams(location.search);
    switch (CUR) {
      case "concept.html":
        return { prev: null, next: dest("theme-brief.html", "WX Theme Brief") };
      case "theme-brief.html":
        return {
          prev: dest("concept.html", "The Worship Experience Concept"),
          next: dest("creative-direction.html", "WX Creative Direction"),
        };
      case "creative-direction.html": {
        var prev = dest("theme-brief.html", "WX Theme Brief");
        if (hash === "identity") return { prev: prev, next: dest("playbook.html", "Playbook") };
        if (hash === "musical") return { prev: prev, next: dest("blueprint.html", "Blueprint") };
        // story / elements / mood / none: page-level Next stays unavailable so the
        // internal Explore Sections journey is not overridden.
        return { prev: prev, next: null };
      }
      case "playbook.html":
        return {
          prev: dest("creative-direction.html#identity", "WX Creative Direction"),
          next: dest("setlist.html?from=playbook", "Setlist"),
        };
      case "blueprint.html":
        return {
          prev: dest("creative-direction.html#musical", "WX Creative Direction"),
          next: dest("setlist.html?from=blueprint", "Setlist"),
        };
      case "setlist.html": {
        var from = params.get("from");
        var prevRoute = from === "blueprint" ? "blueprint.html" : "playbook.html"; // default Playbook
        var prevLabel = from === "blueprint" ? "Blueprint" : "Playbook";
        return { prev: dest(prevRoute, prevLabel), next: dest("lyrics.html", "Lyrics Book") };
      }
      case "lyrics.html":
        return {
          prev: dest("setlist.html", "Setlist"),
          next: dest("music-workshop.html", "Music Workshop"),
        };
      case "music-workshop.html":
        return {
          prev: dest("lyrics.html", "Lyrics Book"),
          next: dest("bible-study.html", "Bible Study"),
        };
      case "bible-study.html":
        return { prev: dest("music-workshop.html", "Music Workshop"), next: null };
      default:
        return null; // index / 404 etc. have no reader-sequence footer nav
    }
  }

  function el(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs)
      Object.keys(attrs).forEach(function (k) {
        e.setAttribute(k, attrs[k]);
      });
    return e;
  }

  /* ---- Footer Previous / Next (between the identity marks) ---- */
  function sideCtrl(kind, d) {
    // kind: "prev" | "next". Enabled → real anchor; boundary → non-link, not tabbable.
    if (!d) {
      var span = el("span", "wx-fnav__btn wx-fnav__" + kind + " is-off", { "aria-disabled": "true" });
      span.innerHTML =
        kind === "prev"
          ? '<span class="wx-fnav__ar" aria-hidden="true">&larr;</span>'
          : '<span class="wx-fnav__ar" aria-hidden="true">&rarr;</span>';
      return span;
    }
    var a = el("a", "wx-fnav__btn wx-fnav__" + kind, {
      href: d.route,
      rel: kind,
      "aria-label": (kind === "prev" ? "Previous: " : "Next: ") + d.label,
    });
    var shortLbl = esc(shorten(d.label));
    if (kind === "prev") {
      a.innerHTML =
        '<span class="wx-fnav__ar" aria-hidden="true">&larr;</span><span class="wx-fnav__lbl">' + shortLbl + "</span>";
    } else {
      a.innerHTML =
        '<span class="wx-fnav__lbl">' + shortLbl + '</span><span class="wx-fnav__ar" aria-hidden="true">&rarr;</span>';
    }
    return a;
  }
  function renderFooterNav() {
    var mount = document.querySelector("[data-wx-fnav]");
    if (!mount) return;
    var nav = computeNav();
    if (!nav) {
      mount.hidden = true;
      return;
    }
    mount.hidden = false;
    mount.innerHTML = "";
    mount.appendChild(sideCtrl("prev", nav.prev));
    mount.appendChild(sideCtrl("next", nav.next));
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }
  // Compact visible label for the between-marks controls (full name stays on aria-label).
  function shorten(label) {
    if (label === "The Worship Experience Concept") return "Concept";
    return String(label).replace(/^WX\s+/, "");
  }

  /* ---- All Pages dropdown (beside Workspace) ---- */
  var menu = { trigger: null, panel: null, open: false };
  function buildMenu() {
    if (menu.panel) return;
    var panel = el("div", "wx-menu", { id: "wxAllPages", role: "navigation", "aria-label": "All pages", hidden: "" });
    var ul = el("ul", "wx-menu__list");
    PAGES.forEach(function (p) {
      var li = el("li");
      var a = el("a", "wx-menu__link", { href: p.route });
      a.textContent = p.label;
      if (p.route === CUR) {
        a.setAttribute("aria-current", "page");
        var badge = el("span", "wx-menu__here");
        badge.textContent = "Current";
        a.appendChild(badge);
      }
      li.appendChild(a);
      ul.appendChild(li);
    });
    panel.appendChild(ul);
    menu.panel = panel;
  }
  function placeMenu() {
    // anchored beneath the arrow, aligned to the right edge of the action group
    var group = menu.control || menu.trigger.parentNode;
    if (getComputedStyle(group).position === "static") group.style.position = "relative";
    group.appendChild(menu.panel);
  }
  function openMenu() {
    buildMenu();
    if (!menu.panel.parentNode) placeMenu();
    menu.panel.hidden = false;
    menu.open = true;
    menu.trigger.setAttribute("aria-expanded", "true");
    var first = menu.panel.querySelector('[aria-current="page"], .wx-menu__link');
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(refocus) {
    if (!menu.open) return;
    menu.panel.hidden = true;
    menu.open = false;
    menu.trigger.setAttribute("aria-expanded", "false");
    if (refocus && menu.trigger.focus) menu.trigger.focus();
  }
  function injectTrigger() {
    // Group the trigger WITH the existing Workspace link in one right-side action
    // group — never as an independent middle flex child (that landed in the centre,
    // colliding with the absolutely-centred countdown). Order stays [Workspace][▾].
    var header = document.querySelector(".topbar, .site-nav");
    var ws = header && header.querySelector(".site-nav__ws");
    if (!ws || document.querySelector(".wx-header-actions")) return;
    var parent = ws.parentNode;
    var wrap = el("div", "wx-header-actions");
    parent.insertBefore(wrap, ws); // occupy the Workspace link's former slot
    wrap.appendChild(ws); // Workspace first in DOM + visual order
    var control = el("div", "wx-pages-control"); // relative anchor for the dropdown
    var btn = el("button", "wx-allpages", {
      type: "button",
      "aria-haspopup": "true",
      "aria-expanded": "false",
      "aria-controls": "wxAllPages",
      "aria-label": "Open all pages",
      title: "All pages",
    });
    btn.innerHTML = '<span class="wx-allpages__ar" aria-hidden="true">&#9662;</span>';
    control.appendChild(btn);
    wrap.appendChild(control); // arrow second, to the right of Workspace
    menu.trigger = btn;
    menu.control = control;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      menu.open ? closeMenu(false) : openMenu();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (menu.open && e.key === "Escape") {
      e.preventDefault();
      closeMenu(true);
    }
  });
  document.addEventListener("click", function (e) {
    if (menu.open && menu.trigger && !e.target.closest(".wx-menu") && e.target !== menu.trigger && !menu.trigger.contains(e.target)) {
      closeMenu(false);
    }
  });

  function boot() {
    renderFooterNav();
    injectTrigger();
    // Creative Direction: keep the footer Next/Prev in step with the active segment.
    if (CUR === "creative-direction.html") {
      window.addEventListener("hashchange", renderFooterNav);
      // Explore Sections / seg buttons change the hash → hashchange covers them; also
      // re-render shortly after load in case the initial segment resolves post-boot.
      requestAnimationFrame(renderFooterNav);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.WXReaderNav = { pages: PAGES, current: CUR, compute: computeNav };
})();
