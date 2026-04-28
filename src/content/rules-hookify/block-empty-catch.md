---
displayId: block-empty-catch
area: quality
action: warn
event: "file (Write|Edit on .ts/.tsx/.js/.jsx)"
lockedOn: "2026-02-08"
origin: "Constitution Principle VI: File Size Discipline — no empty catch blocks; silent error swallowing is never acceptable"
verbatim: true
gloss: "Empty catch blocks are forbidden. Either log the error, re-throw with context, or handle meaningfully."
cites: []
---

```markdown
---
name: block-empty-catch
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(ts|tsx|js|jsx)$
  - field: new_text
    operator: regex_match
    pattern: catch\s*\([^)]*\)\s*\{\s*\}
---

🚫 **Empty Catch Blocks are FORBIDDEN!**

Either log the error, re-throw with context, or handle meaningfully.
Silent error swallowing is never acceptable.
```
