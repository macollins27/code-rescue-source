---
displayId: block-todo-comments
area: quality
action: warn
event: "file (Write|Edit on .ts/.tsx/.js/.jsx)"
lockedOn: "2026-04-12"
origin: "Zero Deferral Policy — TODOs are promises that rarely get kept; defer language is forbidden in domain-rules edits, this is the source-side companion"
verbatim: true
gloss: "TODO/FIXME/HACK/XXX comments are forbidden in source code. Do it now, create a task file, or document as intentional limitation."
cites:
  - block-deferral-in-domain-rules
---

```markdown
---
name: block-todo-comments
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
    pattern: //\s*(TODO|FIXME|HACK|XXX)|/\*\s*(TODO|FIXME)
---

🚫 **TODO/FIXME Comments are FORBIDDEN!**

Do it now, create a task file, or document as intentional limitation.
TODOs are promises that rarely get kept.
```
