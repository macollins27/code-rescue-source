#!/usr/bin/env node
// OG image generator for Code Rescue.
//
// Emits 1200×630 PNGs to public/og/*.png + public/og-default.png. Each page
// can reference its own image via the `ogImage` prop on the Page layout;
// pages without a custom image fall back to /og-default.png.
//
// Pattern adapted from MAC-Ecosystem/code-rescue-website's next/og setup —
// same satori + resvg toolchain, Code Rescue methodology branding instead
// of the broader services brand (burnt orange on paper, Inter Tight).
//
// Run: pnpm og
//
// Satori supports TTF / OTF / WOFF (not WOFF2). Inter Tight is on Google
// Fonts; we ask via a legacy Firefox UA so the CSS comes back with WOFF
// URLs instead of WOFF2.

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// ── Brand tokens (match src/styles/global.css :root) ─────────────────────
const PAPER = '#fafaf7';
const INK = '#1a1a1a';
const INK_3 = '#5a5a55';
const RULE = '#d8d6cc';
const ACCENT = '#b1471c';

const SIZE = { width: 1200, height: 630 };

// ── Font loader (Google Fonts WOFF hack) ──────────────────────────────────
const LEGACY_UA =
  'Mozilla/5.0 (Windows NT 6.0; WOW64; rv:2.0) Gecko/20100101 Firefox/4.0';

