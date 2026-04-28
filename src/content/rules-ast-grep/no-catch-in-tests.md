---
displayId: no-catch-in-tests
area: tests
severity: error
language: typescript
lockedOn: "2026-01-18"
origin: "/test-audit Pass 3 — .catch() swallows assertion failures"
verbatim: true
gloss: ".catch() on a promise in test code silently eats real errors."
cites: []
---

```yaml
# Rule: no-catch-in-tests
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
      - pattern: $PROMISE.catch(($ERR:$TYPE) => { return $ERR; })
```
