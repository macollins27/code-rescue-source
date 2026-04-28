---
displayId: PER-4
corpus: shared
file: "_shared/persistence.md"
tag: cross-cutting
feature: Persistence
title: "TIMESTAMPTZ everywhere, never bare TIMESTAMP"
refs: "Constitution III"
citedBy: []
rewritten: null
---

Every timestamp column in every table MUST be TIMESTAMPTZ. Bare TIMESTAMP is forbidden. Per system-map.md: "auditors check timezone correctness on financial timestamps. Bare TIMESTAMP across timezones is an audit finding." Drizzle migrations failing this check are blocked by the migration-format hook before they reach review.
