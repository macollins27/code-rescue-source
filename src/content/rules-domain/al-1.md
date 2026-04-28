---
displayId: "AL-1..AL-23"
corpus: shared
file: "_shared/audit-log.md"
tag: cross-cutting
feature: "Audit log"
title: "writeAuditLog on every mutation"
refs: "system-map.md"
citedBy: []
rewritten: null
---

writeAuditLog() is called from every mutation, AFTER the transaction commits, with structured (actorUserId, organizationId, entityType, entityId, action, before, after, requestId). Per system-map.md: "auditors ask 'show me the audit trail for change X.'" Build-source Pre-Flight Table B verifies every mutation in a layer maps to an audit-log call. ENTITY_TYPES is grep-verified against lib/audit.ts at write time.
