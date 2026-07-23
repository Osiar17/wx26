/* WX 2026 — shared detail-reader controller (Pass 9.1J).
 *
 * Provides ONLY the behaviour that is genuinely common across the site's
 * detail-panel families: Previous/Next stepping with boundary state, an
 * accurate position indicator, optional Left/Right arrow keys (ignored when a
 * text field or another arrow-consuming control has focus), and — for panels
 * that are genuinely modal — a focus trap, Escape-to-close, background scroll
 * lock and focus restoration.
 *
 * It deliberately does NOT own family data, rendering, visual styling, or
 * active-state/graph synchronisation: each family passes a `select(index)`
 * callback that performs its own in-place content update. This keeps every
 * family's established character intact while removing the duplicated
 * prev/next/position/boundary plumbing.
 *
 * Usage:
 *   var reader = WXDetailReader.attach({
 *     count: 4,                       // total items (from data/DOM, never hard-coded twice)
 *     start: 0,                       // initial index (0-based)
 *     prevBtn: el, nextBtn: el,       // required controls
 *     posEl: el,                      // element whose textContent shows "i of N"
 *     select: function(i){...},       // required: render item i in place
 *     circular: false,                // default non-circular (boundary disabled)
 *     arrowKeys: true,                // Left/Right = prev/next (guarded)
 *     arrowRoot: el,                  // where keydown is listened (default document)
 *     resetScroll: el,               // element scrolled to top on each change
 *     // modal-only (omit for inline panels):
 *     modal: false, dialog: el, closeBtn: el, onClose: function(){}, backdrop: el
 *   });
 *   reader.go(i); reader.update(); reader.open(i); reader.close(); reader.destroy();
 */
(function (global) {
  "use strict";
  function isTypingTarget(el) {
    if (!el) return false;
    var t = (el.tagName || "").toLowerCase();
    if (t === "input" || t === "textarea" || t === "select") return true;
    if (el.isContentEditable) return true;
    var role = el.getAttribute && el.getAttribute("role");
    return role === "tab" || role === "slider" || role === "spinbutton";
  }
  function focusables(root) {
    if (!root) return [];
    return Array.prototype.slice
      .call(
        root.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
  }

  function attach(opts) {
    var count = opts.count | 0;
    var i = Math.max(0, Math.min(count - 1, opts.start || 0));
    var circular = !!opts.circular;
    var prev = opts.prevBtn,
      next = opts.nextBtn,
      pos = opts.posEl;
    var lastFocus = null,
      keyHandler = null,
      trapHandler = null;

    function label(n) {
      return typeof opts.label === "function" ? opts.label(n) : n + 1 + " of " + count;
    }
    function update() {
      if (pos) pos.textContent = label(i);
      if (prev) {
        var atStart = !circular && i <= 0;
        prev.disabled = atStart;
        prev.setAttribute("aria-disabled", atStart ? "true" : "false");
      }
      if (next) {
        var atEnd = !circular && i >= count - 1;
        next.disabled = atEnd;
        next.setAttribute("aria-disabled", atEnd ? "true" : "false");
      }
    }
    function render() {
      if (typeof opts.select === "function") opts.select(i);
      if (opts.resetScroll && opts.resetScroll.scrollTo) opts.resetScroll.scrollTo(0, 0);
      else if (opts.resetScroll) opts.resetScroll.scrollTop = 0;
      update();
    }
    function go(n) {
      if (circular) n = (n + count) % count;
      n = Math.max(0, Math.min(count - 1, n));
      if (n === i) {
        update();
        return;
      }
      i = n;
      render();
    }
    function onPrev() {
      go(i - 1);
      if (prev && prev.disabled && next) next.focus();
    }
    function onNext() {
      go(i + 1);
      if (next && next.disabled && prev) prev.focus();
    }
    if (prev) prev.addEventListener("click", onPrev);
    if (next) next.addEventListener("click", onNext);

    if (opts.arrowKeys) {
      keyHandler = function (e) {
        if (isTypingTarget(e.target)) return;
        if (opts.isActive && !opts.isActive()) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onPrev();
        }
      };
      (opts.arrowRoot || document).addEventListener("keydown", keyHandler);
    }

    // ---- modal helpers (only used when opts.modal) ----
    var bgEls = [];
    function lockBackground() {
      document.body.style.overflow = "hidden";
      bgEls = Array.prototype.slice.call(document.body.children).filter(function (el) {
        return el !== opts.dialog && el.nodeType === 1 && el.tagName !== "SCRIPT";
      });
      bgEls.forEach(function (el) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      });
    }
    function unlockBackground() {
      document.body.style.overflow = "";
      bgEls.forEach(function (el) {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
      bgEls = [];
    }
    function open(n) {
      if (typeof n === "number") i = Math.max(0, Math.min(count - 1, n));
      lastFocus = document.activeElement;
      if (opts.dialog) {
        opts.dialog.hidden = false;
        opts.dialog.classList.add("open");
      }
      if (opts.modal) lockBackground();
      render();
      trapHandler = function (e) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }
        if (e.key === "Tab" && opts.modal) {
          var f = focusables(opts.dialog);
          if (!f.length) return;
          var first = f[0],
            last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      if (opts.dialog) opts.dialog.addEventListener("keydown", trapHandler);
      var focusTarget = opts.focusOnOpen || (opts.dialog && opts.dialog.querySelector("[data-reader-title]")) || opts.closeBtn;
      if (focusTarget && focusTarget.focus) focusTarget.focus({ preventScroll: true });
    }
    function close() {
      if (opts.dialog) {
        opts.dialog.classList.remove("open");
        opts.dialog.hidden = true;
        opts.dialog.removeEventListener("keydown", trapHandler);
      }
      if (opts.modal) unlockBackground();
      if (typeof opts.onClose === "function") opts.onClose();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    if (opts.closeBtn) opts.closeBtn.addEventListener("click", close);
    if (opts.backdrop) opts.backdrop.addEventListener("click", close);

    function destroy() {
      if (prev) prev.removeEventListener("click", onPrev);
      if (next) next.removeEventListener("click", onNext);
      if (keyHandler) (opts.arrowRoot || document).removeEventListener("keydown", keyHandler);
    }

    update();
    return {
      go: go,
      next: onNext,
      prev: onPrev,
      update: update,
      open: open,
      close: close,
      destroy: destroy,
      index: function () {
        return i;
      },
      setCount: function (c) {
        count = c | 0;
        i = Math.max(0, Math.min(count - 1, i));
        update();
      },
    };
  }

  global.WXDetailReader = { attach: attach };
})(window);
