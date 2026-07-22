#!/usr/bin/env node
/* WX 2026 — dependency-free structural audit (Pass 8).
   Runs with plain `node tools/audit.mjs` — no install, no runtime dependency.

   Checks: missing local href/src/srcset/url() targets, case-sensitive filename
   mismatches, repository-subpath safety (no leading-slash / absolute-origin
   refs), duplicate element IDs, malformed in-page anchors, residual data:image,
   per-page metadata/accessibility (lang, single title, description, viewport,
   theme-color, favicon, img alt), and canonical value drift
   (theme / phase titles+subtitles / Wildflower Purple).

   Static structure is checked with <script>, <style> and <!--comments-->
   removed, so JS template strings and commented-out slots are not misread.
   Literal `assets/…` paths inside JS/CSS are validated separately. Exit 1 on any
   error; intentionally-pending "Coming Soon" routes are not failures. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const errors = [],
  warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const listFiles = (dir) => {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".git") || e.name === "node_modules") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
};
const allFiles = listFiles(ROOT).map((p) => path.relative(ROOT, p).split(path.sep).join("/"));
const fileSet = new Set(allFiles);
const fileSetLower = new Map(allFiles.map((p) => [p.toLowerCase(), p]));
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

const PENDING = new Set([
  "flow-map.html",
  "production-cue.html",
  "running-order.html",
  "experience-report.html",
]);
const CANON = {
  theme: "YES: Not My Will, But Yours",
  purple: "#7A4CB8",
  phases: [
    ["God Is Good", "The Threshold of Goodness"],
    ["God Helps Us Yield", "The Help in the Dark"],
    ["We Say Yes", "The Will Laid Down"],
    ["God Is Glorified", "The Gateway to Glory"],
  ],
};

const stripScripts = (h) =>
  h
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
const scriptBlocks = (h) =>
  [...h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join("\n");
const styleBlocks = (h) =>
  [...h.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
const isTemplate = (u) => /[+${}`]|['"]/.test(u); // contains JS/template fragments

function checkRef(fromFile, raw) {
  if (isTemplate(raw)) return;
  if (/^(https?:)?\/\//i.test(raw) || /^(data:|mailto:|tel:|javascript:|#)/i.test(raw)) return;
  if (raw.startsWith("/")) {
    err(`[subpath] ${fromFile}: absolute-root reference "${raw}" is not repository-subpath-safe`);
    return;
  }
  const clean = raw.trim().replace(/[?#].*$/, "");
  if (!clean) return;
  const baseDir = path.posix.dirname(fromFile);
  const target = path.posix.normalize(path.posix.join(baseDir, clean));
  if (PENDING.has(target)) return;
  if (!fileSet.has(target)) {
    const lower = fileSetLower.get(target.toLowerCase());
    if (lower)
      err(
        `[case] ${fromFile}: "${raw}" → ${target} but disk has ${lower} (GitHub Pages is case-sensitive)`,
      );
    else err(`[missing] ${fromFile}: "${raw}" → ${target} does not exist`);
  }
}

for (const hf of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, hf), "utf8");
  const staticHtml = stripScripts(html);
  /* SVG carries its own <title>/<image> elements for accessibility — exclude
     them from document-level title / img-alt / h1 counts. */
  const staticNoSvg = staticHtml.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");

  /* static href/src/srcset */
  for (const m of staticHtml.matchAll(/\b(?:href|src)\s*=\s*"([^"]+)"/g)) checkRef(hf, m[1]);
  for (const m of staticHtml.matchAll(/\bsrcset\s*=\s*"([^"]+)"/g))
    m[1].split(",").forEach((part) => checkRef(hf, part.trim().split(/\s+/)[0]));

  /* url() in inline <style> (comments stripped) */
  const css = styleBlocks(html).replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) checkRef(hf, m[2]);

  /* literal assets/ paths inside <script> (skip templated) */
  for (const m of scriptBlocks(html).matchAll(
    /["'](assets\/[A-Za-z0-9._\-\/]+?\.[A-Za-z0-9]+)["']/g,
  ))
    checkRef(hf, m[1]);

  /* duplicate IDs (static DOM only) */
  const ids = [...staticHtml.matchAll(/\bid\s*=\s*"([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set(),
    dup = new Set();
  ids.forEach((id) => (seen.has(id) ? dup.add(id) : seen.add(id)));
  dup.forEach((id) => err(`[dup-id] ${hf}: duplicate static id "${id}"`));

  /* dangling static in-page anchors (id present statically OR referenced in JS) */
  for (const m of staticHtml.matchAll(/href\s*=\s*"#([^"]+)"/g)) {
    const id = m[1],
      esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const staticId = new RegExp(`\\bid\\s*=\\s*"${esc}"`).test(staticHtml);
    const jsId = new RegExp(`["'#]${esc}["'#\\s]`).test(html);
    if (!staticId && !jsId) warn(`[anchor] ${hf}: href="#${id}" has no matching id (static scan)`);
  }

  /* residual data:image (ignore inside comments already stripped for staticHtml; check whole file too) */
  if (/data:image\//i.test(html)) err(`[data-image] ${hf}: contains an embedded data:image`);

  /* metadata / accessibility (static) */
  if (!/<html[^>]*\blang=/i.test(html)) err(`[a11y] ${hf}: <html> missing lang attribute`);
  const titleN = (staticNoSvg.match(/<title>[\s\S]*?<\/title>/gi) || []).length;
  if (titleN !== 1) err(`[meta] ${hf}: expected exactly one <title>, found ${titleN}`);
  if (!/<meta[^>]+name=["']description["']/i.test(staticHtml))
    err(`[meta] ${hf}: missing meta description`);
  if (!/<meta[^>]+name=["']viewport["']/i.test(staticHtml))
    err(`[meta] ${hf}: missing viewport meta`);
  if (!/<meta[^>]+name=["']theme-color["']/i.test(staticHtml))
    warn(`[meta] ${hf}: missing theme-color`);
  if (!/rel=["']icon["']/i.test(staticHtml)) warn(`[meta] ${hf}: missing favicon link`);
  const h1N = (staticNoSvg.match(/<h1[\s>]/gi) || []).length;
  if (h1N < 1 && !/getElementById|innerHTML|querySelector/.test(scriptBlocks(html)))
    warn(`[a11y] ${hf}: no <h1> found`);
  for (const m of staticNoSvg.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=/.test(m[1]))
      err(`[a11y] ${hf}: static <img> without an alt attribute: ${m[0].slice(0, 80)}`);
  }
}

/* canonical drift */
if (fileSet.has("assets/js/wx-music-data.js")) {
  const s = fs.readFileSync(path.join(ROOT, "assets/js/wx-music-data.js"), "utf8");
  for (const [title, sub] of CANON.phases) {
    if (!s.includes(title)) err(`[drift] wx-music-data.js: phase title "${title}" missing`);
    if (!s.includes(sub)) err(`[drift] wx-music-data.js: phase subtitle "${sub}" missing`);
  }
}
for (const f of allFiles.filter((f) => /\.(html|css|js)$/.test(f))) {
  const s = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of s.matchAll(/#8[eE]6[eE]9[eE]/g))
    err(`[drift] ${f}: legacy Wildflower Purple ${m[0]} (must be ${CANON.purple})`);
  if (/Not My Will/.test(s) && /YES[—-]\s?Not My Will/.test(s))
    err(`[drift] ${f}: theme must read "${CANON.theme}" (colon form)`);
}

console.log(`WX audit — ${htmlFiles.length} HTML files, ${allFiles.length} files scanned`);
warnings.forEach((w) => console.log("  warn  " + w));
if (errors.length) {
  errors.forEach((e) => console.log("  ERROR " + e));
  console.log(`\nFAILED: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\nPASSED: 0 errors, ${warnings.length} warning(s)`);
