---
displayId: ERR-8
corpus: shared
file: "_shared/errors.md"
tag: cross-cutting
feature: Errors
title: "TRPCError shape with cause.code for resolver outages"
refs: "PCI-7"
citedBy: []
rewritten: null
---

On total resolver failure (every vendor path errors AND no manual APN), throw TRPCError({ code: "BAD_REQUEST", message: "...", cause: { code: "RESOLVER_OUTAGE" } }). The structured cause is the contract clients depend on — the message is for humans, the cause.code is for machines. No bare strings, no Error subclasses outside the registry.
