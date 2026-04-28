---
displayId: PCI-5
corpus: shared
file: "_shared/id.md"
tag: cross-cutting
feature: Identity
title: "properties INSERT must populate canonical-identity columns atomically"
refs: "DR-91 · INV-3"
citedBy:
  - no-concrete-resolver-import-outside-factory
rewritten: null
---

Every properties INSERT MUST populate (upi, country_subdivision, assessor_ref, assessor_ref_normalized, lineage_id) atomically via getParcelResolver(ctx) in the same SQL statement. A null-canonical property is undeduplicatable, unlineageable, and unclaimable — the rule prevents the row from existing in the first place rather than backfilling later.
