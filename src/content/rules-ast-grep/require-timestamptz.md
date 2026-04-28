---
displayId: require-timestamptz
area: schema
severity: error
language: typescript
lockedOn: "2026-02-12"
origin: "Constitution Principle III: Temporal Consistency; auditors check timezone correctness on financial timestamps. Bare TIMESTAMP across timezones is an audit finding."
verbatim: true
gloss: "All timestamps MUST be TIMESTAMPTZ (with timezone), stored in UTC. AST-level backup for hookify block-timestamp-without-tz."
cites:
  - PER-4
---

```yaml
# Rule: require-timestamptz
# Constitution Principle III: Temporal Consistency
#
# All timestamps are TIMESTAMPTZ (with timezone), stored in UTC.
# Local time without timezone creates ambiguous data across timezones.
# This is an AST-level backup for hookify block-timestamp-without-tz.

id: require-timestamptz
language: typescript
severity: error
message: |
  Use timestamp({ withTimezone: true }) for all timestamp columns, never
  plain timestamp() without timezone.

  Wrong (Drizzle):  timestamp('created_at')
  Right (Drizzle):  timestamp('created_at', { withTimezone: true })

  Wrong (raw SQL):  TIMESTAMP
  Right (raw SQL):  TIMESTAMPTZ

note: "See Constitution Principle III: Temporal Consistency"
rule:
  kind: string
  regex: "TIMESTAMP[\\s,)]"
  not:
    regex: "TIMESTAMPTZ"
```
