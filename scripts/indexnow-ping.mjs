#!/usr/bin/env node
// IndexNow ping script — submits all sitemap URLs to Bing's IndexNow endpoint.
//
// IndexNow is the closest thing to a push-to-ChatGPT-Search mechanism that
// exists: Bing's index is pinged → OAI-SearchBot retrieves from Bing → cited
// in ChatGPT Search. Google does NOT consume IndexNow; for Google use Search
// Console sitemap submission.
//
// Run after every production deploy:
//   node scripts/indexnow-ping.mjs
//
// References:
//   https://www.indexnow.org/
//   https://www.bing.com/indexnow
//   IndexNow key file is served at /<key>.txt at site root.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOST = 'code-rescue.com';
const KEY = '01a2426b39c57264ac5013d8631ae9c5ff2a760c8b949d9b96164218c86260a1';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read built sitemap to extract URL list.
const sitemapPath = resolve(__dirname, '..', 'dist', 'sitemap-0.xml');

let xml;
try {
  xml = readFileSync(sitemapPath, 'utf-8');
} catch (err) {
  console.error(`Cannot read ${sitemapPath}. Run \`pnpm build\` first.`);
  process.exit(1);
}

const urlList = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
  (m) => m[1]
);

if (urlList.length === 0) {
  console.error('No <loc> entries found in sitemap.');
  process.exit(1);
}

console.log(`Submitting ${urlList.length} URLs to IndexNow…`);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow response: ${res.status} ${res.statusText}`);
if (res.status === 200 || res.status === 202) {
  console.log('Submitted successfully.');
} else {
  const text = await res.text();
  console.error(`IndexNow error body: ${text}`);
  process.exit(1);
}
