---
displayId: no-concrete-resolver-import-outside-factory
area: identity
severity: error
language: typescript
lockedOn: "2026-04-02"
origin: "_shared/identifiers.md PCI-10 + Feature Preamble INV-4 (canonical-identity-migration-v2 Layer 0b) — vendor-abstraction boundary"
verbatim: true
gloss: "Files outside packages/api/lib/parcel-resolver/ MUST NOT import RegridResolver, AttomResolver, ManualResolver, or vendor clients directly. Use getParcelResolver(ctx) factory. A single direct import breaks env-var vendor-swap guarantees permanently."
cites:
  - PCI-5
---

```yaml
# Layer 0b (canonical-identity-migration-v2) — INV-4 / PCI-10
# Rule: no-concrete-resolver-import-outside-factory
# Source: feature contract canonical-identity-migration-v2.md Layer 0b
# Source: _shared/identifiers.md PCI-10 (vendor-abstraction boundary)
# Source: Feature Preamble INV-4 (vendor abstraction is pluggable by configuration)
# Source: docs/remediation/cto-decisions.md C-104(e) (vendor-abstraction-layer required shape)
#
# Router code MUST import resolver capabilities only from
# `packages/api/lib/parcel-resolver/` via the `getParcelResolver(ctx)`
# factory. Direct imports of concrete resolvers (`RegridResolver`,
# `AttomResolver`, `ManualResolver`) or vendor clients (`RegridClient`,
# `AttomClient`, `SmartyUsPropertyClient`) from files outside that
# directory are FORBIDDEN.
#
# Rationale (from INV-4 / PCI-10):
#   The factory pattern allows v1 to ship with only Regrid at runtime
#   while carrying the full `attom` type enum; the swap-set changes from
#   `{regrid, manual}` to `{regrid, attom}` purely by changing
#   `PLW_PRIMARY_RESOLVER` with zero code changes. A single direct import
#   anywhere in `packages/api/` breaks that guarantee permanently.
#
# DETECTION STRATEGY:
#   Match any `import_statement` whose `import_clause` contains a named
#   import of any forbidden identifier. ast-grep's `pattern: <Identifier>`
#   inside `import_clause > has > any` matches the imported identifier
#   tokens. The `files:` scope restricts the scan; the `ignores:` list
#   exempts:
#     - the factory directory itself (`packages/api/lib/parcel-resolver/**`),
#       where the concrete classes legitimately live;
#     - test files (`*.test.ts`, `*.spec.ts`);
#     - the explicit allowlist files `backfill-upi.ts` and
#       `parcel-reconcile.ts`, which call concrete resolvers directly
#       per RISK-42 + the Layer 0b allowlist.
#
# SCOPE: enforced across `packages/api/**`,
# `packages/database/scripts/**`, and `apps/**` per RISK-42.

id: no-concrete-resolver-import-outside-factory
language: typescript
severity: error
message: |
  INV-4 violation: import concrete resolver or vendor client directly —
  use getParcelResolver(ctx) from packages/api/lib/parcel-resolver/ instead.

  Wrong:
    import { RegridResolver } from "@repo/api/lib/parcel-resolver/regrid";
    const resolver = new RegridResolver();

  Right:
    import { getParcelResolver } from "@repo/api/lib/parcel-resolver";
    const resolver = getParcelResolver(ctx);

  The factory's env-var-driven vendor selection (PLW_PRIMARY_RESOLVER)
  is the ONLY approved chokepoint for resolver access in router /
  procedure / wizard code. Direct imports of concrete classes break the
  vendor-swap guarantee permanently. Per _shared/identifiers.md PCI-10
  and Feature Preamble INV-4.

note: "See _shared/identifiers.md PCI-10 and canonical-identity-migration-v2 Layer Brief 0b INV-4"
files:
  - "packages/api/**/*.ts"
  - "packages/database/scripts/**/*.ts"
  - "apps/**/*.ts"
ignores:
  - "**/node_modules/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/integration/**"
  - "**/__test-helpers__/**"
  - "packages/api/lib/parcel-resolver/**"
  - "packages/database/scripts/backfill-upi.ts"
  - "packages/api/jobs/parcel-reconcile.ts"
rule:
  kind: import_statement
  has:
    stopBy: end
    kind: identifier
    any:
      - regex: "^RegridResolver$"
      - regex: "^AttomResolver$"
      - regex: "^ManualResolver$"
      - regex: "^RegridClient$"
      - regex: "^AttomClient$"
      - regex: "^SmartyUsPropertyClient$"
```
