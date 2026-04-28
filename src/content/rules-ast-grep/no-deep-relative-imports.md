---
displayId: no-deep-relative-imports
area: monorepo
severity: error
language: typescript
lockedOn: "2026-01-16"
origin: "Constitution Principle IV — Architecture Boundaries; cross-package imports via relative paths bypass dependency-cruiser and break mobile-ready boundaries"
verbatim: true
gloss: "Imports with 3+ levels of ../ indicate cross-package monorepo boundary violations. Use @repo/* path aliases instead. dependency-cruiser cannot enforce boundaries through deep relative imports."
cites: []
---

```yaml
# Rule: no-deep-relative-imports
# Constitution Principle IV: Architecture Boundaries
#
# Imports with 3+ levels of ../ indicate cross-package boundary violations
# in the PLW monorepo. Use @repo/* path aliases for cross-package imports.

id: no-deep-relative-imports
language: typescript
severity: error
message: |
  Deep relative import detected (3+ levels of ../). This likely crosses
  monorepo package boundaries.

  Use @repo/* path aliases instead:
    import { db } from '@repo/database';
    import { canAccess } from '@repo/api/permissions';
    import { auth } from '@repo/auth';

  Cross-package imports via relative paths bypass dependency-cruiser rules
  and break the mobile-ready package boundary (Constitution Principle VIII).

note: "See Constitution Principle IV: Architecture Boundaries"
ignores:
  - "**/*.spec.ts"
  - "**/*.test.ts"
  - "**/*.e2e.ts"
rule:
  kind: string_fragment
  regex: "^\\.\\./\\.\\./\\.\\./"
  inside:
    kind: import_statement
    stopBy: end
```
