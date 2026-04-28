---
displayId: require-caller-in-tests
area: tests
severity: error
language: typescript
lockedOn: "2026-04-04"
origin: "INC-002 — 4,800 fake tests deleted; 200+ bugs found by QA the suite had certified clean"
verbatim: true
gloss: "Every it() block in router/integration tests must call the actual tRPC procedure via caller.<domain>.<procedure>() or createCaller(). The litmus test: delete the router — does the test still pass?"
cites:
  - require-router-import-in-tests
  - no-bare-toHaveBeenCalled
  - block-empty-cast-in-tests
  - block-vague-test-names
---

```yaml
# Rule: require-caller-in-tests
# Source: CLAUDE.md — Every Test Calls the Production Code
#
# THE LITMUS TEST: If you delete the production router and the test still
# passes, the test is broken. It is testing nothing.
#
# Every it() block in router/integration tests MUST call the actual tRPC
# procedure via one of:
#   - createCaller(ctx).domain.procedure()      (unit tests)
#   - caller.domain.procedure()                 (integration tests)
#   - createTestCaller({...})                   (integration test setup)
#   - createUnauthenticatedCaller()             (integration test setup)
#
# A test that only sets up mocks and asserts on mock return values is
# FAKE — it proves nothing about the production code. This rule caused
# the deletion of 4,800 fake tests and the discovery of 200+ real bugs.
#
# Scope: router and integration test files only.
# Excludes: lib tests (test pure functions), e2e tests (use Playwright).

id: require-caller-in-tests
language: typescript
severity: error
message: |
  FAKE TEST: This test block does not call production code.

  Every it() block MUST call the actual tRPC procedure under test:
    - Unit:        createCaller(ctx).domain.procedure(input)
    - Integration: caller.domain.procedure(input)
    - Integration: const caller = await createTestCaller({...})

  A test that only asserts on mocks is worthless. It will pass even
  if the production code is deleted. Fix: add a real procedure call.

note: "See CLAUDE.md: THE LITMUS TEST — delete the router, does the test still pass?"
files:
  - "**/routers/**/*.test.ts"
  - "**/routers/**/*.prop.test.ts"
  - "**/integration/**/*.test.ts"
  - "**/integration/**/*.integration.test.ts"
ignores:
  - "**/node_modules/**"
  - "**/__test-helpers__/**"
  - "**/test-utils/**"
  - "**/setup.ts"
  # Stage 0.4.7 2026-04-07 — temporary suppression pending Stage 1.1
  # properties-crud.integration.test.ts lines 672, 699, 2513 test DATABASE
  # unique constraint behavior directly via testDb.insert() (no tRPC procedure
  # call). They test the current (broken) (smartyKey, organizationId) unique
  # constraint. Stage 1.1 schema migration will drop organizationId from
  # properties per C-13 and rebuild smartyKey as a GLOBAL partial unique index —
  # these tests MUST be rewritten or deleted then. REMOVE this ignores entry
  # during Stage 1.1.
  - "**/integration/properties-crud.integration.test.ts"
rule:
  pattern: it($NAME, $$$BODY)
  not:
    has:
      stopBy: end
      any:
        - pattern: createCaller($$$ARGS)
        - pattern: createTestCaller($$$ARGS)
        - pattern: createUnauthenticatedCaller($$$ARGS)
        - pattern: caller.$DOMAIN.$PROC($$$ARGS)
```
