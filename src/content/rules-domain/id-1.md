---
displayId: ID-1
corpus: shared
file: "_shared/id.md"
tag: cross-cutting
feature: Identity
title: "UUIDv7 for every primary key"
refs: "Constitution II"
citedBy:
  - require-uuidv7
rewritten: null
---

All IDs are UUIDv7 — time-ordered but with no predictable component. Per system-map.md: "auditors ask 'are your IDs predictable enough to be IDOR vectors?' UUIDv7 has no predictable component." Sequential integer IDs are forbidden in any user-facing identifier.
