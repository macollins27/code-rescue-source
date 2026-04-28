// DRDD Manifesto v2 — verbatim source data for /methodology.
// Origin: docs/drdd-manifesto-v2.md (locked 2026-04-11). Do not rewrite.
// Body / counter / litmus fields contain HTML; rendered via set:html.

import type { Rule } from '../components/RuleCard.astro';

export interface Commitment {
  lead: string;
  body: string;
}

export const commitments: Commitment[] = [
  { lead: 'Machine-testable rules', body: 'over prose specifications.' },
  { lead: 'Mechanical enforcement', body: 'over agent compliance.' },
  { lead: 'Source-of-truth authority', body: 'over reconciliation.' },
  { lead: 'Monotonic rule sets', body: 'over revisable specifications.' },
];

const code = (s: string) => `<code class="mono" style="font-size: 13px;">${s}</code>`;

export const twelveRules: Rule[] = [
  {
    n: 'I',
    title: 'Machine-Testability',
    tagline: 'Every rule is expressible as an assertion.',
    body: `A domain rule is not a sentence of guidance. It is a specification in a form whose compliance can be mechanically verified. If a rule cannot be translated to an executable assertion — ${code('expect(error.code).toBe("NOT_FOUND")')}, ${code('expect(result.items.length).toBe(0)')} when search input is ${code('"%"')}, ${code('expect(primaryKey).toMatch(uuidv7Pattern)')} — it is not yet a rule. It is a wish. The discipline begins at the moment of writing: what assertion would prove this? That question constrains what can be written and excludes the forms of specification that only appear rigorous.`,
    counter: '"The system should handle errors gracefully." No assertion is implied. No test can be written. The sentence is advisory.',
    litmus: 'A junior engineer, given the rule and no other context, can write one passing and one failing test against it.',
  },
  {
    n: 'II',
    title: 'Three Layers',
    tagline: 'Every rule belongs to spec, consistency, or adversarial.',
    body: `A domain's rules decompose into three layers. <strong>Spec</strong> defines canonical behavior: inputs, authentication, error codes, side effects, response shape. <strong>Consistency</strong> enforces cross-procedure invariants: every SELECT includes the soft-delete predicate, every error matches the canonical string, every mutation writes an audit entry. <strong>Adversarial</strong> covers what happens when the system is probed: race conditions, wildcard escaping, cross-organization access, prompt injection, external-service failure. A rule list missing any of the three is incomplete. The three layers are not a style preference; they map to the three classes of failure that undifferentiated specifications cannot separate.`,
    counter: 'A spec with only happy-path rules. The domain passes every test and fails in production under any input the author did not anticipate.',
    litmus: 'For every [spec] rule, at least one [adversarial] rule names what an attacker or edge case would do to it.',
  },
  {
    n: 'III',
    title: 'Authority Hierarchy',
    tagline: 'The rule is truth. The code is not evidence.',
    body: `When source code and a domain rule disagree, the source is wrong. There is no reconciliation, no "but the code shows the intent," no schema-driven revision of the rule. The rule is modified only by the mechanism that owns it: product vision, architectural decision, cross-cutting authority. The code is modified to conform. This is the methodology's single non-negotiable axiom, because every other rule depends on it. <em>"Domain rules are the authoritative specification. If domain rules say X and source code does Y, the source code is wrong. There is no reconciliation. Source code has zero authority."</em>`,
    counter: '"Let us update the rule to match what the code already does." Not an allowed move.',
    litmus: 'When a reviewer finds drift between rule and code, the default action is to fix the code. If the default action is to debate the rule, the hierarchy is not enforced.',
  },
  {
    n: 'IV',
    title: 'Monotonicity',
    tagline: 'Rules grow. They do not shrink.',
    body: `The rule set is monotonic. New findings can add rules, refine rules, split rules into narrower scopes, or strengthen existing rules with additional layers. They cannot remove rules, weaken rules, or soften language from MUST to SHOULD. A gap finding says the rule was incomplete — not that the rule was wrong and should be deleted. This asymmetry prevents a failure mode in which rationalization pressure leads reviewers to delete the requirement instead of fixing the code. The direction of change is fixed.`,
    counter: 'A reviewer classifies a source defect as a specification gap and proposes deleting the rule that exposed it.',
    litmus: 'Has any rule been deleted in the last release cycle without a corresponding stronger rule replacing it? If yes, monotonicity has been violated.',
  },
  {
    n: 'V',
    title: 'Origin Citation',
    tagline: 'Every rule names the decision that produced it.',
    body: `Each rule carries a citation: a commit hash, a design decision, an incident, a legal requirement, or an architectural reference. Rules without origins drift. They become "someone thought this was a good idea" and are the first to be relaxed under pressure. An origin renders the rule auditable — by the next engineer, the next reviewer, the next agent, the next acquirer. The origin is the rule's proof of non-arbitrariness. A rule whose origin cannot be stated is a rule waiting to be deleted.`,
    counter: '"Money columns must be stored as integer cents." No origin. First rule to be weakened when a contractor prefers floating-point.',
    litmus: 'The rule can be traced to a specific decision, commit, or incident in under sixty seconds of reading.',
  },
  {
    n: 'VI',
    title: 'Incident Capture',
    tagline: 'Every failure becomes a rule that prevents its recurrence.',
    body: `A defect found in production is not a ticket. It is a missing rule. Remediation has four steps in order: identify the rule that would have caught the defect, write the rule, attach mechanical enforcement, then fix the defect. Fixing the defect alone is the weakest response — it repairs the artifact without updating the specification, leaving the class of defect free to recur in sibling domains. Every hook, linter, and gate rule in a mature codebase is a frozen incident.`,
    counter: '"Fixed in commit 3a7f8b." No rule added. The same defect reappears in a sibling domain three weeks later.',
    litmus: 'For every significant defect fixed in the last quarter, the rule that prevents its recurrence can be named.',
  },
  {
    n: 'VII',
    title: 'Mechanical Enforcement',
    tagline: 'Each rule is enforced at the strongest layer its shape allows.',
    body: `An unenforced rule is a policy statement, not a specification. Each rule is paired with the strongest mechanical enforcement its shape admits: at write-time the tool call is blocked, at gate-time the commit is blocked, at runtime the action is blocked. Advisory language is reserved only for rules whose violations cannot yet be mechanized — and those rules are candidates for future mechanization, not a resting state. The rule that exists only in prose is a rule that will be violated.`,
    counter: '"Developers should sanitize user input before rendering." Enforced nowhere. Violated routinely.',
    litmus: 'Each rule names the layer at which it is enforced. If the answer is "code review," the enforcement is advisory, not mechanical.',
  },
  {
    n: 'VIII',
    title: 'Specification Completeness',
    tagline: 'Unspecified behavior is a violation.',
    body: `Behavior the code exhibits but the rules do not specify is a violation — independent of whether the behavior is correct. A retry loop that no rule specifies, a silent fallback to a default value, a branch that logs and continues: each is undocumented, unaudited, and cannot be preserved across refactors or ported to sibling domains. Remediation is binary. Either the behavior is removed, or a rule is added that specifies it. The default intuition — that undocumented-but-working code is acceptable — is inverted. Silence in the specification is a rule-sized gap.`,
    counter: 'A procedure has a retry loop. No rule specifies it. Nobody knows it exists until it amplifies an outage.',
    litmus: 'Every branch of every procedure traces to a rule. Branches without rules are violations.',
  },
  {
    n: 'IX',
    title: 'Adversarial Coverage',
    tagline: 'Every external surface has an adversarial rule.',
    body: `Every domain accepting external input carries a mandatory adversarial layer covering: injection (wildcard, SQL, formula, prompt), enumeration (error-message probing, timing channels), cross-scope access (organization, user, tenant, property), race conditions (TOCTOU, concurrent mutation), and external-service failure (timeout, malformed response, rate-limit exhaustion). A domain that has not specified its adversarial rules is not specified. The absence of an adversarial rule at an input boundary is the presence of an attack surface.`,
    counter: 'A search procedure without a wildcard-escape rule. A request for "%" becomes a tool for enumerating every record visible to the caller.',
    litmus: 'For every user-controllable input, a rule specifies what happens when the input is hostile.',
  },
  {
    n: 'X',
    title: 'Shared Vocabulary',
    tagline: 'Cross-cutting concerns have canonical owners.',
    body: `Cross-cutting concerns — authentication, persistence, identifiers, errors, audit logging, permissions, security — are specified once, in shared rule files owned by the infrastructure layer. Every domain file that depends on a cross-cutting concern cites the canonical rule by identifier (${code('AUTH‑5')}, ${code('PER‑7')}, ${code('SEC‑16')}) rather than restating it. When the canonical rule changes, every referencing domain inherits the change. Drift is prevented by the absence of duplication, not by reviewer diligence.`,
    counter: 'Each domain restates its own soft-delete semantics. Four variants appear across twenty-four domains. One is subtly wrong. The wrong one leaks deleted records.',
    litmus: 'Cross-cutting concerns are cited by identifier, not restated.',
  },
  {
    n: 'XI',
    title: 'Zero Deferral',
    tagline: 'Known violations are resolved before the domain closes.',
    body: `When a review finds a violation — a code defect, a rule gap, an architectural risk — it is resolved before the domain closes. There is no deferral to a future phase, no backlog category for known issues, no release path for a system carrying outstanding rule violations. Deferral compounds. Every unresolved violation is inherited by every future domain. The methodology admits no class of acceptable unresolved finding: FIX findings are repaired, gap findings generate new rules, RISK findings are either mitigated or escalated to an architectural decision. A finding documented is a finding owned.`,
    counter: '"Flagged for Stage 6 security review." Stage 6 never happens. The finding ages. The domain is shipped.',
    litmus: 'There are zero outstanding findings on any closed domain. If there are, the domain is not closed.',
  },
  {
    n: 'XII',
    title: 'Gate as Specification',
    tagline: 'The quality gate is the executable rule set.',
    body: `The gate is not a verification step performed on a codebase. It is the rule set itself, compiled to executable form. Every mechanically enforceable rule has a representation in it — a hook, a static-analysis pattern, a linter configuration, a test. When prose documentation and the gate disagree, the gate is authoritative. Human review is supplementary, never primary. The gate's passing state is the definition of compliance; its failing state names the rule violated. A codebase that passes is, by construction, compliant with the mechanically enforceable portion of the specification.`,
    counter: '"Verified by code review." Verified by nobody, past message three of the reviewer\'s session.',
    litmus: 'The codebase can be validated by running the gate. Validation does not require a human.',
  },
];
