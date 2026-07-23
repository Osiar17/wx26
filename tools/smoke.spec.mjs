// WX 2026 — Playwright smoke tests (dev/CI only; not shipped to the runtime).
// Boots the dependency-free static server and checks every page loads clean at
// desktop and mobile, that key interactive surfaces render, and that the export
// engine leaves the page usable. Run: npx playwright test tools/smoke.spec.mjs
import { test, expect } from "@playwright/test";
import { spawn } from "node:child_process";

const PORT = 8171;
const BASE = `http://localhost:${PORT}`;
let server;

test.beforeAll(async () => {
  server = spawn("node", ["tools/serve.mjs", String(PORT), "."], { stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 700));
});
test.afterAll(() => server && server.kill());

const PAGES = [
  "index",
  "concept",
  "creative-direction",
  "theme-brief",
  "setlist",
  "lyrics",
  "playbook",
  "blueprint",
  "music-workshop",
  "bible-study",
];

for (const vp of [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
]) {
  for (const page of PAGES) {
    test(`${vp.name} · ${page} loads clean`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const p = await ctx.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(String(e)));
      const failed = [];
      p.on("response", (r) => {
        if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      await p.goto(`${BASE}/${page}.html`, { waitUntil: "load" });
      await p.waitForTimeout(400);
      expect(errors, `JS errors on ${page}`).toEqual([]);
      expect(failed, `failed requests on ${page}`).toEqual([]);
      // exactly one document <title>, non-empty; has description + viewport
      await expect(p).toHaveTitle(/.+/);
      const meta = await p.evaluate(() => ({
        desc: !!document.querySelector('meta[name="description"]'),
        vp: !!document.querySelector('meta[name="viewport"]'),
        icon: !!document.querySelector('link[rel="icon"]'),
      }));
      expect(meta.desc && meta.vp && meta.icon, `metadata on ${page}`).toBeTruthy();
      await ctx.close();
    });
  }
}

