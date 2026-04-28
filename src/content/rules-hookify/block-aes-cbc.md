---
displayId: block-aes-cbc
area: security
action: warn
event: "file (Write|Edit on .ts/.tsx/.js)"
lockedOn: "2026-02-15"
origin: "Constitution Principle V: Fail-Closed Security; AES-CBC vulnerable to padding oracle attacks (no authentication tag)"
verbatim: true
gloss: "AES-CBC encryption is BANNED. All symmetric encryption MUST use AES-256-GCM. Companion to ast-grep no-aes-cbc-cipher."
cites:
  - no-aes-cbc-cipher
---

```markdown
---
name: block-aes-cbc
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(ts|tsx|js)$
  - field: new_text
    operator: regex_match
    pattern: aes-(128|192|256)-cbc
---

**BLOCKED: AES-CBC encryption is BANNED**

AES-CBC lacks an authentication tag and is vulnerable to padding oracle attacks. All symmetric encryption MUST use AES-256-GCM.

**Constitution Principle VII — Security:** Only AES-256-GCM is permitted.

**Fix:**

\`\`\`typescript
// BAD — no authentication, padding oracle vulnerable
createCipheriv('aes-256-cbc', key, iv)

// GOOD — authenticated encryption
createCipheriv('aes-256-gcm', key, iv)
\`\`\`
```