async function loadGoogleFont(family, weights) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights.join(';')}&display=swap`;
  const css = await (
    await fetch(url, { headers: { 'User-Agent': LEGACY_UA } })
  ).text();

  const blocks = [
    ...css.matchAll(
      /font-weight:\s*(\d+);[\s\S]*?src:\s*url\((https:[^)]+)\)\s*format\('(truetype|opentype|woff)'\)/g,
    ),
  ];

  const fonts = await Promise.all(
    blocks
      .filter((m) => weights.includes(Number(m[1])))
      .map(async (m) => ({
        name: family.replace(/\+/g, ' '),
        data: await (await fetch(m[2])).arrayBuffer(),
        weight: Number(m[1]),
        style: 'normal',
      })),
  );

  if (fonts.length === 0) {
    throw new Error(`No fonts loaded for ${family} weights ${weights.join(',')}`);
  }
  return fonts;
}

// ── Card layout (every parent div explicitly display: flex) ───────────────
function buildCard({ eyebrow, title, description, footerRight }) {
  const bodyChildren = [];
  if (eyebrow) {
    bodyChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignSelf: 'flex-start',
          padding: '8px 16px',
          marginBottom: 24,
          border: `1px solid ${ACCENT}`,
          color: ACCENT,
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: 'Inter Tight',
        },
        children: eyebrow,
      },
    });
  }

  const titleSize = title.length > 70 ? 56 : title.length > 40 ? 64 : 72;
  bodyChildren.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        fontSize: titleSize,
        fontWeight: 600,
        color: INK,
        letterSpacing: '-0.025em',
        lineHeight: 1.05,
        fontFamily: 'Inter Tight',
      },
      children: title,
    },
  });

  if (description) {
    bodyChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          marginTop: 24,
          fontSize: 24,
          color: INK_3,
          lineHeight: 1.4,
          letterSpacing: '-0.005em',
          fontFamily: 'Inter Tight',
        },
        children: description,
      },
    });
  }

  const body = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1040,
      },
      children: bodyChildren,
    },
  };

  // Logo: orange bar + "Code Rescue" text
  const logo = {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: 14 },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: 14,
              height: 32,
              backgroundColor: ACCENT,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 28,
              fontWeight: 600,
              color: INK,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter Tight',
            },
            children: 'Code Rescue',
          },
        },
      ],
    },
  };

  // Footer: "code-rescue.com" left + optional right label
  const footerChildren = [
    {
      type: 'div',
      props: {
        style: { display: 'flex', alignItems: 'center', gap: 12 },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: 9,
                height: 9,
                borderRadius: 999,
                backgroundColor: ACCENT,
              },
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex' },
              children: 'code-rescue.com',
            },
          },
        ],
      },
    },
  ];

  if (footerRight) {
    footerChildren.push({
      type: 'div',
      props: {
        style: { display: 'flex' },
        children: footerRight,
      },
    });
  }

  const footer = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: 20,
        color: INK_3,
        letterSpacing: '-0.005em',
        fontFamily: 'Inter Tight',
      },
      children: footerChildren,
    },
  };

  // Inner column (logo / body / footer)
  const innerColumn = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 80,
      },
      children: [logo, body, footer],
    },
  };

  // Hairline inset border
  const border = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        position: 'absolute',
        top: 24,
        left: 24,
        right: 24,
        bottom: 24,
        border: `1px solid ${RULE}`,
        borderRadius: 12,
      },
    },
  };

  // Root card
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: PAPER,
        fontFamily: 'Inter Tight',
      },
      children: [border, innerColumn],
    },
  };
}

async function renderToPng(spec, fonts) {
  const svg = await satori(buildCard(spec), {
    ...SIZE,
    fonts,
    embedFont: true,
  });
  return new Resvg(svg, {
    fitTo: { mode: 'width', value: SIZE.width },
  })
    .render()
    .asPng();
}

const PAGES = [
  {
    output: 'public/og-default.png',
    spec: {
      title: 'Every claim on this site has a source.',
      description:
        'AI-augmented engineering and due-diligence audits for codebases that have to survive review.',
    },
  },
  {
    output: 'public/og/methodology.png',
    spec: {
      eyebrow: 'DRDD Manifesto v2',
      title: 'Domain-Rules-Driven Development.',
      description:
        'Four commitments. Twelve rules of a domain rule. Two anatomy specimens.',
      footerRight: 'locked 2026-04-11',
    },
  },
  {
    output: 'public/og/audit.png',
    spec: {
      eyebrow: 'DRDD-A · 5 days · $25–40K',
      title: 'A 30-to-43 page technical due-diligence audit, defensible in committee.',
      description:
        'Five business days. Read-only access. Source-first findings. Partner-ready PDF.',
    },
  },
  {
    output: 'public/og/install.png',
    spec: {
      eyebrow: 'DRDD-I · 6–8 weeks · $80–150K',
      title: 'The methodology, installed in your repo.',
      description:
        'Constitution, gates, hooks, rule packs, QA harness, dispatch protocol.',
    },
  },
  {
    output: 'public/og/constitution.png',
    spec: {
      eyebrow: 'Constitution · v3.0.0',
      title: 'Eight non-negotiable principles.',
      description:
        'Read in two minutes. Cited from every locked rule and gate. Ratified 2026-03-16.',
    },
  },
  {
    output: 'public/og/rules.png',
    spec: {
      eyebrow: 'Public corpus',
      title: 'The rule corpus. Three layers, every entry sourced.',
      description:
        'ast-grep at edit + gate. Hookify at the keystroke. Domain rules as the spec.',
    },
  },
  {
    output: 'public/og/incidents.png',
    spec: {
      eyebrow: 'Failure catalog',
      title: 'We catalog our failures. Each one becomes a permanent rule.',
      description:
        'Nine catalogued incidents. Every one has a date, a session id, and a locked rule.',
    },
  },
];

async function main() {
  console.log('Loading Inter Tight…');
  const fonts = await loadGoogleFont('Inter+Tight', [500, 600]);
  console.log(`Loaded ${fonts.length} font weight(s).`);

  await mkdir(resolve(ROOT, 'public', 'og'), { recursive: true });

  for (const { output, spec } of PAGES) {
    const png = await renderToPng(spec, fonts);
    await writeFile(resolve(ROOT, output), png);
    console.log(`✓ ${output} (${(png.length / 1024).toFixed(1)} KB)`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
