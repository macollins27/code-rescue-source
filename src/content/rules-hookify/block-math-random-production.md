---
displayId: block-math-random-production
area: security
action: warn
event: "file (Write|Edit on src/**/*.ts excluding tests)"
lockedOn: "2026-02-15"
origin: "Math.random() is not cryptographically secure; PRNG seeded from a predictable source"
verbatim: true
gloss: "Math.random() in production source files triggers a warn. Forbidden for token/key generation, retry jitter in security-sensitive contexts, anything that must be unpredictable. Use crypto.randomInt() instead."
cites: []
---

```markdown
---
name: block-math-random-production
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.(ts|tsx)$
  - field: file_path
    operator: not_contains
    pattern: .spec.
  - field: file_path
    operator: not_contains
    pattern: .test.
  - field: new_text
    operator: contains
    pattern: Math.random()
---

**WARNING: `Math.random()` in production code**

`Math.random()` is NOT cryptographically secure. It uses a PRNG seeded from a predictable source and should never be used for:
- Token/key generation
- Retry jitter in security-sensitive contexts
- Any value that must be unpredictable

**Fix:** Use Node.js `crypto` module instead:

\`\`\`typescript
// BAD — predictable
const jitter = Math.random() * 1000;

// GOOD — cryptographically secure
import { randomInt } from 'crypto';
const jitter = randomInt(1000);
\`\`\`

If this is truly non-security-sensitive (e.g., UI animation), you may proceed — but document why `Math.random()` is acceptable here.
```
