---
displayId: no-external-data-leakage
area: api
severity: error
language: typescript
lockedOn: "2026-02-18"
origin: "Due diligence audit finding #6 — third-party data leakage classified as privacy violation"
verbatim: true
gloss: "window.open() with template-string URL leaks internal data (property IDs, user IDs, URLs) to external services. Generate assets locally."
cites: []
---

```yaml
# Rule: no-external-data-leakage
# Due Diligence Finding #6: Client-side calls to third-party APIs leak internal data.
#
# window.open() with a template string URL sends internal data (property IDs, user
# IDs, URLs) to external servers. Generate assets locally instead.

id: no-external-data-leakage
language: typescript
severity: error
message: |
  Do not use window.open() with a dynamic URL containing interpolated data.
  This leaks internal URLs, IDs, and usage patterns to external services.

  Wrong:  window.open(`https://api.example.com/?data=${myData}`, "_blank")
  Right:  Use a local library or Next.js API route to generate assets.

note: "Due diligence audit: third-party data leakage = privacy violation"
ignores:
  - "**/*.spec.ts"
  - "**/*.test.ts"
  - "**/*.e2e.ts"
rule:
  pattern: window.open($URL, $TARGET)
constraints:
  URL:
    kind: template_string
```
