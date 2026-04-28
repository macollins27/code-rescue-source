---
displayId: block-empty-cast-in-tests
area: tests
action: warn
event: "Write|Edit"
lockedOn: "2026-02-18"
origin: "ASRT-002 · Anti-Pattern #2 from testing-standards.md"
verbatim: true
gloss: "{} as unknown as Entity in *.spec.ts files triggers a warn at edit time."
cites: []
---

```yaml
---
name: block-empty-cast-in-tests
enabled: true
event: file
tool_matcher: Write|Edit
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.spec\.ts$
  - field: new_text
    operator: regex_match
    pattern: =\s*\{\}\s+as\s+unknown\s+as
---
```

**ASRT-002: No empty object casts in tests!**

Assigning `{} as unknown as Entity` and then asserting `toBeDefined()` is tautological — it tests nothing. You're asserting that a value you just assigned is defined.

**Wrong (testing air):**

```typescript
entity.company = {} as unknown as Company;
expect(entity.company).toBeDefined(); // always passes — you just set it
```

**Right (test what Drizzle actually stores/returns):**

```typescript
// Insert a real record and verify the relation was returned
const { company } = await db.query.entities.findFirst({
  where: eq(entities.id, entityId),
  with: { company: true },
});
expect(company).toBeDefined();
expect(company.id).toBe(expectedCompanyId);
```

Note: `{ ...properties } as unknown as Interface` with actual properties IS fine for partial mocks.

See: `.claude/docs/testing-standards.md` Anti-Pattern #2
