---
displayId: require-audit-log-on-insert
area: api
severity: warn
language: typescript
lockedOn: "2026-03-01"
origin: "Methodology Enforcement Layer — every mutation produces an audit log; auditors ask 'show me the audit trail for change X.'"
verbatim: true
gloss: ".insert() in router files triggers a warn at edit time. Verify writeAuditLog() is called after the mutation with the correct entityType, action, entityId. Property-based test (Layer 2) is the definitive check; this rule is a write-time reminder."
cites:
  - "AL-1..AL-23"
---

```yaml
# Rule: require-audit-log-on-insert
# Methodology v3: Enforcement Layer
#
# Every .insert() call in router files should be accompanied by a
# writeAuditLog() call. This rule catches .insert() in router files
# to flag locations where audit logging may be missing.
#
# LIMITATION: ast-grep cannot verify that writeAuditLog is called
# "near" or "after" the insert in the same function scope. This rule
# fires on every .insert() in routers/ as a WARNING — the developer
# must verify the audit log exists. Property-based tests (Layer 2)
# provide the definitive check by asserting writeAuditLog was called.
#
# This is intentionally a warning, not an error, because:
# 1. Some inserts are inside helpers called from procedures that DO audit
# 2. The property-based test is the real enforcement
# 3. This rule is a "hey, did you remember?" reminder at write time

id: require-audit-log-on-insert
language: typescript
severity: warning
message: |
  .insert() detected in router file. Verify that writeAuditLog() is called
  after this mutation with the correct entityType, action, and entityId.

  Every mutation (insert, update, soft-delete) MUST produce an audit log.
  The audit log write should be fire-and-forget with error logging:

    try {
      await writeAuditLog({ userId, organizationId, action: "create", ... });
    } catch (error) {
      console.error("[audit] Failed to write audit log", { entityId, error });
    }

  If this insert is inside a helper function and the calling procedure
  handles the audit log, this warning can be ignored.
note: "See gold standard: packages/api/routers/properties.ts"
ignores:
  - "**/node_modules/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/integration/**"
  - "**/migrations/**"
  - "**/lib/**"
  - "**/schema/**"
rule:
  pattern: $DB.insert($TABLE)
```
