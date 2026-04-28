---
displayId: block-vague-test-names
area: tests
action: warn
event: "file (Write|Edit on *.spec.ts)"
lockedOn: "2026-04-04"
origin: "INC-002 — companion to require-caller-in-tests at the keystroke layer; vague test names hide what the test actually exercises"
verbatim: true
gloss: "Test names must describe the specific scenario AND the expected outcome. Names like 'should be defined' / 'should work' / 'should handle errors' fire a warn at write time."
cites:
  - require-caller-in-tests
---

```markdown
---
name: block-vague-test-names
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.spec\.ts$
  - field: new_text
    operator: regex_match
    pattern: it\('should be defined'|it\('should work |it\('should handle
---

**NAME-001: No vague test names!**

Test names must describe the specific scenario and expected outcome:

**Wrong:**
\`\`\`typescript
it('should be defined', () => {});
it('should work correctly', () => {});
it('should handle errors', () => {});
\`\`\`

**Right:**
\`\`\`typescript
it('should return the user when found by id', () => {});
it('should return 404 when user does not exist', () => {});
it('should throw ValidationError when email is empty', () => {});
\`\`\`

Pattern: `should <specific outcome> when <specific condition>`

See: `.claude/docs/testing-standards.md` Anti-Pattern #8
```