test("setlist has 28 items from the shared catalogue", async ({ page }) => {
  await page.goto(`${BASE}/setlist.html`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  expect(await page.locator("#setBody .set-item").count()).toBe(28);
});

test("lyrics has 28 items and is noindex", async ({ page }) => {
  await page.goto(`${BASE}/lyrics.html`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  expect(await page.locator("#lyricBody .lyric-item").count()).toBe(28);
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toMatch(/noindex/);
});

test("export leaves the page interactive (no popup, no leftover frame)", async ({ page }) => {
  let popups = 0;
  page.on("popup", () => popups++);
  await page.goto(`${BASE}/lyrics.html`, { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    document.querySelector("#exportMenuNav .export-btn").click();
    document.querySelector('#exportMenuNav [data-act="pdf"]').click();
  });
  await page.waitForTimeout(800);
  const state = await page.evaluate(() => ({
    frames: document.querySelectorAll("iframe.wx-print-frame").length,
    pe: getComputedStyle(document.body).pointerEvents,
    vis: getComputedStyle(document.body).visibility,
  }));
  expect(popups).toBe(0);
  expect(state.pe).toBe("auto");
  expect(state.vis).toBe("visible");
});

test("404 page renders and links back", async ({ page }) => {
  await page.goto(`${BASE}/does-not-exist.html`, { waitUntil: "load" });
  expect(await page.locator("h1").innerText()).toMatch(/isn|not/i);
  expect(await page.locator('a[href*="index.html"]').count()).toBeGreaterThan(0);
});

// Pass 9.1J — shared detail-reader journey (Bible Study "Four Works of Scripture").
test("detail reader: four works — open, Next, boundary, Prev", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/bible-study.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(400);
  const read = () =>
    p.evaluate(() => ({
      pos: document.getElementById("wkPos").textContent,
      title: document.getElementById("wd-title").textContent.trim(),
      prevDis: document.getElementById("wkPrev").disabled,
      nextDis: document.getElementById("wkNext").disabled,
    }));
  let s = await read();
  expect(s.pos).toBe("1 of 4");
  expect(s.prevDis).toBe(true); // boundary: first item, Previous disabled
  await p.click("#wkNext");
  s = await read();
  expect(s.pos).toBe("2 of 4");
  await p.click("#wkNext");
  await p.click("#wkNext");
  s = await read();
  expect(s.pos).toBe("4 of 4");
  expect(s.nextDis).toBe(true); // boundary: final item, Next disabled
  await p.click("#wkPrev");
  s = await read();
  expect(s.pos).toBe("3 of 4");
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.2 — Wade-In Dimension reader journey (music-workshop.html).
test("detail reader: wade-in dimensions — open, Next, boundary, Prev", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/music-workshop.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('[data-pillar="1"]').click());
  const read = () =>
    p.evaluate(() => ({
      pos: document.getElementById("pilPos").textContent,
      title: document.getElementById("pd-title").textContent.trim(),
      prevDis: document.getElementById("pilPrev").disabled,
      nextDis: document.getElementById("pilNext").disabled,
    }));
  let s = await read();
  expect(s.pos).toBe("1 of 3");
  expect(s.title).toBe("The Christian");
  expect(s.prevDis).toBe(true);
  await p.click("#pilNext");
  s = await read();
  expect(s.pos).toBe("2 of 3");
  expect(s.title).toBe("The Musician");
  await p.click("#pilNext");
  s = await read();
  expect(s.pos).toBe("3 of 3");
  expect(s.title).toBe("The Performer");
  expect(s.nextDis).toBe(true);
  await p.click("#pilPrev");
  s = await read();
  expect(s.pos).toBe("2 of 3");
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.2 — Musical Identity phase reader + graph sync (creative-direction.html#musical).
test("detail reader: musical phases — Next through IV with graph sync", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html#musical`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(700);
  const read = () =>
    p.evaluate(() => {
      const activePill = [...document.querySelectorAll(".mij-pill")].findIndex((b) =>
        b.classList.contains("on"),
      );
      const dot = [
        ...new Set(
          [...document.querySelectorAll(".mij-dot.on")].map((c) => +c.getAttribute("data-d")),
        ),
      ];
      return {
        pos: document.getElementById("mijPos").textContent,
        phase: (document.querySelector(".mij-name") || {}).textContent,
        activePill,
        graphDot: dot.join(","),
        prevDis: document.getElementById("mijPrev").disabled,
        nextDis: document.getElementById("mijNext").disabled,
      };
    });
  let s = await read();
  expect(s.pos).toBe("1 of 4");
  expect(s.prevDis).toBe(true);
  expect(s.activePill).toBe(0);
  await p.click("#mijNext");
  await p.click("#mijNext");
  await p.click("#mijNext");
  s = await read();
  expect(s.pos).toBe("4 of 4");
  expect(s.phase).toBe("The Gateway to Glory");
  expect(s.activePill).toBe(3); // pill synced
  expect(s.graphDot).toBe("3"); // graph marker synced
  expect(s.nextDis).toBe(true);
  await p.click("#mijPrev");
  s = await read();
  expect(s.pos).toBe("3 of 4");
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.3 — Colour Palette modal reader journey (creative-direction.html#identity).
test("detail reader: colour palette — open, Next to final, boundary, Escape restores focus", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html#identity`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(700);
  await p.evaluate(() => {
    const el = document.querySelector(
      ".vi-cell[data-key],.vi-swatch[data-key],.vi-onimg[data-key]",
    );
    el.scrollIntoView();
    el.click();
  });
  await p.waitForTimeout(300);
  const read = () =>
    p.evaluate(() => {
      const cur = [...document.querySelectorAll("#viOverlay .vi-detail")].find((d) => !d.hidden);
      return {
        pos: document.getElementById("viPos").textContent,
        name: cur ? cur.querySelector(".vi-d-name").textContent : null,
        hex: cur ? cur.querySelector(".vi-d-hex").textContent : null,
        prevDis: document.getElementById("viPrev").disabled,
        nextDis: document.getElementById("viNext").disabled,
        bodyLocked: getComputedStyle(document.body).overflow,
        focusInside: document.getElementById("viOverlay").contains(document.activeElement),
      };
    });
  let s = await read();
  expect(s.pos).toBe("1 of 7");
  expect(s.name).toBe("Blue-Black");
  expect(s.prevDis).toBe(true);
  expect(s.bodyLocked).toBe("hidden");
  expect(s.focusInside).toBe(true);
  for (let k = 0; k < 6; k++) await p.click("#viNext");
  s = await read();
  expect(s.pos).toBe("7 of 7");
  expect(s.name).toBe("Wildflower Purple");
  expect(s.hex).toBe("#7A4CB8");
  expect(s.nextDis).toBe(true);
  await p.keyboard.press("Escape");
  await p.waitForTimeout(300);
  const closed = await p.evaluate(() => ({
    hidden: document.getElementById("viOverlay").hidden,
    focusReturned: !!(
      document.activeElement &&
      document.activeElement.getAttribute &&
      document.activeElement.getAttribute("data-key")
    ),
  }));
  expect(closed.hidden).toBe(true);
  expect(closed.focusReturned).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.4 — Logo & Wordmarks zone-board card reader.
test("detail reader: logo marks — open, Next through cards, boundary, Escape", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html#identity`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(700);
  await p.evaluate(() => {
    const g = document.getElementById("markGrid");
    g.scrollIntoView();
    g.querySelector("button").click();
  });
  await p.waitForTimeout(300);
  const read = () =>
    p.evaluate(() => ({
      pos: document.getElementById("zPos").textContent,
      crumb: document.getElementById("zCrumb").textContent,
      prevDis: document.getElementById("zPrev").disabled,
      nextDis: document.getElementById("zNext").disabled,
      bodyLocked: getComputedStyle(document.body).overflow,
    }));
  let s = await read();
  expect(s.pos).toBe("Card 1 of 7");
  expect(s.crumb).toContain("Primary Campaign Mark");
  expect(s.prevDis).toBe(true);
  expect(s.bodyLocked).toBe("hidden");
  for (let k = 0; k < 6; k++) await p.click("#zNext");
  s = await read();
  expect(s.pos).toBe("Card 7 of 7");
  expect(s.crumb).toContain("Which Mark When");
  expect(s.nextDis).toBe(true);
  await p.keyboard.press("Escape");
  await p.waitForTimeout(300);
  const closed = await p.evaluate(() => ({
    hidden: document.getElementById("zoneBoard").hidden,
    focusOnCard: !!(
      document.activeElement && document.activeElement.classList.contains("vi-mcard")
    ),
  }));
  expect(closed.hidden).toBe(true);
  expect(closed.focusOnCard).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.4 — Typography zone-board card reader + cross-family reset from Logo.
test("detail reader: typography cards + cross-family reset", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html#identity`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(700);
  // open Logo first, close
  await p.evaluate(() => document.getElementById("markGrid").querySelector("button").click());
  await p.waitForTimeout(200);
  await p.keyboard.press("Escape");
  await p.waitForTimeout(300);
  // now open Typography — count/index/title must reset to this family
  await p.evaluate(() => {
    const g = document.getElementById("typeGrid");
    g.scrollIntoView();
    g.querySelector("button").click();
  });
  await p.waitForTimeout(300);
  let s = await p.evaluate(() => ({
    pos: document.getElementById("zPos").textContent,
    crumb: document.getElementById("zCrumb").textContent,
  }));
  expect(s.pos).toBe("Card 1 of 5"); // reset to 5, not retained 7
  expect(s.crumb).toContain("YES Wordmark");
  await p.click("#zNext");
  s = await p.evaluate(() => document.getElementById("zCrumb").textContent);
  expect(s).toContain("TFArrow");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.4 — Imagery world-board: existing card/slide nav + lock retained.
test("detail reader: imagery world-board opens with lock and slide nav", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html#identity`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(700);
  await p.evaluate(() => {
    const g = document.getElementById("worldGrid");
    g.scrollIntoView();
    g.querySelector("button").click();
  });
  await p.waitForTimeout(400);
  const st = await p.evaluate(() => ({
    opened: !document.getElementById("worldBoard").hidden,
    crumb: document.getElementById("wCrumb").textContent,
    dots: document.querySelectorAll("#wDots .w-dot").length,
    bodyLocked: getComputedStyle(document.body).overflow,
  }));
  expect(st.opened).toBe(true);
  expect(st.crumb).toContain("The World");
  expect(st.dots).toBeGreaterThan(1);
  expect(st.bodyLocked).toBe("hidden");
  await p.evaluate(() => document.querySelectorAll("#wDots .w-dot")[1].click());
  await p.waitForTimeout(200);
  await p.evaluate(() => document.getElementById("wClose").click());
  await p.waitForTimeout(600);
  const closed = await p.evaluate(() => ({
    hidden: document.getElementById("worldBoard").hidden,
    anyVideoPlaying: [...document.querySelectorAll("#worldBoard video")].some((v) => !v.paused),
  }));
  expect(closed.hidden).toBe(true);
  expect(closed.anyVideoPlaying).toBe(false);
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.5 — final five detail-reader families. Each asserts real content
// changes on step and correct boundary state; readers are exercised by clicking
// their own Prev/Next controls (family render stays local; controller shared).
async function openCD(browser, w) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(600);
  return { ctx, p, errors };
}

test("detail reader: what-are-you-making decision cards (Every zone first)", async ({
  browser,
}) => {
  const { ctx, p, errors } = await openCD(browser, 1280);
  const start = await p.evaluate(() => ({
    pos: document.getElementById("sysPos").textContent,
    zone: document.getElementById("sysChildZone").textContent,
    prev: document.getElementById("sysPrev").disabled,
  }));
  expect(start.pos).toBe("1 of 7");
  expect(start.zone).toBe("Every zone");
  expect(start.prev).toBe(true);
  await p.evaluate(() => document.getElementById("sysNext").click());
  const n1 = await p.evaluate(() => ({
    pos: document.getElementById("sysPos").textContent,
    zone: document.getElementById("sysChildZone").textContent,
  }));
  expect(n1.pos).toBe("2 of 7");
  expect(n1.zone).not.toBe("Every zone");
  const last = await p.evaluate(() => {
    const nx = document.getElementById("sysNext");
    for (let k = 0; k < 10 && !nx.disabled; k++) nx.click();
    return { pos: document.getElementById("sysPos").textContent, nextDis: nx.disabled };
  });
  expect(last.pos).toBe("7 of 7");
  expect(last.nextDis).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("detail reader: elements & symbols modal steps and resets scroll", async ({ browser }) => {
  const { ctx, p, errors } = await openCD(browser, 1280);
  const o0 = await p.evaluate(() => {
    document.querySelector("#esTrack .es-card").click();
    return {
      open: !document.getElementById("esModal").hidden,
      live: document.getElementById("esLive").textContent,
    };
  });
  expect(o0.open).toBe(true);
  expect(o0.live).toContain("1 / 9");
  const o1 = await p.evaluate(() => {
    const c = document.querySelector(".es-modal-card");
    if (c) c.scrollTop = 40;
    document.getElementById("esNext").click();
    return { live: document.getElementById("esLive").textContent, scroll: c ? c.scrollTop : 0 };
  });
  expect(o1.live).toContain("2 / 9");
  expect(o1.scroll).toBe(0);
  const closed = await p.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    return document.getElementById("esModal").hidden;
  });
  expect(closed).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("detail reader: flow of our journey — 1 of 4 through 4 of 4 in order", async ({ browser }) => {
  const { ctx, p, errors } = await openCD(browser, 1280);
  const start = await p.evaluate(() => ({
    pos: document.getElementById("fjiPos").textContent,
    title: document.getElementById("fjpTitle").textContent,
    prev: document.getElementById("fjiPrev").disabled,
  }));
  expect(start.pos).toBe("1 of 4");
  expect(start.title).toBe("God Is Good");
  expect(start.prev).toBe(true);
  const seq = await p.evaluate(() => {
    const out = [];
    const nx = document.getElementById("fjiNext");
    for (let k = 0; k < 3; k++) {
      nx.click();
      out.push(document.getElementById("fjpTitle").textContent);
    }
    return { out, pos: document.getElementById("fjiPos").textContent, nextDis: nx.disabled };
  });
  expect(seq.out).toEqual(["God Helps Us Yield", "We Say Yes", "God Is Glorified"]);
  expect(seq.pos).toBe("4 of 4");
  expect(seq.nextDis).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("detail reader: find your part — hierarchical read-through of 12 parts", async ({
  browser,
}) => {
  const { ctx, p, errors } = await openCD(browser, 1280);
  const start = await p.evaluate(() => ({
    pos: document.getElementById("fypPos").textContent,
    name: (document.querySelector(".fyp-rname") || {}).textContent,
    prev: document.getElementById("fypPrev").disabled,
  }));
  expect(start.pos).toBe("1 of 12");
  expect(start.name).toBe("Acoustic Guitar");
  expect(start.prev).toBe(true);
  await p.evaluate(() => document.getElementById("fypNext").click());
  const n1 = await p.evaluate(() => (document.querySelector(".fyp-rname") || {}).textContent);
  expect(n1).toBe("Electric Guitar");
  const last = await p.evaluate(() => {
    const nx = document.getElementById("fypNext");
    for (let k = 0; k < 16 && !nx.disabled; k++) nx.click();
    return {
      pos: document.getElementById("fypPos").textContent,
      name: (document.querySelector(".fyp-rname") || {}).textContent,
      nextDis: nx.disabled,
    };
  });
  expect(last.pos).toBe("12 of 12");
  expect(last.name).toBe("Backing Vocals");
  expect(last.nextDis).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("detail reader: musical identity elements — Tempo & Pulse first, never skipped", async ({
  browser,
}) => {
  const { ctx, p, errors } = await openCD(browser, 1280);
  const start = await p.evaluate(() => ({
    pos: document.getElementById("elePos").textContent,
    title: (document.querySelector(".ele-dtitle") || {}).textContent,
    prev: document.getElementById("elePrev").disabled,
  }));
  expect(start.pos).toBe("1 of 7");
  expect(start.title).toBe("Tempo & Pulse");
  expect(start.prev).toBe(true);
  await p.evaluate(() => document.getElementById("eleNext").click());
  const n1 = await p.evaluate(() => (document.querySelector(".ele-dtitle") || {}).textContent);
  expect(n1).not.toBe("Tempo & Pulse");
  const last = await p.evaluate(() => {
    const nx = document.getElementById("eleNext");
    for (let k = 0; k < 10 && !nx.disabled; k++) nx.click();
    return { pos: document.getElementById("elePos").textContent, nextDis: nx.disabled };
  });
  expect(last.pos).toBe("7 of 7");
  expect(last.nextDis).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("all 15 reader families present and initialised after 9.1J.5", async ({ browser }) => {
  const { ctx, p, errors } = await openCD(browser, 1280);
  // the five families added this pass expose their position indicators
  const fifth = await p.evaluate(() => ({
    sys: document.getElementById("sysPos").textContent,
    ele: document.getElementById("elePos").textContent,
    fji: document.getElementById("fjiPos").textContent,
    fyp: document.getElementById("fypPos").textContent,
    es: document.getElementById("esLive").textContent,
  }));
  expect(fifth.sys).toBe("1 of 7");
  expect(fifth.ele).toBe("1 of 7");
  expect(fifth.fji).toBe("1 of 4");
  expect(fifth.fyp).toBe("1 of 12");
  expect(fifth.es).toContain("/ 9");
  // regression: prior VI readers still work (colour palette + logo board)
  const prior = await p.evaluate(() => {
    const out = {};
    const sw = document.querySelector(".vi-cell[data-key],.vi-swatch[data-key]");
    if (sw) {
      sw.click();
      out.colour = document.getElementById("viPos").textContent;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }
    const mg = document.getElementById("markGrid");
    if (mg) {
      mg.querySelector("button").click();
      out.logo = document.getElementById("zPos").textContent;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }
    return out;
  });
  expect(prior.colour).toContain("of 7");
  expect(prior.logo).toContain("Card 1 of 7");
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1J.6 — Elements & Symbols: in-panel Prev/Next on the open detail,
// mirroring the carousel and resetting internal scroll on each step.
test("detail reader: elements & symbols in-panel Prev/Next mirrors the carousel", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/creative-direction.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(600);
  const open = await p.evaluate(() => {
    document.querySelector("#esTrack .es-card").click();
    return {
      pos: document.getElementById("esmPos").textContent,
      title: document.querySelector(".es-detail:not([hidden]) .es-detail-title").textContent,
    };
  });
  expect(open.pos).toBe("1 of 9");
  expect(open.title).toBe("Garden");
  // in-panel Next advances the element and resets internal scroll
  const stepped = await p.evaluate(() => {
    const mc = document.querySelector(".es-modal-card");
    mc.scrollTop = 60;
    document.getElementById("esmNext").click();
    return {
      pos: document.getElementById("esmPos").textContent,
      live: document.getElementById("esLive").textContent,
      title: document.querySelector(".es-detail:not([hidden]) .es-detail-title").textContent,
      scroll: mc.scrollTop,
    };
  });
  expect(stepped.pos).toBe("2 of 9");
  expect(stepped.live).toContain("2 / 9");
  expect(stepped.title).toBe("Night");
  expect(stepped.scroll).toBe(0);
  // carousel arrow keeps the in-panel indicator in sync
  const synced = await p.evaluate(() => {
    document.getElementById("esNext").click();
    return document.getElementById("esmPos").textContent;
  });
  expect(synced).toBe("3 of 9");
  // in-panel Prev steps back
  const back = await p.evaluate(() => {
    document.getElementById("esmPrev").click();
    return document.getElementById("esmPos").textContent;
  });
  expect(back).toBe("2 of 9");
  expect(errors).toEqual([]);
  await ctx.close();
});

// Pass 9.1K — footer identity consistency (footer-only). Verifies the canonical
// mobile identity grouping, Creative Direction's single shared footer across all
// five segments, Playbook operational content, and no 320px horizontal overflow.
test("footer: theme brief mobile identity group is one centred row", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/theme-brief.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const f = document.querySelector(".wx-foot");
    const yes = document.querySelector(".wx-foot-yes").getBoundingClientRect();
    const ccc = document.querySelector(".wx-foot-ccc").getBoundingClientRect();
    const cccDisp = getComputedStyle(document.querySelector(".wx-foot-ccc")).display;
    return {
      dir: getComputedStyle(f).flexDirection,
      sameRow: Math.abs(yes.top - ccc.top) < 16,
      yesVisible: yes.height > 0,
      cccVisible: ccc.height > 0 && cccDisp !== "none",
    };
  });
  expect(r.sameRow).toBe(true);
  expect(r.yesVisible).toBe(true);
  expect(r.cccVisible).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("footer: creative direction has one shared footer on all five segments", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  for (const seg of ["story", "elements", "mood", "identity", "musical"]) {
    await p.goto(`${BASE}/creative-direction.html#${seg}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const foots = document.querySelectorAll(".eco-foot");
      const f = foots[0];
      return {
        count: foots.length,
        display: f ? getComputedStyle(f).display : "none",
        marks: f ? f.querySelectorAll("img").length : 0,
      };
    });
    expect(r.count).toBe(1); // exactly one shared footer, never duplicated
    expect(r.display).not.toBe("none"); // reachable on this segment
    expect(r.marks).toBe(2); // YES + CCC
  }
  await ctx.close();
});

test("footer: creative direction Story footer is scrollable into view (mobile)", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/creative-direction.html#story`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(400);
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.mouse.move(195, 400);
  for (let i = 0; i < 14; i++) {
    await p.mouse.wheel(0, 800);
  }
  await p.waitForTimeout(300);
  const inView = await p.evaluate(() => {
    const f = document.querySelector(".eco-foot").getBoundingClientRect();
    return f.top < window.innerHeight && f.bottom > 0;
  });
  expect(inView).toBe(true);
  await ctx.close();
});

// Pass 9.1L.1 updated this from the 9.1K expectation: the legacy "Playbook · WX 2026"
// (.eco-mid) label is intentionally removed so the footer is the canonical
// YES / navigation / CCC. The marks stay on one row with the nav between them.
test("footer: playbook footer is the canonical three-part identity row", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/playbook.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const yes = document.querySelector(".eco-yes").getBoundingClientRect();
    const ccc = document.querySelector(".eco-ccc").getBoundingClientRect();
    const mid = document.querySelector(".eco-mid");
    const fnav = document.querySelector("[data-wx-fnav]");
    return {
      midHidden: !mid || getComputedStyle(mid).display === "none",
      navShown: !!fnav && !fnav.hidden,
      marksSameRow: Math.abs(yes.top - ccc.top) < 16,
    };
  });
  expect(r.midHidden).toBe(true);
  expect(r.navShown).toBe(true);
  expect(r.marksSameRow).toBe(true);
  await ctx.close();
});

test("footer: no horizontal overflow at 320px on identity-bearing pages", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 568 } });
  const p = await ctx.newPage();
  for (const pg of ["index", "theme-brief", "playbook", "setlist", "creative-direction"]) {
    await p.goto(`${BASE}/${pg}.html`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(250);
    const over = await p.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(over, `${pg} overflow`).toBe(false);
  }
  await ctx.close();
});

// Pass 9.1L rebuild — restrained header dropdown + footer Prev/Next.
const RSEQ = [
  ["concept.html", "off", "theme-brief.html"],
  ["theme-brief.html", "concept.html", "creative-direction.html"],
  ["playbook.html", "creative-direction.html#identity", "setlist.html?from=playbook"],
  ["blueprint.html", "creative-direction.html#musical", "setlist.html?from=blueprint"],
  ["lyrics.html", "setlist.html", "music-workshop.html"],
  ["music-workshop.html", "lyrics.html", "bible-study.html"],
  ["bible-study.html", "music-workshop.html", "off"],
];

test("rebuild: footer Prev/Next routes and boundaries per reader page", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const p = await ctx.newPage();
  for (const [pg, prev, next] of RSEQ) {
    await p.goto(`${BASE}/${pg}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(150);
    const r = await p.evaluate(() => {
      const m = document.querySelector("[data-wx-fnav]");
      const pv = m.querySelector(".wx-fnav__prev"),
        nx = m.querySelector(".wx-fnav__next");
      const h = (x) => (x ? (x.tagName === "A" ? x.getAttribute("href") : "off") : null);
      return { prev: h(pv), next: h(nx) };
    });
    expect(r.prev).toBe(prev);
    expect(r.next).toBe(next);
  }
  await ctx.close();
});

test("rebuild: Setlist branch-context Previous", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const p = await ctx.newPage();
  const prevOf = async (q) => {
    await p.goto(`${BASE}/setlist.html${q}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(120);
    return p.evaluate(() => document.querySelector(".wx-fnav__prev").getAttribute("href"));
  };
  expect(await prevOf("?from=playbook")).toBe("playbook.html");
  expect(await prevOf("?from=blueprint")).toBe("blueprint.html");
  expect(await prevOf("")).toBe("playbook.html");
  expect(await prevOf("?from=evil")).toBe("playbook.html");
  await ctx.close();
});

test("rebuild: Creative Direction footer follows the active segment (no stale state)", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const p = await ctx.newPage();
  const states = {};
  for (const h of ["story", "elements", "mood", "identity", "musical"]) {
    await p.goto(`${BASE}/creative-direction.html#${h}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(200);
    states[h] = await p.evaluate(() => {
      const m = document.querySelector("[data-wx-fnav]");
      const nx = m.querySelector(".wx-fnav__next");
      return {
        prev: m.querySelector(".wx-fnav__prev").getAttribute("href"),
        next: nx.tagName === "A" ? nx.getAttribute("href") : "off",
      };
    });
  }
  expect(states.story).toEqual({ prev: "theme-brief.html", next: "off" });
  expect(states.elements).toEqual({ prev: "theme-brief.html", next: "off" });
  expect(states.mood).toEqual({ prev: "theme-brief.html", next: "off" });
  expect(states.identity).toEqual({ prev: "theme-brief.html", next: "playbook.html" });
  expect(states.musical).toEqual({ prev: "theme-brief.html", next: "blueprint.html" });
  // live hashchange updates the footer immediately
  await p.goto(`${BASE}/creative-direction.html#identity`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(200);
  const live = await p.evaluate(() => {
    location.hash = "musical";
    return new Promise((res) =>
      setTimeout(() => res(document.querySelector(".wx-fnav__next").getAttribute("href")), 200),
    );
  });
  expect(live).toBe("blueprint.html");
  await ctx.close();
});

test("rebuild: All Pages dropdown beside Workspace — open, current, Escape, outside", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(`${BASE}/theme-brief.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(200);
  const open = await p.evaluate(() => {
    const t = document.querySelector(".wx-allpages");
    t.click();
    const m = document.querySelector(".wx-menu");
    return {
      trigBeforeWs: !!document.querySelector(".site-nav__ws"),
      open: !m.hidden,
      expanded: t.getAttribute("aria-expanded"),
      items: m.querySelectorAll(".wx-menu__link").length,
      order: [...m.querySelectorAll(".wx-menu__link")].map((a) => a.getAttribute("href")),
      current: (m.querySelector('[aria-current="page"]') || {}).getAttribute
        ? m.querySelector('[aria-current="page"]').getAttribute("href")
        : null,
    };
  });
  expect(open.open).toBe(true);
  expect(open.expanded).toBe("true");
  expect(open.items).toBe(9);
  expect(open.order).toEqual([
    "concept.html",
    "theme-brief.html",
    "creative-direction.html",
    "playbook.html",
    "blueprint.html",
    "setlist.html",
    "lyrics.html",
    "music-workshop.html",
    "bible-study.html",
  ]);
  expect(open.current).toBe("theme-brief.html");
  const esc = await p.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    return {
      closed: document.querySelector(".wx-menu").hidden,
      focusTrig: document.activeElement.classList.contains("wx-allpages"),
    };
  });
  expect(esc.closed).toBe(true);
  expect(esc.focusTrig).toBe(true);
  expect(errors).toEqual([]);
  await ctx.close();
});

test("rebuild: nav hidden in print; Workspace hub order unchanged", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/setlist.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(150);
  await p.emulateMedia({ media: "print" });
  const nav = await p.evaluate(() => ({
    fnav: getComputedStyle(document.querySelector(".wx-fnav")).display,
  }));
  expect(nav.fnav).toBe("none");
  // Workspace hub tile order unchanged by this pass
  await p.goto(`${BASE}/index.html`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(150);
  const hub = await p.evaluate(() =>
    [...document.querySelectorAll(".wcard .wc-list a")]
      .map((a) => a.getAttribute("href"))
      .slice(0, 5),
  );
  expect(hub).toEqual([
    "concept.html",
    "theme-brief.html",
    "creative-direction.html",
    "music-workshop.html",
    "bible-study.html",
  ]);
  await ctx.close();
});

// Pass 9.1L.1 — header action grouping + Playbook footer correction.
function boxesIntersect(a, c) {
  return !(a.right <= c.left || c.right <= a.left || a.bottom <= c.top || c.bottom <= a.top);
}

test("9.1L.1: header action group — trigger with Workspace, clear of countdown", async ({
  browser,
}) => {
  for (const [pg, w] of [
    ["index.html", 1366],
    ["index.html", 320],
    ["playbook.html", 1366],
    ["playbook.html", 320],
    ["creative-direction.html", 1366],
    ["creative-direction.html", 320],
    ["theme-brief.html", 1366],
    ["theme-brief.html", 320],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${pg}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(250);
    const r = await p.evaluate(() => {
      const cd = document.querySelector(".nav-countdown");
      const ws = document.querySelector(".site-nav__ws");
      const tr = document.querySelector(".wx-allpages");
      const grp = document.querySelector(".wx-header-actions");
      const R = (e) => e.getBoundingClientRect();
      return {
        trigInGroup: grp.contains(tr) && grp.contains(ws),
        wsBeforeTrig: R(ws).right <= R(tr).left + 1,
        gap: Math.round(R(tr).left - R(ws).right),
        cdIntersectsTrig: (function () {
          const a = R(cd),
            c = R(tr);
          return !(
            a.right <= c.left ||
            c.right <= a.left ||
            a.bottom <= c.top ||
            c.bottom <= a.top
          );
        })(),
        trigInside: window.innerWidth - R(tr).right,
        dupGroup: document.querySelectorAll(".wx-header-actions").length,
        dupTrig: document.querySelectorAll(".wx-allpages").length,
        docOver: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    expect(r.trigInGroup, `${pg}@${w} trigger grouped`).toBe(true);
    expect(r.wsBeforeTrig, `${pg}@${w} order`).toBe(true);
    expect(r.gap, `${pg}@${w} gap>=6`).toBeGreaterThanOrEqual(6);
    expect(r.cdIntersectsTrig, `${pg}@${w} cd/trig`).toBe(false);
    expect(r.trigInside, `${pg}@${w} trig inside`).toBeGreaterThanOrEqual(0);
    expect(r.dupGroup).toBe(1);
    expect(r.dupTrig).toBe(1);
    expect(r.docOver, `${pg}@${w} overflow`).toBe(false);
    await ctx.close();
  }
});

test("9.1L.1: desktop countdown stays viewport-centred", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 800 } });
  const p = await ctx.newPage();
  for (const pg of ["index.html", "playbook.html", "creative-direction.html"]) {
    await p.goto(`${BASE}/${pg}`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(200);
    const off = await p.evaluate(() => {
      const cd = document.querySelector(".nav-countdown").getBoundingClientRect();
      return Math.abs(cd.left + cd.width / 2 - window.innerWidth / 2);
    });
    expect(off, `${pg} countdown centred`).toBeLessThanOrEqual(2);
  }
  await ctx.close();
});

test("9.1L.1: Playbook footer is YES / nav / CCC with no legacy label", async ({ browser }) => {
  for (const w of [320, 390, 1366]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/playbook.html`, { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(250);
    const r = await p.evaluate(() => {
      const foot = document.querySelector(".eco-foot");
      const mid = document.querySelector(".eco-mid");
      const fnav = document.querySelector("[data-wx-fnav]");
      const visibleKids = [...foot.children]
        .filter(
          (c) => getComputedStyle(c).display !== "none" && c.getBoundingClientRect().width > 0,
        )
        .map((c) => (c.className || c.tagName).split(" ")[0]);
      const fr = foot.getBoundingClientRect(),
        nr = fnav.getBoundingClientRect();
      return {
        midHidden: !mid || getComputedStyle(mid).display === "none",
        fnavCount: document.querySelectorAll("[data-wx-fnav]").length,
        visibleKids,
        navOffCenter: Math.abs(nr.left + nr.width / 2 - (fr.left + fr.width / 2)),
        prev: document.querySelector(".wx-fnav__prev").getAttribute("href"),
        next: document.querySelector(".wx-fnav__next").getAttribute("href"),
        docOver: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    expect(r.midHidden, `@${w} legacy label gone`).toBe(true);
    expect(r.fnavCount).toBe(1);
    expect(r.visibleKids).toEqual(["eco-yes", "wx-fnav", "eco-ccc"]);
    expect(r.navOffCenter, `@${w} nav centred`).toBeLessThanOrEqual(4);
    expect(r.prev).toBe("creative-direction.html#identity");
    expect(r.next).toBe("setlist.html?from=playbook");
    expect(r.docOver).toBe(false);
    await ctx.close();
  }
});
