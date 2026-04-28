---
displayId: require-uuidv7
area: schema
severity: error
language: typescript
lockedOn: "2026-02-08"
origin: "Constitution Principle II — UUIDv7 Everywhere; auditors check whether IDs are predictable enough to be IDOR vectors"
verbatim: true
gloss: "All primary keys use UUIDv7 (time-ordered) via generateId(). Never use UUIDv4 (random), crypto.randomUUID(), or integer/serial primary keys. Sequential PKs leak row counts; UUIDv7 is sortable without B-tree fragmentation."
cites:
  - ID-1
  - DR-93
---

```yaml
# Rule: require-uuidv7
# Constitution Principle II: UUIDv7 Everywhere
#
# All primary keys use UUIDv7 (time-ordered) via generateId().
# Never use UUIDv4 (random) or other UUID generators.
# This is an AST-level backup for hookify block-uuidv4.

id: require-uuidv7
language: typescript
severity: error
message: |
  Use generateId() from @repo/database/id for all IDs. Never use random UUIDs
  or integer/serial primary keys.

  Wrong (UUIDv4):    crypto.randomUUID(), uuid.v4(), uuidv4(), randomUUID()
  Wrong (integer PK): integer("id").primaryKey(), serial("id")
  Right:              id: text("id").primaryKey().$defaultFn(() => generateId())

  UUIDv7 is time-ordered: no B-tree index fragmentation, sortable,
  and compatible with the mobile sync engine (soft deletes + delta sync).
  Integer PKs leak row counts and create non-portable references.

note: "See Constitution Principle II: UUIDv7 Everywhere"
rule:
  any:
    # UUIDv4 generators — should use generateId() instead
    - pattern: gen_random_uuid()
    - pattern: uuid.v4()
    - pattern: uuidv4()
    - pattern: randomUUID()
    - pattern: crypto.randomUUID()
    # Integer/serial primary keys — should use UUIDv7 text PKs
    # integer("id").primaryKey() creates an auto-increment integer PK
    # serial("id") is PostgreSQL SERIAL — also auto-increment integer
    - pattern: integer($COL).primaryKey()
    - pattern: serial($COL)
```
