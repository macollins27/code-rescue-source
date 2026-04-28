---
displayId: no-bare-toHaveBeenCalled
area: tests
severity: error
language: typescript
lockedOn: "2026-04-04"
origin: "INC-002 — assertion-quality companion to the fake-tests defenses"
verbatim: true
gloss: "Bare positive .toHaveBeenCalled() proves the function ran but not what arguments it received. Use .toHaveBeenCalledWith() — bare form is the #1 most common test mistake in PLW."
cites:
  - require-caller-in-tests
---

```yaml
# Stage 0.4.7d 2026-04-07: narrowed to exclude .not.toHaveBeenCalled() (legitimate negative assertion, no arguments to check by definition)
# Rule: no-bare-toHaveBeenCalled
# Source: checklists/tests-trpc.md — Assert mock ARGUMENTS
#
# This rule fires on BARE POSITIVE .toHaveBeenCalled() assertions. The
# .not.toHaveBeenCalled() form is EXEMPT because a mock that was never
# called has no arguments to verify — the rule's premise does not apply.
# If you see `.not.toHaveBeenCalled()`, that's a legitimate assertion of
# absence, not a weak positive assertion.
#
# .toHaveBeenCalled() without .toHaveBeenCalledWith() is a fake test.
# It proves the function ran but NOT what it did. The procedure could
# pass { status: "YOLO" } to the database and this assertion passes.
#
# This is the #1 most common test mistake in this codebase. It caused
# multiple agent spirals where "all tests pass" but the code is broken.
#
# Scope: ONLY test files — this is a test quality rule.

id: no-bare-toHaveBeenCalled
language: typescript
severity: error
message: |
  Bare positive .toHaveBeenCalled() detected. This proves the function
  ran but NOT what arguments it received. Use .toHaveBeenCalledWith().

  Wrong:  expect(mockSet).toHaveBeenCalled()
  Wrong:  expect(writeAuditLog).toHaveBeenCalled()
  Right:  expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({ status: "inactive" }))
  Right:  expect(writeAuditLog).toHaveBeenCalledWith(expect.objectContaining({ action: "create" }))

  A test that only checks .toHaveBeenCalled() will pass even if the
  procedure sends completely wrong data to the database.

  NOTE: .not.toHaveBeenCalled() is EXEMPT from this rule. A mock that
  was never invoked has no arguments to check — asserting absence is
  a legitimate and valuable assertion. This rule only targets bare
  POSITIVE .toHaveBeenCalled() where argument verification is possible
  and required.

note: "See checklists/tests-trpc.md: Assert mock ARGUMENTS not return values"
ignores:
  - "**/node_modules/**"
  - "**/migrations/**"
rule:
  all:
    - pattern: $EXPECT.toHaveBeenCalled()
    - inside:
        any:
          - kind: expression_statement
          - kind: call_expression
    - not:
        follows:
          pattern: $EXPECT.toHaveBeenCalledWith($$$)
    - not:
        pattern: $X.not.toHaveBeenCalled()
```
