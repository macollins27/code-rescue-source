---
displayId: no-zod-any
area: api
severity: error
language: typescript
lockedOn: "2026-02-18"
origin: "checklists/procedures.md — Zod Schemas; auditors check schema rigor on tRPC inputs as evidence of input-validation discipline"
verbatim: true
gloss: "z.any(), z.unknown(), .passthrough(), z.record(z.unknown()) bypass input validation entirely. Any payload passes through unchecked. Every input field must have a typed, bounded Zod schema."
cites: []
---

```yaml
# Rule: no-zod-any
# Source: checklists/procedures.md — Zod Schemas
#
# z.any(), z.unknown(), .passthrough(), and z.record(z.unknown()) bypass
# input validation entirely. Any payload — megabyte strings, nested objects,
# prototype pollution payloads — passes through unchecked.
#
# Every input field MUST have a typed, bounded Zod schema.

id: no-zod-any
language: typescript
severity: error
message: |
  Unsafe Zod schema detected. z.any(), z.unknown(), .passthrough(), and
  z.record(z.unknown()) bypass input validation entirely.

  Wrong:  z.any()
  Wrong:  z.unknown()
  Wrong:  z.object({}).passthrough()
  Wrong:  z.record(z.unknown())
  Right:  z.object({ name: z.string().min(1).max(200) })
  Right:  z.record(z.string().max(200), z.string().max(1000))

note: "See checklists/procedures.md: Zod Schemas"
ignores:
  - "**/node_modules/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/integration/**"
  - "**/migrations/**"
rule:
  any:
    - pattern: z.any()
    - pattern: z.unknown()
    - pattern: $SCHEMA.passthrough()
    - pattern: z.record(z.unknown())
```
