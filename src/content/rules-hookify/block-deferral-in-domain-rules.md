---
displayId: block-deferral-in-domain-rules
area: spec
action: block
event: "file (Write|Edit on .claude/docs/domain-rules/**.md)"
lockedOn: "2026-04-12"
origin: "Zero Deferral Policy — Domain-rules are blueprints written BEFORE code. 'The code doesn't exist' is the REASON to write the spec, not a reason to defer."
verbatim: true
gloss: "Forbidden phrases in domain-rules edits: [future-spec], [future], [planned], [phase-2], 'Phase 2', 'NOT YET BUILT', 'NOT YET IMPLEMENTED'. Only [spec], [consistency], and [adversarial] tags are valid."
cites: []
---

```markdown
---
name: block-deferral-in-domain-rules
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.claude/docs/domain-rules/.*\.md$
  - field: new_text
    operator: regex_match
    pattern: \[future-spec\]|\[future\]|\[planned\]|\[phase-2\]|Phase 2|NOT YET BUILT|NOT YET IMPLEMENTED
action: block
---

BLOCKED: Domain-rules files must not contain deferral language. Only [spec], [consistency], and [adversarial] tags are valid. Fully specify the behavior instead of deferring it.

Violations detected: [future-spec], [future], [planned], [phase-2], "Phase 2", "NOT YET BUILT", or "NOT YET IMPLEMENTED".

Domain-rules are blueprints written BEFORE code. Every procedure must be fully specified with inputs, outputs, errors, and side effects — regardless of whether code exists yet. "The code doesn't exist" is the REASON to write the spec, not a reason to defer.
```
