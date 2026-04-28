---
displayId: no-float-money
area: api
severity: error
language: typescript
lockedOn: "2026-02-18"
origin: "Methodology Enforcement Layer — financial calculations MUST use integer cents; parseFloat / toFixed cause penny rounding errors that accumulate across transactions"
verbatim: true
gloss: "parseFloat() and toFixed() forbidden in router files. Use Zod z.number().int() for integer input validation. Integer-cents arithmetic for trust accounting. Display formatting belongs in UI components, not API routers."
cites: []
---

```yaml
# Rule: no-float-money
# Methodology v3: Enforcement Layer
#
# Financial calculations MUST use integer cents, never floating point.
# parseFloat() and toFixed() on money values cause penny rounding errors
# that accumulate across transactions — a trust accounting violation.
#
# This rule catches parseFloat() and toFixed() in router files.
# Display formatting (toLocaleString for UI) is allowed in apps/ components
# but NOT in API routers where calculations happen.
#
# NOTE: This catches ALL parseFloat/toFixed in routers, not just financial
# contexts. This is intentional — there's no legitimate use of parseFloat
# in a tRPC router. Number parsing should use Zod's z.number() or z.coerce.number().

id: no-float-money
language: typescript
severity: error
message: |
  parseFloat() or toFixed() detected in API code. Financial calculations
  MUST use integer cents, never floating point.

  Wrong:  const fee = parseFloat(amount) * 0.05
  Wrong:  const display = (cents / 100).toFixed(2)
  Right:  const feeCents = Math.floor((amountCents * 500) / 10000)
  Right:  Use Zod z.number().int() for integer input validation

  parseFloat creates floating point rounding errors that accumulate
  across transactions. toFixed rounds unpredictably (banker's rounding).
  Trust accounting requires penny-exact calculations using integers.

  For display formatting, use Intl.NumberFormat in UI components (apps/),
  not in API routers.
note: "See research paper Part 5.1: Trust Accounting"
ignores:
  - "**/node_modules/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/integration/**"
  - "**/migrations/**"
  - "**/components/**"
  - "**/features/**"
  - "**/lib/utils.ts"
rule:
  any:
    - pattern: parseFloat($$$)
    - pattern: $VALUE.toFixed($$$)
```
