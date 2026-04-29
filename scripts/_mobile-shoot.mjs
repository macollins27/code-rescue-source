// Mobile screenshot harness — local dev only.
// Captures every route at mobile (375), tablet (768), desktop (1280) as a series
// of viewport-sized tiles so each tile is actually inspectable. Also reports
// horizontal overflow before the .page overflow-x: clip kicks in.
import { chromium } from "/opt/homebrew/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

const BASE = "http://localhost:4321";
const OUT = "/tmp/cr-shots";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  ["home", "/"],
  ["about", "/about"],
  ["audit", "/audit"],
  ["install", "/install"],
  ["methodology", "/methodology"],
  ["constitution", "/constitution"],
  ["now", "/now"],
  ["rules-index", "/rules"],
  ["rules-dr-89", "/rules/dr-89"],
  ["rules-auth-5", "/rules/auth-5"],
  ["incidents-index", "/incidents"],
  ["incidents-002", "/incidents/inc-002-fake-tests"],
  ["writing-index", "/writing"],
  ["writing-eight", "/writing/2026-03-16-eight-principles-why-the-constitution-is-short"],
  ["404", "/this-does-not-exist"],
];

const VIEWPORTS = [
  ["m", 375, 812],   // iPhone-ish
  ["t", 768, 1024],  // iPad portrait
  ["d", 1280, 900],  // desktop sanity
];

const browser = await chromium.launch();
const report = [];
for (const [vlabel, vw, vh] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [slug, path] of ROUTES) {
    const url = BASE + path;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.evaluate(() => document.fonts && document.fonts.ready);
      // Detect overflow BEFORE clip kicks in by temporarily disabling .page clip.
      const overflow = await page.evaluate(() => {
        const pages = document.querySelectorAll(".page");
        const prev = [];
        pages.forEach((p) => { prev.push(p.style.overflowX); p.style.overflowX = "visible"; });
        const html = document.documentElement;
        const winW = window.innerWidth;
        const docW = Math.max(html.scrollWidth, document.body.scrollWidth);
        const offenders = [];
        if (docW > winW + 1) {
          for (const el of document.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1 && r.width > 0 && r.width < winW * 4) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className && el.className.toString().slice(0, 80)) || "",
                id: el.id || "",
                right: Math.round(r.right),
                width: Math.round(r.width),
                text: (el.textContent || "").slice(0, 60).replace(/\s+/g, " "),
              });
              if (offenders.length >= 8) break;
            }
          }
        }
        pages.forEach((p, i) => { p.style.overflowX = prev[i]; });
        return { docW, winW, overflow: docW > winW + 1, offenders };
      });
      const totalH = await page.evaluate(() => document.documentElement.scrollHeight);
      // Tile the page into vh-sized chunks so screenshots are readable.
      let y = 0, idx = 0;
      while (y < totalH) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(80);
        const file = `${OUT}/${vlabel}-${slug}-${String(idx).padStart(2, "0")}.png`;
        await page.screenshot({ path: file, fullPage: false });
        y += vh;
        idx += 1;
        if (idx > 30) break; // safety
      }
      report.push({ viewport: vlabel, slug, status: "ok", tiles: idx, totalH, overflow });
    } catch (e) {
      report.push({ viewport: vlabel, slug, status: "error", error: String(e).slice(0, 200) });
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/_report.json`, JSON.stringify(report, null, 2));
// Concise summary on stdout.
const summary = report.map((r) =>
  r.status === "ok"
    ? `${r.viewport} ${r.slug}: ${r.tiles} tiles, ${r.overflow.overflow ? "OVERFLOW " + r.overflow.docW + ">" + r.overflow.winW : "ok"}`
    : `${r.viewport} ${r.slug}: ERROR ${r.error}`
).join("\n");
console.log(summary);
