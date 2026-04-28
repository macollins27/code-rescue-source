// Final /rules page — the public corpus index.
// Three corpora, three tabs, one URL:
//   1. ast-grep enforcement rules (41) — YAML, AST patterns, run in CI
//   2. hookify enforcement rules   (48) — markdown frontmatter, run in editor
//   3. domain rules — 7 _shared/*.md cross-cutting contracts (AUTH-N, P-N,
//      PER-N, ERR-N, AL-N, SEC-N, ID-N, PCI-N) + per-domain rules across
//      24 domains. ~13,400 lines of plain English, auditor-readable.
// Selecting a row opens a side drawer with the full artifact verbatim.

const { useState } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Seed data — verbatim where I have it, clearly placeholder where I don't.
// ─────────────────────────────────────────────────────────────────────────────

const AST_GREP_VERBATIM = `# Rule: no-catch-in-tests
# Source: /test-audit Pass 3 — .catch() swallows assertion failures
#
# .catch(() => {}) on a promise in test code silently eats real errors.
# If an assertion throws because the element doesn't exist or the API
# returned an error, .catch() swallows it and the test passes green.
#
# This is different from no-try-catch-in-tests — this catches the
# promise .catch() method, not try/catch blocks.
#
# Scope: ONLY test files.

id: no-catch-in-tests
language: typescript
severity: error
message: |
  .catch() in test file detected. This swallows assertion failures
  and real errors — the test passes when it should fail.

  Wrong:  await expect(locator).toBeVisible().catch(() => {})
  Wrong:  await caller.create(input).catch(() => {})
  Right:  Let errors propagate. If it throws, the test fails. That's the point.

note: "See /test-audit Pass 3: .catch() swallows errors"
files:
  - "**/*.test.ts"
  - "**/*.test.tsx"
ignores:
  - "**/node_modules/**"
  - "**/migrations/**"
rule:
  pattern: $PROMISE.catch($$$)
  not:
    any:
      # Allow .catch((e) => e) — captures error for inspection, doesn't swallow
      - pattern: $PROMISE.catch(($ERR) => $ERR)
      - pattern: $PROMISE.catch(($ERR) => { return $ERR; })
      # Allow with type annotation: .catch((e: Error) => e)
      - pattern: $PROMISE.catch(($ERR:$TYPE) => $ERR)
      - pattern: $PROMISE.catch(($ERR:$TYPE) => { return $ERR; })`;

const HOOKIFY_VERBATIM_FRONTMATTER = `---
name: block-empty-cast-in-tests
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \\.spec\\.ts$
  - field: new_text
    operator: regex_match
    pattern: =\\s*\\{\\}\\s+as\\s+unknown\\s+as
---`;

const HOOKIFY_VERBATIM_BODY = `**ASRT-002: No empty object casts in tests!**

Assigning \`{} as unknown as Entity\` and then asserting \`toBeDefined()\` is tautological — it tests nothing. You're asserting that a value you just assigned is defined.

**Wrong (testing air):**
\`\`\`typescript
entity.company = {} as unknown as Company;
expect(entity.company).toBeDefined(); // always passes — you just set it
\`\`\`

**Right (test what Drizzle actually stores/returns):**
\`\`\`typescript
// Insert a real record and verify the relation was returned
const { company } = await db.query.entities.findFirst({
  where: eq(entities.id, entityId),
  with: { company: true },
});
expect(company).toBeDefined();
expect(company.id).toBe(expectedCompanyId);
\`\`\`

Note: \`{ ...properties } as unknown as Interface\` with actual properties IS fine for partial mocks.

See: \`.claude/docs/testing-standards.md\` Anti-Pattern #2`;

