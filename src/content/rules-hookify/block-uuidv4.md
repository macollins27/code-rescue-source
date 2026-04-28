---
displayId: block-uuidv4
area: schema
action: warn
event: "file (Write|Edit on .ts/.tsx/.js/.jsx)"
lockedOn: "2026-02-08"
origin: "Constitution Principle II — UUIDv7 Everywhere; companion to ast-grep require-uuidv7"
verbatim: true
gloss: "Random UUIDv4 generators (gen_random_uuid, uuid.v4, uuidv4) trigger a warn at write time. All DB primary keys must use generateId() / UUIDv7. crypto.randomUUID() is permitted for non-PK uses (request IDs, nonces, CSRF tokens)."
cites:
  - require-uuidv7
  - ID-1
---

```markdown
---
name: block-uuidv4
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
    pattern: gen_random_uuid\(\)|uuid\.v4\(\)|uuidv4\(\)
---

🚫 **UUIDv4 library usage detected!** (Constitution Principle II — UUIDv7 Everywhere)

All **database primary keys** must use time-ordered UUIDv7, never random UUIDv4.
Random UUIDs cause B-tree index fragmentation at scale.

**Wrong (for DB primary keys):**
\`\`\`typescript
gen_random_uuid()         // PostgreSQL function
uuid.v4()                 // uuid npm package
uuidv4()                  // uuid npm package alias
\`\`\`

**Right (for DB primary keys):**
\`\`\`typescript
import { generateId } from '@repo/database/id'; // UUIDv7
\`\`\`

**Note:** \`crypto.randomUUID()\` from Node.js/browser is permitted for non-PK purposes
(request IDs, nonces, CSRF tokens, idempotency keys). Use it freely for those.

See: \`CLAUDE.md\` — Architecture Rules: All IDs: UUIDv7 via \`generateId()\` from \`@repo/database/id\`
```
