---
displayId: no-hard-delete
area: schema
severity: error
language: typescript
lockedOn: "2026-02-05"
origin: "Constitution Principle VIII (Mobile-Ready Foundation) — soft deletes everywhere; hard deletes destroy audit trails, break mobile sync, violate due diligence"
verbatim: true
gloss: "db.delete() and tx.delete() on soft-deletable tables are forbidden. Use .update().set(softDeleteSet()) instead. The only exception is session-cleanup.ts for expired auth sessions."
cites:
  - require-softDeleteSet
  - DR-36
---

```yaml
# Rule: no-hard-delete
# Constitution: Soft Deletes Everywhere
#
# Every table has a deletedAt column. Records are NEVER hard-deleted —
# use .set({ deletedAt: new Date() }) via Drizzle update instead.
# Hard deletes destroy audit trails, break mobile sync delta queries,
# and violate due diligence requirements.
#
# EXCEPTION: packages/api/lib/session-cleanup.ts is allowed to hard-delete
# expired auth sessions because they are not user-visible data, are not
# synced to mobile, and expired rows have no business value. Better Auth
# manages session lifecycle — soft delete would cause auth to treat
# expired sessions as still valid.
#
# Scope: Only matches db.delete() and tx.delete() — the two Drizzle
# access patterns used in this codebase. Does NOT match Map.delete(),
# Set.delete(), or other JS built-in .delete() calls because those
# use different receiver names (store, cache, etc.).

id: no-hard-delete
language: typescript
severity: error
message: |
  Hard delete detected. Use soft delete instead: .update(table).set({ deletedAt: new Date() })

  Wrong:  db.delete(users).where(...)
  Wrong:  tx.delete(assets).where(...)
  Right:  db.update(users).set({ deletedAt: new Date() }).where(...)

  Hard deletes destroy audit trails, break mobile sync, and violate
  PLW Constitution (soft deletes everywhere). The ONLY exception is
  session-cleanup.ts for expired auth sessions.

note: "See CLAUDE.md: Never do db.delete(table) — use soft delete"
ignores:
  - "**/node_modules/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/integration/**"
  - "**/migrations/**"
  - "**/legacy/**"
  - "**/session-cleanup.ts"
rule:
  any:
    # Direct db.delete(table) — the standard Drizzle import pattern
    - pattern: db.delete($TABLE)
    # Transaction context: tx.delete(table) — inside db.transaction(async (tx) => ...)
    - pattern: tx.delete($TABLE)
```
