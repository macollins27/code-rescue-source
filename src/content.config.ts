import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─── ast-grep enforcement rules ──────────────────────────────────────────────
const astGrepRules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rules-ast-grep' }),
  schema: z.object({
    displayId: z.string(),
    area: z.string(),
    severity: z.enum(['error', 'warn']),
    language: z.string(),
    lockedOn: z.string(),
    origin: z.string(),
    verbatim: z.boolean().default(false),
    gloss: z.string(),
    cites: z.array(z.string()).default([]),
  }),
});

// ─── hookify enforcement rules ───────────────────────────────────────────────
const hookifyRules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rules-hookify' }),
  schema: z.object({
    displayId: z.string(),
    area: z.string(),
    action: z.enum(['block', 'warn']),
    event: z.string(),
    lockedOn: z.string(),
    origin: z.string(),
    verbatim: z.boolean().default(false),
    gloss: z.string(),
    cites: z.array(z.string()).default([]),
  }),
});

// ─── domain rules (shared cross-cutting + per-domain DR-NNN) ─────────────────
const domainRules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rules-domain' }),
  schema: z.object({
    displayId: z.string(),
    corpus: z.enum(['shared', 'domain']),
    file: z.string(),
    tag: z.enum(['cross-cutting', 'spec', 'adversarial']),
    feature: z.string(),
    title: z.string(),
    refs: z.string(),
    citedBy: z.array(z.string()).default([]),
    rewritten: z.string().nullable().default(null),
  }),
});

// ─── Writing (long-form posts) ───────────────────────────────────────────────
const writing = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

// ─── Incident catalog ────────────────────────────────────────────────────────
const incidents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/incidents' }),
  schema: z.object({
    displayId: z.string(),
    date: z.string(),
    severity: z.enum(['crit', 'high', 'med']),
    title: z.string(),
    caughtBy: z.string(),
    featured: z.boolean().default(false),
    ruleDisplayId: z.string(),
    ruleKind: z.enum(['ast-grep', 'hookify', 'agent-review', 'qa-harness', 'human']).optional(),
    // Featured-only fields:
    session: z.string().optional(),
    cost: z.string().optional(),
    what: z.string().optional(),
    how: z.string().optional(),
    ruleSeverity: z.enum(['error', 'warn', 'block']).optional(),
    ruleLockedOn: z.string().optional(),
    ruleGloss: z.string().optional(),
    ruleYaml: z.string().optional(),
    ruleCites: z.array(z.string()).default([]),
  }),
});

export const collections = {
  'rules-ast-grep': astGrepRules,
  'rules-hookify': hookifyRules,
  'rules-domain': domainRules,
  'incidents': incidents,
  'writing': writing,
};
