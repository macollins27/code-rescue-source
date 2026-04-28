---
displayId: require-softDeleteSet
area: schema
severity: error
language: typescript
lockedOn: "2026-02-05"
origin: "checklists/procedures.md — Soft Deletes; companion to no-hard-delete"
verbatim: true
gloss: "Soft deletes must use the softDeleteSet() helper, never raw { deletedAt: new Date() }. The helper is the single point of control for soft-delete behavior across all mutations."
cites:
  - no-hard-delete
  - DR-36
---

```yaml
# Rule: require-softDeleteSet
# Source: checklists/procedures.md — Soft Deletes
#
# Soft deletes MUST use the softDeleteSet() helper, never raw
# { deletedAt: new Date() }. The helper ensures consistent format
# and is the single point of control for soft delete behavior.
#
# no-hard-delete catches db.delete(). This rule catches the other
# wrong pattern: .set({ deletedAt: new Date() }) bypassing the helper.

id: require-softDeleteSet
language: typescript
severity: error
message: |
  Raw deletedAt assignment detected. Use softDeleteSet() helper instead.

  Wrong:  .set({ deletedAt: new Date() })
  Right:  .set(softDeleteSet())

  Import: import { softDeleteSet } from "../lib/soft-delete";

  The softDeleteSet() helper ensures consistent soft delete behavior
  across all mutations. Raw Date() assignment bypasses this contract.

note: "See checklists/procedures.md: softDeleteSet"
ignores:
  - "**/node_modules/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/integration/**"
  - "**/migrations/**"
  - "**/lib/soft-delete*"
rule:
  pattern: "deletedAt: new Date()"
```