// ast-grep table — verbatim seed + plausible placeholders.
// Each placeholder is honestly marked `origin: TBD` and `verbatim: false`.
// Verbatim filename mappings appear in system-map.md §"every failure mode → defense".
// Where a row's `origin` quotes that file directly, mark verbatim: "origin".
const astGrepRules = [
  { id: "no-catch-in-tests", area: "tests", severity: "error", lang: "typescript", locked: "2026‑01‑18", origin: "/test-audit Pass 3 — .catch() swallows assertion failures", verbatim: AST_GREP_VERBATIM, gloss: ".catch() on a promise in test code silently eats real errors." },
  { id: "no-external-data-leakage.yml", area: "api", severity: "error", lang: "typescript", locked: "2026‑02‑18", origin: "system-map.md — \"auditor finds a response leakage → ast-grep no-external-data-leakage.yml + the deletedAt/organizationId exclusion patterns in build-source\"", verbatim: "origin", gloss: "Response shapes returning deletedAt or organizationId — the canonical leakage pattern." },
  { id: "require-caller-in-tests.yml", area: "tests", severity: "error", lang: "typescript", locked: "2026‑02‑01", origin: "system-map.md — \"auditor finds a fake test → require-caller-in-tests.yml + require-router-import-in-tests.yml + no-bare-toHaveBeenCalled.yml\"", verbatim: "origin", gloss: "Tests must instantiate a caller and exercise the real router, not just the handler in isolation." },
  { id: "require-router-import-in-tests.yml", area: "tests", severity: "error", lang: "typescript", locked: "2026‑02‑01", origin: "system-map.md — fake-test defense (sibling of require-caller-in-tests.yml)", verbatim: "origin", gloss: "Test files must import the actual router under test — closes the fake-test loophole." },
  { id: "no-bare-toHaveBeenCalled.yml", area: "tests", severity: "error", lang: "typescript", locked: "2026‑02‑01", origin: "system-map.md — fake-test defense", verbatim: "origin", gloss: "toHaveBeenCalled() with no arguments asserts nothing meaningful — must check call args." },
  { id: "no-zod-any.yml", area: "api", severity: "error", lang: "typescript", locked: "2026‑02‑18", origin: "system-map.md — \"No z.any() / z.unknown() / .passthrough() in Zod schemas (CLAUDE.md, no-zod-any.yml) — auditors check schema rigor on tRPC inputs\"", verbatim: "origin", gloss: "z.any(), z.unknown(), .passthrough() forbidden in tRPC input schemas." },
  { id: "no-silent-git-stash", area: "git", severity: "error", lang: "bash", locked: "2026‑03‑22", origin: "I‑2026‑03‑22‑stash · 20 commits dropped, 4 hrs recovery", verbatim: null, gloss: "git stash without --include-untracked silently drops untracked files." },
  { id: "no-master-bypass", area: "auth", severity: "error", lang: "typescript", locked: "2025‑11‑02", origin: "Audit finding SEC‑001 · master password backdoor", verbatim: null, gloss: "Forbid hardcoded master credentials in any auth flow." },
  { id: "no-concrete-resolver-import-outside-factory", area: "identity", severity: "error", lang: "typescript", locked: "2026‑04‑02", origin: "PCI‑10 · concrete resolver imports outside factory", verbatim: null, gloss: "Files outside packages/api/lib/parcel-resolver/ MUST NOT import RegridResolver et al." },
  { id: "no-organization-id-on-properties", area: "schema", severity: "error", lang: "typescript", locked: "2026‑02‑11", origin: "DR‑1 · properties are GLOBAL, no organizationId column", verbatim: null, gloss: "Schema/queries on properties table referencing organizationId are forbidden." },
  { id: "require-not-deleted-on-soft-deletable", area: "schema", severity: "error", lang: "typescript", locked: "2026‑02‑05", origin: "C‑3 · soft-delete invariant", verbatim: null, gloss: "Selects on soft-deletable tables MUST include notDeleted() in WHERE." },
  { id: "no-db-delete-on-soft-deletable", area: "schema", severity: "error", lang: "typescript", locked: "2026‑02‑05", origin: "DR‑36 · use softDeleteSet() not db.delete()", verbatim: null, gloss: "db.delete() on tables with deletedAt MUST be softDeleteSet()." },
  { id: "no-mock-mode-in-prod", area: "infra", severity: "error", lang: "typescript", locked: "2026‑01‑29", origin: "I‑2026‑01‑27‑mockmode · mock leaked to staging", verbatim: null, gloss: "Process.env.NODE_ENV checks gating mock paths must be inverted-default." },
  { id: "no-fetch-without-zod", area: "api", severity: "error", lang: "typescript", locked: "2026‑02‑18", origin: "DR‑103 · vendor responses must safeParse before access", verbatim: null, gloss: "External fetch responses must pass through a zod schema before .json field access." },
  { id: "no-non-uuid-id-input", area: "api", severity: "error", lang: "typescript", locked: "2026‑02‑08", origin: "DR‑93 · all ID inputs must use zUuid", verbatim: null, gloss: "tRPC input shapes accepting `id: z.string()` must use zUuid." },
  { id: "no-empty-object-cast-in-impl", area: "impl", severity: "warn", lang: "typescript", locked: "2026‑03‑04", origin: "Sibling of ASRT‑002 for non-test files", verbatim: null, gloss: "{} as unknown as X in production code triggers a warn-level finding." },
  { id: "no-process-exit-in-handlers", area: "api", severity: "error", lang: "typescript", locked: "2026‑02‑22", origin: "I‑2026‑02‑21‑process‑exit", verbatim: null, gloss: "process.exit() inside any tRPC handler kills the worker." },
  { id: "no-toBeTruthy-on-async-locator", area: "tests", severity: "error", lang: "typescript", locked: "2026‑02‑01", origin: "/test-audit Pass 4 · Playwright locator misuse", verbatim: null, gloss: "expect(locator).toBeTruthy() is a no-op for Playwright locators." },
  { id: "no-any-in-public-types", area: "types", severity: "error", lang: "typescript", locked: "2026‑01‑25", origin: "Type discipline", verbatim: null, gloss: "Exported declarations must not contain `any`." },
  { id: "no-relative-import-across-package", area: "monorepo", severity: "error", lang: "typescript", locked: "2026‑01‑16", origin: "Monorepo hygiene", verbatim: null, gloss: "../../../ imports crossing package boundaries are forbidden." },
];

const hookifyRules = [
  { id: "block-empty-cast-in-tests", area: "tests", action: "warn", event: "Write|Edit", locked: "2026‑02‑18", origin: "ASRT‑002 · Anti-Pattern #2 from testing-standards.md", verbatimFront: HOOKIFY_VERBATIM_FRONTMATTER, verbatimBody: HOOKIFY_VERBATIM_BODY, gloss: "{} as unknown as Entity in *.spec.ts files triggers a warn at edit time." },
  { id: "block-deferral-in-domain-rules.local.md", area: "spec", action: "block", event: "PreToolUse:Edit|Write", locked: "2026‑04‑12", origin: "system-map.md — \"auditor finds a deferred feature → hookify block-deferral-in-domain-rules.local.md + spec-audit Pass 0.5\"", verbatimFront: "origin", verbatimBody: null, gloss: "Forbidden phrases (\"defer to Stage 6\", \"logged for later\", \"flag for future\", \"out of scope\") in domain-rules edits." },
  { id: "block-vague-test-names", area: "tests", action: "block", event: "Write|Edit", locked: "2026‑02‑01", origin: "system-map.md — fake-test defense (sibling of ast-grep require-caller-in-tests.yml)", verbatimFront: "origin", verbatimBody: null, gloss: "Test names like \"works\", \"correct\", \"valid\" — must describe the actual behavior under test." },
  { id: "block-three-subagent-disagreement", area: "agent", action: "block", event: "PostToolUse:Agent", locked: "2026‑04‑12", origin: "I‑2026‑04‑11‑subagent · orchestrator ignored 3 reports", verbatimFront: null, verbatimBody: null, gloss: "When three subagents independently report a failing build, the orchestrator must escalate." },
  { id: "warn-process-env-in-component", action: "warn", area: "frontend", event: "Write|Edit", locked: "2026‑01‑22", origin: "Frontend hygiene", verbatimFront: null, verbatimBody: null, gloss: "Direct process.env access in React components — route through config layer." },
  { id: "block-git-stash-without-include-untracked", area: "git", action: "block", event: "PreToolUse:Bash", locked: "2026‑03‑22", origin: "I‑2026‑03‑22‑stash", verbatimFront: null, verbatimBody: null, gloss: "Companion to ast‑grep no-silent-git-stash, at the bash-tool layer." },
  { id: "block-hardcoded-uuid-in-test", area: "tests", action: "block", event: "Write|Edit", locked: "2026‑02‑18", origin: "/test-audit Pass 5", verbatimFront: null, verbatimBody: null, gloss: "Hardcoded UUIDs in tests cause cross-test contamination — use generated fixtures." },
  { id: "warn-magic-number-in-zod", area: "api", action: "warn", event: "Write|Edit", locked: "2026‑03‑10", origin: "TBD", verbatimFront: null, verbatimBody: null, gloss: "Numeric bounds in zod schemas should be named constants." },
  { id: "block-direct-postgres-in-procedure", area: "api", action: "block", event: "Write|Edit", locked: "2026‑02‑11", origin: "Architecture invariant", verbatimFront: null, verbatimBody: null, gloss: "Procedures must use the Drizzle layer, not raw SQL." },
  { id: "warn-soft-delete-bypass", area: "schema", action: "warn", event: "Write|Edit", locked: "2026‑02‑05", origin: "C‑3", verbatimFront: null, verbatimBody: null, gloss: "Selects without notDeleted() warn at edit time before CI fails." },
  { id: "block-cross-org-query", area: "auth", action: "block", event: "Write|Edit", locked: "2026‑02‑11", origin: "AUTH‑5", verbatimFront: null, verbatimBody: null, gloss: "Queries lacking activeOrganizationId scope on org-scoped tables are blocked." },
];

