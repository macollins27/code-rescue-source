---
displayId: INC-003
date: "2026-04-07"
severity: crit
title: "Audit agent proposed CTO decision instead of classifying schema as buggy"
caughtBy: "human review · pre-dispatch"
featured: true
cost: "Zero — caught before dispatch. Would have risked contract / legal violation if shipped."
what: |
  <p>An Explore agent ran a schema-to-spec drift audit and found that <code class="mono" style="font-size: 13px;">packages/database/schema/properties.ts</code> declared <code class="mono" style="font-size: 13px;">organizationId NOT NULL</code>, while <code class="mono" style="font-size: 13px;">.claude/docs/domain-rules/po/properties.md</code> DR-1 stated <em>"Properties are GLOBAL records with no organizationId"</em> (reinforced by product vision lines 552–568). The audit agent surfaced this as a CTO decision with options that included <em>"rewrite DR-1 to match the schema."</em></p>
  <p>That option does not exist in the methodology. The spec is internally consistent and contractually locked. The schema is the defendant; the rule is the spec. The engagement contract explicitly forbids changing the legacy software's business logic, and properties being global is a load-bearing capability. Treating it as a CTO judgement-call would have been a contract violation in waiting.</p>
how: |
  <p>Caught in pre-dispatch review. The audit agent's options menu — including the "rewrite the rule" branch — was the artifact that produced the locked rule below: an audit dispatch may classify a finding as Type 1, 2, or 3, and "reconcile spec and source" is not on the list.</p>
ruleKind: agent-review
ruleDisplayId: audit-agent-preamble · Type 1 / 2 / 3
ruleSeverity: block
ruleLockedOn: "2026-04-07"
ruleGloss: "Every audit dispatch carries a verbatim preamble locking the Type 1/2/3 finding taxonomy. Type 1: rebuild contradicts rule → fix rebuild (~99% of findings, default classification). Type 2: rule misses a capability legacy business logic requires → flag to user. Type 3: rule contradicts product vision → flag to user. Forbidden classifications: 'reconcile,' 'CTO decision on which source is correct,' 'rule needs update because current code does X.' Rebuild source has zero authority. Legacy engineering has zero authority."
ruleYaml: |
  # .claude/docs/audit-agent-preamble.md (verbatim excerpt)
  #
  # Every audit dispatch begins with this preamble. The agent reads it
  # before reading anything else, including its own task.
  #
  # ─── Authority hierarchy ───
  # 1. constitution.md (8 non-negotiable principles)
  # 2. CLAUDE.md (boundaries)
  # 3. .claude/docs/domain-rules/_shared/*.md (cross-cutting contracts)
  # 4. .claude/docs/domain-rules/{product}/{domain}.md (domain rules)
  # 5. docs/remediation/cto-decisions.md (locked CTO decisions)
  # 6. Source code at packages/, apps/ — ZERO evidentiary authority.
  #
  # ─── Type 1 (default; ~99% of findings) ───
  # Rebuild contradicts rule → fix rebuild.
  # No verification against legacy. No "maybe the spec drifted."
  # Migration, source fix, or test refactor required.
  #
  # ─── Type 2 (rare; only with legacy citation) ───
  # Rule misses a capability legacy business logic requires.
  # MUST cite a specific section of legacy-business-logic/po.md.
  # User decides. Never resolved autonomously.
  #
  # ─── Type 3 (extremely rare) ───
  # Rule contradicts product vision.
  # User decides. Never resolved autonomously.
  #
  # ─── NOT A TYPE ───
  # "Reconcile spec and source" — does not exist.
  # "CTO decision on which is correct" — does not exist.
  # "Rule needs update because current code does X" — does not exist.
  # "Preserve legacy engineering pattern" — does not exist.
ruleCites:
  - feedback_spec_is_absolute_truth
  - audit-agent-preamble
  - DR-1
---
