---
displayId: AUTH-5
corpus: shared
file: "_shared/auth.md"
tag: cross-cutting
feature: "Auth / tenancy"
title: "organizationId in SQL WHERE, not post-fetch JS"
refs: 'system-map §"would an auditor flag this"'
citedBy: []
rewritten: null
---

All queries against org-scoped tables MUST filter by activeOrganizationId in the SQL WHERE clause, not by post-fetch JavaScript. Per system-map.md: "auditors ask 'show me cross-org data leakage tests.' SQL-level scoping is mechanical; JS-level is fragile." Cross-org IDOR defense pairs this rule with review-source Pass 7 (security surface) and qa-flows/sec-org-scoping.yaml + qa-flows/sec-idor.yaml.
