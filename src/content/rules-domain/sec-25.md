---
displayId: SEC-25
corpus: shared
file: "_shared/security.md"
tag: cross-cutting
feature: Security
title: "sanitizeText on every user-supplied string field"
refs: "build-source Pre-Flight"
citedBy: []
rewritten: null
---

User-supplied string inputs (name, description, comment, etc.) MUST pass through sanitizeText() before insert. Build-source Step 1 includes a 15-grep verification loop in which SEC-25 is grep #1 — a procedure that writes a user string without sanitizeText fails the gate at write time, not PR time.
