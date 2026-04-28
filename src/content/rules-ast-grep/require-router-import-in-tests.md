---
displayId: require-router-import-in-tests
area: tests
severity: error
language: typescript
lockedOn: "2026-04-04"
origin: "INC-002 — 4,800 fake tests; companion to require-caller-in-tests"
verbatim: true
gloss: "Test files in routers/ must import a router. Without the router, the test cannot exercise production code — it's all mocks."
cites:
  - require-caller-in-tests
---

```yaml
# Rule: require-router-import-in-tests
# Source: CLAUDE.md — Every Test Calls the Production Code
#
# A router test file that doesn't import a router cannot possibly be
# testing production code. This catches entirely fake test files where
# the agent wrote mocks and assertions but never connected to real code.
#
# The import must contain "Router" (e.g., propertiesRouter, assetsRouter,
# eventsRouter) to match the project's naming convention.
#
# Scope: router test files only (not integration — those use createTestCaller).

id: require-router-import-in-tests
language: typescript
severity: error
message: |
  FAKE TEST FILE: No router imported. A router test file must import
  the router under test (e.g., propertiesRouter, assetsRouter).

  Without a router import, this file cannot test production code.
  It is exercising mocks only.

  Required:
    import { propertiesRouter } from "./properties";

note: "See CLAUDE.md: Every test must call the actual production procedure"
files:
  - "**/routers/**/*.test.ts"
  - "**/routers/**/*.prop.test.ts"
ignores:
  - "**/node_modules/**"
  - "**/__test-helpers__/**"
  - "**/test-utils/**"
  - "**/setup.ts"
  # Stage 0.4.7 2026-04-07 — test-context-audit.test.ts is a Stage 0.4.7b stub
  # awaiting Stage 2.N rewrite via /test-write. The stub has no router import
  # because the original file was a fake test with no real procedure under test.
  # REMOVE this ignores entry when Stage 2 rewrites the file with a real router
  # import and proper test coverage.
  - "**/routers/test-context-audit.test.ts"
rule:
  kind: program
  not:
    has:
      stopBy: end
      kind: import_statement
      regex: "Router"
```
