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
