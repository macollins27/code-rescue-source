---
displayId: no-unchecked-fetch
area: api
severity: warn
language: typescript
lockedOn: "2026-02-18"
origin: "Due diligence audit finding #4 — fetch() without response.ok check silently processes error responses"
verbatim: true
gloss: "fetch() returning non-2xx (401, 429, 500) returns error JSON. Parsing as expected type produces silent corruption. Always check response.ok before .json()."
cites: []
---

```yaml
# Rule: no-unchecked-fetch
# Due Diligence Finding #4: fetch() without response.ok check silently processes error responses.
#
# When fetch() returns a non-2xx status (401, 429, 500), the response body is often
# an error object, not the expected data. Parsing it as the expected type leads to
# silent data corruption or incorrect behavior.
#
# Note: This rule catches the common pattern of immediately calling .json() on the
# fetch response without checking .ok first. It cannot catch all cases (e.g., when
# the response is stored in a variable and checked later), but catches the most
# dangerous pattern.

id: no-unchecked-fetch
language: typescript
severity: warning
message: |
  fetch() response should be checked with response.ok before parsing.
  A non-2xx response (401, 429, 500) returns error JSON that will be silently
  misinterpreted as valid data.

  Wrong:  const data = await fetch(url).then(r => r.json())
  Wrong:  const response = await fetch(url); const data = await response.json()
  Right:  const response = await fetch(url); if (!response.ok) { handle error } const data = await response.json()

note: "Due diligence audit: unchecked fetch = silent failure on API errors"
ignores:
  - "**/*.spec.ts"
  - "**/*.test.ts"
  - "**/*.e2e.ts"
  - "**/node_modules/**"
rule:
  pattern: await (await fetch($$$)).json()
```
