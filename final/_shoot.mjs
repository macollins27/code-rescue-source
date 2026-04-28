import { chromium } from '/opt/homebrew/lib/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:8000/_shot.html';
const OUT = new URL('./screenshots/', import.meta.url);
await mkdir(OUT, { recursive: true });

const PAGES = [
  { slug: 'home',        width: 1280 },
  { slug: 'audit',       width: 1200 },
  { slug: 'install',     width: 1200 },
  { slug: 'rules',       width: 1280 },
  { slug: 'incidents',   width: 1280 },
  { slug: 'methodology', width: 1280 },
];

const browser = await chromium.launch();
for (const { slug, width } of PAGES) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error(`[${slug}] pageerror:`, e.message));
  page.on('console', m => { if (m.type() === 'error') console.error(`[${slug}] console:`, m.text()); });
  await page.goto(`${BASE}#${slug}`, { waitUntil: 'load' });
  // wait until the inline script signals ready (Babel finished compiling + first paint)
  await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  // give layout a beat to settle (fonts, images)
  await page.waitForTimeout(600);
  const file = new URL(`${slug}.png`, OUT).pathname;
  await page.screenshot({ path: file, fullPage: true });
  const { w, h } = await page.evaluate(() => ({ w: document.body.scrollWidth, h: document.body.scrollHeight }));
  console.log(`${slug}: ${w}x${h} -> ${file}`);
  await ctx.close();
}
await browser.close();
