---
displayId: no-aes-cbc-cipher
area: security
severity: error
language: typescript
lockedOn: "2026-02-15"
origin: "Constitution Principle V: Fail-Closed Security; AES-CBC lacks authentication tag, vulnerable to padding oracle attacks"
verbatim: true
gloss: "createCipheriv / createDecipheriv with aes-128-cbc, aes-192-cbc, aes-256-cbc are banned. Use AES-256-GCM. AST-level backup for hookify block-aes-cbc."
cites:
  - block-aes-cbc
---

```yaml
# Rule: no-aes-cbc-cipher
# Constitution Principle V: Fail-Closed Security
#
# AES-CBC lacks an authentication tag and is vulnerable to padding oracle
# attacks. All symmetric encryption must use AES-256-GCM.
# This is an AST-level backup for hookify block-aes-cbc.

id: no-aes-cbc-cipher
language: typescript
severity: error
message: |
  AES-CBC encryption is BANNED. Use AES-256-GCM instead.

  AES-CBC lacks authentication and is vulnerable to padding oracle attacks.

  Wrong: createCipheriv('aes-256-cbc', key, iv)
  Right: createCipheriv('aes-256-gcm', key, iv)

note: "See Constitution Principle V: Fail-Closed Security"
rule:
  any:
    - pattern: createCipheriv('aes-256-cbc', $KEY, $IV)
    - pattern: createCipheriv('aes-128-cbc', $KEY, $IV)
    - pattern: createCipheriv('aes-192-cbc', $KEY, $IV)
    - pattern: createDecipheriv('aes-256-cbc', $KEY, $IV)
    - pattern: createDecipheriv('aes-128-cbc', $KEY, $IV)
    - pattern: createDecipheriv('aes-192-cbc', $KEY, $IV)
```
