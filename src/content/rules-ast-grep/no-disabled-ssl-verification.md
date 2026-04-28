---
displayId: no-disabled-ssl-verification
area: security
severity: error
language: typescript
lockedOn: "2026-02-15"
origin: "Constitution Principle V: Fail-Closed Security — SSL certificate verification must not be disabled in production"
verbatim: true
gloss: "rejectUnauthorized: false is banned. Use rejectUnauthorized: true with a proper CA certificate."
cites: []
---

```yaml
# Rule: no-disabled-ssl-verification
# Constitution Principle V: Fail-Closed Security
#
# SSL certificate verification must not be disabled in production.
# Use rejectUnauthorized: true with a proper CA certificate.

id: no-disabled-ssl-verification
language: typescript
severity: error
message: |
  SSL certificate verification must not be disabled in production.
  Use rejectUnauthorized: true with a proper CA certificate.
note: "See Constitution Principle V: Fail-Closed Security"
rule:
  pattern: "rejectUnauthorized: false"
```