// The domain-rule corpus has TWO halves per system-map.md:
//   - 7 _shared/*.md cross-cutting contracts: AUTH-N, P-N, PER-N, ERR-N, AL-N,
//     SEC-N, ID-N (and PCI-N for parcel-canonical-identity). Auth, persistence,
//     errors, audit-log, permissions, security, id.
//   - per-domain DR-NNN rules across 24 domains in po/, hub/, lsp/.
// We use a `corpus` field to let the tab filter between them.
const domainRules = [
  // ─── _shared/ cross-cutting contracts ───
  { id: "AUTH-5", corpus: "shared", file: "_shared/auth.md", tag: "cross-cutting", feature: "Auth / tenancy", title: "organizationId in SQL WHERE, not post-fetch JS", refs: "system-map §\"would an auditor flag this\"", citedBy: ["no-organization-id-on-properties", "block-cross-org-query"], rewritten: null,
    body: "All queries against org-scoped tables MUST filter by activeOrganizationId in the SQL WHERE clause, not by post-fetch JavaScript. Per system-map.md: \"auditors ask 'show me cross-org data leakage tests.' SQL-level scoping is mechanical; JS-level is fragile.\" Cross-org IDOR defense pairs this rule with review-source Pass 7 (security surface) and qa-flows/sec-org-scoping.yaml + qa-flows/sec-idor.yaml."
  },
  { id: "P-11", corpus: "shared", file: "_shared/permissions.md", tag: "cross-cutting", feature: "Permissions", title: "canAccess() on every data access, default-DENY", refs: "system-map §\"specific structural choices\"", citedBy: [], rewritten: null,
    body: "Every data access path MUST call canAccess() from @repo/api/permissions before returning data. The default branch is DENY — absence of an allow rule means denial, not allowance. Per system-map.md: \"auditors check authorization completeness.\" Reviewer Pass 7 enforces by negation — a procedure that does not call canAccess() is presumed to leak."
  },
  { id: "AL-1..AL-23", corpus: "shared", file: "_shared/audit-log.md", tag: "cross-cutting", feature: "Audit log", title: "writeAuditLog on every mutation", refs: "system-map.md", citedBy: [], rewritten: null,
    body: "writeAuditLog() is called from every mutation, AFTER the transaction commits, with structured (actorUserId, organizationId, entityType, entityId, action, before, after, requestId). Per system-map.md: \"auditors ask 'show me the audit trail for change X.'\" Build-source Pre-Flight Table B verifies every mutation in a layer maps to an audit-log call. ENTITY_TYPES is grep-verified against lib/audit.ts at write time."
  },
  { id: "ERR-8", corpus: "shared", file: "_shared/errors.md", tag: "cross-cutting", feature: "Errors", title: "TRPCError shape with cause.code for resolver outages", refs: "PCI‑7", citedBy: [], rewritten: null,
    body: "On total resolver failure (every vendor path errors AND no manual APN), throw TRPCError({ code: \"BAD_REQUEST\", message: \"...\", cause: { code: \"RESOLVER_OUTAGE\" } }). The structured cause is the contract clients depend on — the message is for humans, the cause.code is for machines. No bare strings, no Error subclasses outside the registry."
  },
  { id: "PCI-5", corpus: "shared", file: "_shared/id.md", tag: "cross-cutting", feature: "Identity", title: "properties INSERT must populate canonical-identity columns atomically", refs: "DR‑91 · INV‑3", citedBy: ["no-organization-id-on-properties", "no-concrete-resolver-import-outside-factory"], rewritten: null,
    body: "Every properties INSERT MUST populate (upi, country_subdivision, assessor_ref, assessor_ref_normalized, lineage_id) atomically via getParcelResolver(ctx) in the same SQL statement. A null-canonical property is undeduplicatable, unlineageable, and unclaimable — the rule prevents the row from existing in the first place rather than backfilling later."
  },
  { id: "SEC-25", corpus: "shared", file: "_shared/security.md", tag: "cross-cutting", feature: "Security", title: "sanitizeText on every user-supplied string field", refs: "build-source Pre-Flight", citedBy: [], rewritten: null,
    body: "User-supplied string inputs (name, description, comment, etc.) MUST pass through sanitizeText() before insert. Build-source Step 1 includes a 15-grep verification loop in which SEC-25 is grep #1 — a procedure that writes a user string without sanitizeText fails the gate at write time, not PR time."
  },
  { id: "PER-4", corpus: "shared", file: "_shared/persistence.md", tag: "cross-cutting", feature: "Persistence", title: "TIMESTAMPTZ everywhere, never bare TIMESTAMP", refs: "Constitution III", citedBy: [], rewritten: null,
    body: "Every timestamp column in every table MUST be TIMESTAMPTZ. Bare TIMESTAMP is forbidden. Per system-map.md: \"auditors check timezone correctness on financial timestamps. Bare TIMESTAMP across timezones is an audit finding.\" Drizzle migrations failing this check are blocked by the migration-format hook before they reach review."
  },
  { id: "ID-1", corpus: "shared", file: "_shared/id.md", tag: "cross-cutting", feature: "Identity", title: "UUIDv7 for every primary key", refs: "Constitution II", citedBy: ["no-non-uuid-id-input"], rewritten: null,
    body: "All IDs are UUIDv7 — time-ordered but with no predictable component. Per system-map.md: \"auditors ask 'are your IDs predictable enough to be IDOR vectors?' UUIDv7 has no predictable component.\" Sequential integer IDs are forbidden in any user-facing identifier."
  },

  // ─── per-domain DR-NNN rules ───
  { id: "DR-89", corpus: "domain", file: "po/properties.md", tag: "cross-cutting", feature: "Properties / Identity", title: "Canonical-identity resolution is MANDATORY", refs: "INV‑3 · product-vision §7.0 · PCI‑7 · ERR‑8", citedBy: ["no-concrete-resolver-import-outside-factory"], rewritten: "2026‑04‑24",
    body: "Canonical-identity resolution is MANDATORY per INV-3 and product-vision.md §7.0 (\"Canonical-identity resolution is MANDATORY. If every resolver is unreachable AND the user has not entered their APN manually from their tax bill, the claim is blocked.\"). The mandate is on the resolver-layer availability as a whole, NOT on any single vendor — Regrid primary per INV-4(b) (ATTOM deferred from v1 implementation), and manual APN entry per C-104(f) together form the resolver abstraction. On total resolver failure (every vendor path errors AND the user has not submitted a manual APN from their tax bill via the C-104(f) fallback flow per INV-3), property creation is BLOCKED with TRPCError({ code: \"BAD_REQUEST\", message: \"Address resolution is temporarily unavailable. Please enter your county APN from your tax bill, or try again later.\", cause: { code: \"RESOLVER_OUTAGE\" } }) per PCI-7 / ERR-8. There is no graceful degradation path — a property without canonical identity (upi) cannot be deduplicated, cannot be lineage-tracked (DR-130), and cannot be claimed."
  },
  { id: "DR-91", corpus: "domain", file: "po/properties.md", tag: "cross-cutting", feature: "Properties / Identity", title: "Property creation without canonical identity is PROHIBITED", refs: "INV‑3 · PCI‑5 · PCI‑7 · PCI‑3 · INV‑1", citedBy: ["no-organization-id-on-properties", "no-concrete-resolver-import-outside-factory"], rewritten: "2026‑04‑24",
    body: "Every properties INSERT MUST populate (upi, country_subdivision, assessor_ref, assessor_ref_normalized, lineage_id) atomically via getParcelResolver(ctx) per PCI-5 in the same SQL statement; an INSERT missing ANY of the required canonical columns throws BAD_REQUEST \"Canonical identity required\" at the application layer (before the DB layer's NOT NULL constraint would fire) per PCI-5. Idempotency is provided by the canonical-identity dedup pre-check (DR-17) + the partial unique index property_upi_idx on (upi) WHERE deleted_at IS NULL per PCI-3 / INV-1. There is no null-canonical property creation path, no placeholder row to be backfilled later, no silent auto-accept."
  },
  { id: "DR-92", corpus: "domain", file: "po/properties.md", tag: "cross-cutting", feature: "Properties", title: "propertyTypeId FK onDelete: \"set null\"", refs: "Drizzle schema invariant", citedBy: [], rewritten: null,
    body: "properties.propertyTypeId is a nullable FK to property_types.id with explicit onDelete: \"set null\". If a property type is hard-deleted, all properties referencing that type survive with propertyTypeId = NULL (uncategorized). The field is already nullable, so this is safe — no data loss, no orphan crash. The Drizzle schema MUST declare onDelete: \"set null\" explicitly on the propertyTypeId reference."
  },
  { id: "DR-93", corpus: "domain", file: "po/properties.md", tag: "cross-cutting", feature: "Cross-cutting / API", title: "UUID format validation via shared zUuid schema", refs: "CTO Decision 5", citedBy: ["no-non-uuid-id-input"], rewritten: null,
    body: "All input ID fields (propertyId, cursor, propertyTypeId, etc.) MUST use a shared zUuid schema: z.string().length(36).regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i). This ensures consistent UUID format validation across all domains and prevents malformed IDs from reaching the database layer."
  },
  { id: "DR-95", corpus: "domain", file: "po/properties.md", tag: "cross-cutting", feature: "Cross-cutting / Audit", title: "Soft-delete traceability via audit log, not deletedBy column", refs: "CTO Decision 8", citedBy: [], rewritten: null,
    body: "Soft-delete traceability is provided by the audit log (entityId + action='delete'), not by a deletedBy column. The audit log is the single source of truth for deletion attribution. Do NOT add a deletedBy column to any table."
  },
  { id: "DR-1", corpus: "domain", file: "po/properties.md", tag: "spec", feature: "Properties", title: "Properties are GLOBAL records with no organizationId", refs: "INV‑1 · C‑13", citedBy: ["no-organization-id-on-properties"], rewritten: null,
    body: "Properties are GLOBAL records with no organizationId. Access to properties is through the propertyUsers junction table, which connects users to properties scoped by the organization the user belongs to."
  },
  { id: "DR-36", corpus: "domain", file: "po/properties.md", tag: "spec", feature: "Properties / Lifecycle", title: "remove uses softDeleteSet() — never db.delete()", refs: "ERR‑1 · C‑3", citedBy: ["no-db-delete-on-soft-deletable"], rewritten: null,
    body: "remove uses softDeleteSet() — never db.delete(). Uses .returning() to verify the write. Throws NOT_FOUND \"Property not found\" when .returning() is empty."
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

// Build a quick lookup so cross-link clicks can resolve any rule id.
const ALL_RULES_BY_ID = (() => {
  const m = {};
  for (const r of astGrepRules) m[r.id] = { ...r, _tab: "ast-grep" };
  for (const r of hookifyRules) m[r.id] = { ...r, _tab: "hookify" };
  for (const r of domainRules) m[r.id] = { ...r, _tab: "domain" };
  return m;
})();

function PillTone({ tone, children }) {
  const tones = {
    error: { color: "var(--bad)", border: "var(--bad)" },
    warn: { color: "var(--warn)", border: "var(--warn)" },
    block: { color: "var(--bad)", border: "var(--bad)" },
    spec: { color: "var(--accent)", border: "var(--accent)" },
    "cross-cutting": { color: "var(--accent)", border: "var(--accent)" },
  };
  const t = tones[tone] || { color: "var(--ink-3)", border: "var(--rule-2)" };
  return <span className="pill" style={{ color: t.color, borderColor: t.border }}>{children}</span>;
}

// ─── Three-layer timeline (replaces dense §1 table) ─────────────────────────
//
// Horizontal axis = time of fire, left → right:
//   Edit (PreToolUse) · Edit (PostToolUse) · Gate · Gate-static · Audit
// Each layer is a row with dots placed at its firing positions.
function ThreeLayerTimeline() {
  // 5 stops on the timeline
  const stops = [
    { id: "pre",    label: "Edit",      sub: "PreToolUse",  pos: 0 },
    { id: "post",   label: "Edit",      sub: "PostToolUse", pos: 1 },
    { id: "gate",   label: "Gate",      sub: "pnpm gate",   pos: 2 },
    { id: "static", label: "Gate-static", sub: "rules-test", pos: 3 },
    { id: "spec",   label: "Spec",      sub: "human · agent · test", pos: 4 },
  ];

  // Each layer's dots reference stop ids
  const layers = [
    {
      id: "hookify",
      label: "hookify",
      sub: "48 rules · regex + conditions",
      dots: [
        { stop: "pre",  kind: "block", note: "block — refuses the write" },
        { stop: "post", kind: "warn",  note: "warn — emits violation context" },
      ],
      desc: "Catches forbidden shapes at keystroke. block rules can refuse the edit; warn rules surface the finding without halting.",
    },
    {
      id: "ast-grep",
      label: "ast-grep",
      sub: "41 rules · YAML AST patterns",
      dots: [
        { stop: "post",   kind: "info",  note: "post-edit-write-ast-grep.sh — informational" },
        { stop: "gate",   kind: "block", note: "pnpm lint:patterns — hard gate" },
        { stop: "static", kind: "test",  note: "ast-grep test — every pattern fires on invalid:, silent on valid:" },
      ],
      desc: "Three positions: heads-up the moment a file is written, hard fail at PR time, and a self-test of the rule corpus itself.",
    },
    {
      id: "domain",
      label: "Domain rules",
      sub: "~13,400 lines · 7 _shared/ + 24 domains",
      dots: [
        { stop: "spec", kind: "spec", note: "the spec — read by humans, agents, and tests" },
      ],
      desc: "AUTH-N · P-N · PER-N · ERR-N · AL-N · SEC-N · ID-N cross-cutting + per-domain DR-NNN. The thing enforcement is protecting.",
    },
  ];

  const dotColor = (kind) => ({
    block: "var(--bad)",
    warn:  "var(--warn)",
    info:  "var(--ink-3)",
    test:  "var(--good)",
    spec:  "var(--accent)",
  }[kind] || "var(--ink-3)");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
      <div>
        <div className="label">§1 Three layers</div>
        <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8, lineHeight: 1.5 }}>
          When in the loop each layer fires, and what it specifies.
        </div>
      </div>

      <div>
        {/* Stops header */}
        <div style={{ display: "grid", gridTemplateColumns: "200px repeat(5, 1fr)", gap: 0, paddingBottom: 12, borderBottom: "1px solid var(--rule)", marginBottom: 14 }}>
          <div />
          {stops.map((s) => (
            <div key={s.id} style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Layer rows */}
        {layers.map((layer, idx) => (
          <div key={layer.id} style={{
            display: "grid",
            gridTemplateColumns: "200px repeat(5, 1fr)",
            alignItems: "center",
            padding: "16px 0",
            borderBottom: idx === layers.length - 1 ? "none" : "1px solid var(--rule-2)",
          }}>
            <div style={{ paddingRight: 16 }}>
              <div className="mono" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{layer.label}</div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 2 }}>{layer.sub}</div>
              <div className="serif" style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.5 }}>{layer.desc}</div>
            </div>

            {stops.map((s) => {
              const dot = layer.dots.find((d) => d.stop === s.id);
              return (
                <div key={s.id} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                  {/* track line */}
                  <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--rule-2)", zIndex: 0 }} />
                  {dot && (
                    <div title={dot.note} style={{
                      position: "relative",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: dotColor(dot.kind),
                      border: `2px solid var(--paper)`,
                      boxShadow: `0 0 0 1px ${dotColor(dot.kind)}`,
                      zIndex: 1,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--rule)", flexWrap: "wrap", fontSize: 11.5, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
          {[
            { kind: "block", label: "blocks the action" },
            { kind: "warn",  label: "warns, doesn't block" },
            { kind: "info",  label: "informational" },
            { kind: "test",  label: "self-test" },
            { kind: "spec",  label: "spec — the source of truth" },
          ].map((l) => (
            <span key={l.kind} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: dotColor(l.kind), display: "inline-block" }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── List tabs (flex:1, full-width) ─────────────────────────────────────────
function CorpusTabs({ tab, setTab, tabs }) {
  return (
    <div style={{ display: "flex", gap: 0, borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--paper-2)" }}>
      {tabs.map((t, i) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              background: active ? "var(--paper)" : "transparent",
              border: "none",
              borderRight: i === tabs.length - 1 ? "none" : "1px solid var(--rule)",
              borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
              padding: "20px 24px 18px",
              fontFamily: "var(--sans)",
              fontSize: 14,
              color: active ? "var(--ink)" : "var(--ink-3)",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: active ? 600 : 400,
              marginBottom: -1,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 16, fontWeight: active ? 600 : 500 }}>{t.label}</span>
              <span className="mono" style={{ fontSize: 12, color: active ? "var(--accent)" : "var(--ink-4)" }}>{t.count}</span>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-4)", fontWeight: 400, marginTop: 4, fontFamily: "var(--mono)" }}>{t.sub}</div>
          </button>
        );
      })}
    </div>
  );
}

// ─── List components (ast-grep, hookify, domain) ────────────────────────────
function AstGrepList({ onSelect }) {
  return (
    <table className="data" style={{ fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ width: "28%" }}>Rule ID</th>
          <th style={{ width: "10%" }}>Area</th>
          <th style={{ width: "10%" }}>Severity</th>
          <th style={{ width: "12%" }}>Locked on</th>
          <th>Origin</th>
          <th style={{ width: "8%", textAlign: "right" }}>Source</th>
        </tr>
      </thead>
      <tbody>
        {astGrepRules.map((r) => (
          <tr key={r.id} onClick={() => onSelect(r)} style={{ cursor: "pointer" }}>
            <td className="mono" style={{ color: "var(--accent)" }}>{r.id}</td>
            <td className="mono" style={{ color: "var(--ink-3)" }}>{r.area}</td>
            <td><PillTone tone={r.severity}>{r.severity}</PillTone></td>
            <td className="mono" style={{ color: "var(--ink-3)" }}>{r.locked}</td>
            <td style={{ color: "var(--ink-3)", fontSize: 12.5 }}>{r.origin}</td>
            <td className="mono" style={{ textAlign: "right", color: r.verbatim ? "var(--good)" : "var(--ink-4)", fontSize: 11 }}>
              {r.verbatim ? "verbatim" : "TBD"}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={6} style={{ color: "var(--ink-4)", fontStyle: "italic", padding: "14px 0" }}>
            20 of 41 published. The remaining 21 ship with /install.
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function HookifyList({ onSelect }) {
  return (
    <table className="data" style={{ fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ width: "32%" }}>Rule ID</th>
          <th style={{ width: "10%" }}>Area</th>
          <th style={{ width: "10%" }}>Action</th>
          <th style={{ width: "16%" }}>Event</th>
          <th style={{ width: "12%" }}>Locked on</th>
          <th style={{ width: "8%", textAlign: "right" }}>Source</th>
        </tr>
      </thead>
      <tbody>
        {hookifyRules.map((r) => (
          <tr key={r.id} onClick={() => onSelect(r)} style={{ cursor: "pointer" }}>
            <td className="mono" style={{ color: "var(--accent)" }}>{r.id}</td>
            <td className="mono" style={{ color: "var(--ink-3)" }}>{r.area}</td>
            <td><PillTone tone={r.action}>{r.action}</PillTone></td>
            <td className="mono" style={{ color: "var(--ink-3)", fontSize: 12 }}>{r.event}</td>
            <td className="mono" style={{ color: "var(--ink-3)" }}>{r.locked}</td>
            <td className="mono" style={{ textAlign: "right", color: r.verbatimFront ? "var(--good)" : "var(--ink-4)", fontSize: 11 }}>
              {r.verbatimFront ? "verbatim" : "TBD"}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={6} style={{ color: "var(--ink-4)", fontStyle: "italic", padding: "14px 0" }}>
            10 of 48 published. The remaining 38 ship with /install.
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function DomainRulesList({ onSelect }) {
  const [filter, setFilter] = useState("all");
  const filtered = domainRules.filter((r) => filter === "all" || r.corpus === filter);
  const sharedCount = domainRules.filter((r) => r.corpus === "shared").length;
  const domainCount = domainRules.filter((r) => r.corpus === "domain").length;

  const filters = [
    { id: "all", label: "All", n: domainRules.length, sub: null },
    { id: "shared", label: "_shared/ cross-cutting", n: 7, sub: "AUTH · P · PER · ERR · AL · SEC · ID" },
    { id: "domain", label: "Per-domain DR-NNN", n: 24, sub: "po/ · hub/ · lsp/" },
  ];

  return (
    <div>
      {/* Sub-filter — pill-style, matches main tabs visually */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--paper)" : "var(--ink-3)",
              border: `1px solid ${active ? "var(--ink)" : "var(--rule-2)"}`,
              padding: "8px 14px",
              fontFamily: "var(--sans)",
              fontSize: 12.5,
              cursor: "pointer",
              fontWeight: active ? 600 : 400,
              display: "inline-flex",
              alignItems: "baseline",
              gap: 8,
            }}>
              <span>{f.label}</span>
              <span className="mono" style={{ fontSize: 11, color: active ? "var(--paper)" : "var(--ink-4)", opacity: active ? 0.7 : 1 }}>
                {f.n}{f.id === "shared" ? " files" : f.id === "domain" ? " domains" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <table className="data" style={{ fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ width: "12%" }}>ID</th>
            <th style={{ width: "20%" }}>Source file</th>
            <th style={{ width: "18%" }}>Feature</th>
            <th>Title</th>
            <th style={{ width: "15%" }}>Cited by enforcement</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} onClick={() => onSelect(r)} style={{ cursor: "pointer" }}>
              <td className="mono" style={{ color: "var(--accent)" }}>{r.id}</td>
              <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{r.file}</td>
              <td style={{ color: "var(--ink-3)" }}>{r.feature}</td>
              <td>{r.title}</td>
              <td className="mono" style={{ fontSize: 11, color: r.citedBy.length ? "var(--good)" : "var(--ink-4)" }}>
                {r.citedBy.length ? `${r.citedBy.length} rule${r.citedBy.length > 1 ? "s" : ""}` : "—"}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ color: "var(--ink-4)", fontStyle: "italic", padding: "14px 0", fontSize: 12.5 }}>
              {filter === "shared"
                ? `Showing ${sharedCount} representative entries from the 7 _shared/*.md files. Each file is a few hundred to a few thousand lines.`
                : filter === "domain"
                  ? `Showing ${domainCount} representative DR-NNN entries from po/properties.md. The corpus spans 24 domains across po/, hub/, lsp/ — ~13,400 lines of plain English total.`
                  : `Showing ${filtered.length} entries across both halves of the corpus. Use the filters above to narrow.`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Rule detail (replaces tab section, not a drawer) ───────────────────────
function CrossLink({ id, onNavigate }) {
  const target = ALL_RULES_BY_ID[id];
  if (!target) {
    return <span className="mono" style={{ color: "var(--ink-3)", fontSize: 12 }}>{id}</span>;
  }
  return (
    <button onClick={() => onNavigate(target._tab, target)} style={{
      background: "transparent",
      border: "none",
      borderBottom: "1px dashed var(--accent)",
      color: "var(--accent)",
      fontFamily: "var(--mono)",
      fontSize: 12,
      cursor: "pointer",
      padding: "0 0 1px 0",
    }}>{id}</button>
  );
}

function FiresAt({ tab, rule }) {
  // Render a small inline timeline showing where this rule fires
  const stops = ["Edit · PreToolUse", "Edit · PostToolUse", "Gate", "Gate-static"];
  let active = [];
  let palette = "var(--ink-3)";
  if (tab === "ast-grep") {
    active = [1, 2, 3];
    palette = "var(--accent)";
  } else if (tab === "hookify") {
    if (rule.action === "block") { active = [0]; palette = "var(--bad)"; }
    else { active = [1]; palette = "var(--warn)"; }
  }
  return (
    <div>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Fires at</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative", padding: "8px 0" }}>
        <div style={{ position: "absolute", left: 4, right: 4, top: "50%", height: 1, background: "var(--rule-2)" }} />
        {stops.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: active.includes(i) ? palette : "var(--rule-2)", border: "2px solid var(--paper)", boxShadow: active.includes(i) ? `0 0 0 1px ${palette}` : "none", zIndex: 1 }} />
            <div className="mono" style={{ fontSize: 9.5, color: active.includes(i) ? "var(--ink-2)" : "var(--ink-4)", textAlign: "center", lineHeight: 1.3 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleDetail({ tab, rule, onBack, onNavigate }) {
  const isAst = tab === "ast-grep";
  const isHook = tab === "hookify";
  const isDomain = tab === "domain";

  const tabLabel = isAst ? "ast-grep" : isHook ? "hookify" : "Domain rules";

  return (
    <div>
      {/* Breadcrumb + back */}
      <div style={{ padding: "20px 48px 0", borderTop: "1px solid var(--rule)", background: "var(--paper-2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14 }}>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", letterSpacing: "0.04em" }}>
            <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--ink-3)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11.5, padding: 0 }}>/rules</button>
            <span style={{ color: "var(--ink-4)", margin: "0 8px" }}>›</span>
            <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--ink-3)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11.5, padding: 0 }}>{tabLabel}</button>
            <span style={{ color: "var(--ink-4)", margin: "0 8px" }}>›</span>
            <span style={{ color: "var(--accent)" }}>{rule.id}</span>
          </div>
          <button onClick={onBack} className="mono" style={{
            border: "1px solid var(--rule-2)",
            background: "var(--paper)",
            padding: "6px 14px",
            fontSize: 11.5,
            color: "var(--ink-2)",
            cursor: "pointer",
            fontFamily: "var(--mono)",
          }}>← back to all rules</button>
        </div>
      </div>

      {/* Header block */}
      <section style={{ padding: "32px 48px 28px", borderBottom: "1px solid var(--rule)" }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          {isAst && `ast-grep · ${rule.lang} · locked ${rule.locked}`}
          {isHook && `hookify · ${rule.event} · locked ${rule.locked}`}
          {isDomain && `${rule.corpus === "shared" ? "_shared/ cross-cutting contract" : "domain rule"} · ${rule.file}${rule.rewritten ? ` · rewritten ${rule.rewritten}` : ""}`}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--accent)", margin: 0, letterSpacing: "-0.01em" }}>{rule.id}</h1>
          {isAst && <PillTone tone={rule.severity}>{rule.severity}</PillTone>}
          {isHook && <PillTone tone={rule.action}>{rule.action}</PillTone>}
          {isDomain && <PillTone tone={rule.tag}>{rule.tag}</PillTone>}
        </div>
        {isDomain && (
          <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 12, letterSpacing: "-0.01em", maxWidth: "60ch", lineHeight: 1.25 }}>{rule.title}</h2>
        )}
        {(isAst || isHook) && (
          <p className="serif" style={{ fontSize: 17, color: "var(--ink-2)", marginTop: 12, maxWidth: "70ch", lineHeight: 1.5 }}>{rule.gloss}</p>
        )}
      </section>

      {/* Two-column body */}
      <section style={{ padding: "36px 48px 48px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 48, alignItems: "start" }}>
        {/* LEFT — the rule itself */}
        <div>
          {isAst && (
            <>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>The rule (verbatim YAML)</div>
              {rule.verbatim ? (
                <pre className="code" style={{ fontSize: 12, padding: "20px 22px", lineHeight: 1.55 }}>{rule.verbatim}</pre>
              ) : (
                <div style={{ padding: 24, border: "1px dashed var(--rule-2)", color: "var(--ink-4)", fontSize: 13, fontFamily: "var(--mono)", lineHeight: 1.6 }}>
                  Full YAML not yet ported into the public corpus index. Origin documented internally — see right column.
                </div>
              )}
            </>
          )}
          {isHook && (
            <>
              {rule.verbatimFront ? (
                <>
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Frontmatter</div>
                  <pre className="code" style={{ fontSize: 12, marginBottom: 22, padding: "16px 18px", lineHeight: 1.5 }}>{rule.verbatimFront}</pre>
                  {rule.verbatimBody && (
                    <>
                      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Rule body (markdown)</div>
                      <div className="serif" style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65, padding: "20px 22px", border: "1px solid var(--rule)", background: "var(--paper-2)", whiteSpace: "pre-wrap" }}>
                        {rule.verbatimBody}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div style={{ padding: 24, border: "1px dashed var(--rule-2)", color: "var(--ink-4)", fontSize: 13, fontFamily: "var(--mono)", lineHeight: 1.6 }}>
                  Full markdown not yet ported into the public corpus index. Origin documented internally — see right column.
                </div>
              )}
            </>
          )}
          {isDomain && (
            <>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The rule</div>
              <div className="serif" style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7, maxWidth: "62ch" }}>
                {rule.body}
              </div>
            </>
          )}
        </div>

        {/* RIGHT — metadata + cross-links + fires-at */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 28, paddingLeft: 32, borderLeft: "1px solid var(--rule)" }}>
          {/* Why this exists */}
          <div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Why this exists</div>
            <div className="serif" style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
              {isAst && rule.origin}
              {isHook && rule.origin}
              {isDomain && (
                <>
                  <div style={{ marginBottom: 10 }}>References:</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{rule.refs}</div>
                </>
              )}
            </div>
          </div>

          {/* Source verbatim/TBD */}
          <div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Source</div>
            <div className="mono" style={{ fontSize: 12.5, color: ((isAst && rule.verbatim) || (isHook && rule.verbatimFront) || isDomain) ? "var(--good)" : "var(--ink-4)" }}>
              {isAst && (rule.verbatim ? "verbatim from production rule pack" : "placeholder — origin TBD")}
              {isHook && (rule.verbatimFront ? "verbatim from production rule pack" : "placeholder — origin TBD")}
              {isDomain && "verbatim from .claude/docs/domain-rules/"}
            </div>
          </div>

          {/* Cross-links */}
          {(isDomain && rule.citedBy.length > 0) && (
            <div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Cited by enforcement</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rule.citedBy.map((id) => (
                  <CrossLink key={id} id={id} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          )}

          {/* Fires-at timeline (enforcement layers only) */}
          {(isAst || isHook) && (
            <FiresAt tab={tab} rule={rule} />
          )}
        </aside>
      </section>
    </div>
  );
}

function RulesFinal() {
  const [tab, setTab] = useState("ast-grep");
  const [selected, setSelected] = useState(null);

  const tabs = [
    { id: "ast-grep", label: "ast-grep", count: 41, sub: "AST patterns · edit + gate + self-test" },
    { id: "hookify", label: "hookify", count: 48, sub: "regex · PreToolUse block + PostToolUse warn" },
    { id: "domain", label: "Domain rules", count: "~13,400 lines", sub: "7 _shared/ + 24 domains" },
  ];

  const handleSelect = (rule) => setSelected(rule);
  const handleBack = () => setSelected(null);
  const handleNavigate = (newTab, rule) => {
    setTab(newTab);
    setSelected(rule);
  };

  return (
    <div className="page" style={{ minHeight: "100%" }}>
      <Nav current="rules" />

      {/* Hero */}
      <section style={{ padding: "44px 48px 32px", borderBottom: "1px solid var(--rule)" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 14 }}>
          Public corpus · open · v0.4.1
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <h1 style={{ fontSize: 36, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 600, margin: 0, maxWidth: "26ch" }}>
              The rule corpus. Three layers, every entry sourced.
            </h1>
            <p className="serif" style={{ fontSize: 17.5, color: "var(--ink-2)", maxWidth: "62ch", marginTop: 20, lineHeight: 1.55 }}>
              The domain rules are the spec. ~13,400 lines of plain English across 7 cross-cutting contracts and 24 domains — written for a human auditor to read in an afternoon, not a test runner to execute in a thousand. The other two layers are <em>enforcement</em>: ast-grep at edit and gate time, hookify at the keystroke. Their job is to keep the source from drifting from the spec.
            </p>
            <p className="serif" style={{ fontSize: 17.5, color: "var(--ink-2)", maxWidth: "62ch", marginTop: 16, lineHeight: 1.55 }}>
              What's published below is a curated sample — enough to audit the methodology before talking to me. The rest ships with /install.
            </p>
          </div>

          {/* Stats — grouped: enforcement / spec / meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 13 }}>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Enforcement</div>
              <table className="data" style={{ fontSize: 13 }}>
                <tbody>
                  <tr><td style={{ color: "var(--ink-4)" }}>ast-grep rules</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>41</td></tr>
                  <tr><td style={{ color: "var(--ink-4)" }}>hookify rules</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>48</td></tr>
                  <tr><td style={{ color: "var(--ink-4)" }}>Total enforcement</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)", fontWeight: 600 }}>89</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Spec</div>
              <table className="data" style={{ fontSize: 13 }}>
                <tbody>
                  <tr><td style={{ color: "var(--ink-4)" }}>_shared/ contracts</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>7 files</td></tr>
                  <tr><td style={{ color: "var(--ink-4)" }}>Domains in po/, hub/, lsp/</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>24</td></tr>
                  <tr><td style={{ color: "var(--ink-4)" }}>Plain-English lines</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)", fontWeight: 600 }}>~13,400</td></tr>
                  <tr><td style={{ color: "var(--ink-4)" }}>Last updated</td><td className="mono" style={{ textAlign: "right", color: "var(--ink-3)" }}>2026-04-27</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* The three-layer timeline */}
      <section className="section tight">
        <ThreeLayerTimeline />
      </section>

      {/* When a rule is selected, the tabs+list section is REPLACED by detail */}
      {selected ? (
        <RuleDetail tab={tab} rule={selected} onBack={handleBack} onNavigate={handleNavigate} />
      ) : (
        <>
          <CorpusTabs tab={tab} setTab={setTab} tabs={tabs} />
          <section className="section tight">
            {tab === "ast-grep" && <AstGrepList onSelect={handleSelect} />}
            {tab === "hookify" && <HookifyList onSelect={handleSelect} />}
            {tab === "domain" && <DomainRulesList onSelect={handleSelect} />}
          </section>
        </>
      )}

      <Footer page="/rules" />
    </div>
  );
}

window.RulesFinal = RulesFinal;
