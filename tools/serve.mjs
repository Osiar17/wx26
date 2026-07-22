#!/usr/bin/env node
/* Tiny static file server for local dev / CI smoke tests (no dependency).
   Usage: node tools/serve.mjs [port] [root] */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] || 8080);
const root = path.resolve(process.argv[3] || ".");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel.endsWith("/")) rel += "index.html";
    const fp = path.join(root, path.normalize(rel));
    if (!fp.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(fp, (e, data) => {
      if (e) {
        const nf = path.join(root, "404.html");
        if (fs.existsSync(nf)) {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(fs.readFileSync(nf));
        } else {
          res.writeHead(404).end("Not found");
        }
        return;
      }
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(fp).toLowerCase()] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`WX static server on http://localhost:${port} (root: ${root})`));
