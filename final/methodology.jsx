// Methodology page — renders the DRDD manifesto v2 inline.
// Source: docs/drdd-manifesto-v2.md (verbatim prose; do not rewrite).
// 4 Commitments + 12 Rules + 2 anatomy specimens + provenance.

const commitments = [
  { lead: "Machine-testable rules", body: "over prose specifications." },
  { lead: "Mechanical enforcement", body: "over agent compliance." },
  { lead: "Source-of-truth authority", body: "over reconciliation." },
  { lead: "Monotonic rule sets", body: "over revisable specifications." },
];

const twelveRules = [
  {
    n: "I", title: "Machine-Testability",
    tagline: "Every rule is expressible as an assertion.",
    body: (
      <>
        A domain rule is not a sentence of guidance. It is a specification in a form whose compliance can be mechanically verified. If a rule cannot be translated to an executable assertion — <code className="mono" style={{ fontSize: 13 }}>expect(error.code).toBe("NOT_FOUND")</code>, <code className="mono" style={{ fontSize: 13 }}>expect(result.items.length).toBe(0)</code> when search input is <code className="mono" style={{ fontSize: 13 }}>"%"</code>, <code className="mono" style={{ fontSize: 13 }}>expect(primaryKey).toMatch(uuidv7Pattern)</code> — it is not yet a rule. It is a wish. The discipline begins at the moment of writing: what assertion would prove this? That question constrains what can be written and excludes the forms of specification that only appear rigorous.
      </>
    ),
    counter: '"The system should handle errors gracefully." No assertion is implied. No test can be written. The sentence is advisory.',
    litmus: "A junior engineer, given the rule and no other context, can write one passing and one failing test against it.",
  },
  {
    n: "II", title: "Three Layers",
    tagline: "Every rule belongs to spec, consistency, or adversarial.",
    body: (
      <>
        A domain's rules decompose into three layers. <strong>Spec</strong> defines canonical behavior: inputs, authentication, error codes, side effects, response shape. <strong>Consistency</strong> enforces cross-procedure invariants: every SELECT includes the soft-delete predicate, every error matches the canonical string, every mutation writes an audit entry. <strong>Adversarial</strong> covers what happens when the system is probed: race conditions, wildcard escaping, cross-organization access, prompt injection, external-service failure. A rule list missing any of the three is incomplete. The three layers are not a style preference; they map to the three classes of failure that undifferentiated specifications cannot separate.
      </>
    ),
    counter: "A spec with only happy-path rules. The domain passes every test and fails in production under any input the author did not anticipate.",
    litmus: "For every [spec] rule, at least one [adversarial] rule names what an attacker or edge case would do to it.",
  },
  {
    n: "III", title: "Authority Hierarchy",
    tagline: "The rule is truth. The code is not evidence.",
    body: (
      <>
        When source code and a domain rule disagree, the source is wrong. There is no reconciliation, no "but the code shows the intent," no schema-driven revision of the rule. The rule is modified only by the mechanism that owns it: product vision, architectural decision, cross-cutting authority. The code is modified to conform. This is the methodology's single non-negotiable axiom, because every other rule depends on it. <em>"Domain rules are the authoritative specification. If domain rules say X and source code does Y, the source code is wrong. There is no reconciliation. Source code has zero authority."</em>
      </>
    ),
    counter: '"Let us update the rule to match what the code already does." Not an allowed move.',
    litmus: "When a reviewer finds drift between rule and code, the default action is to fix the code. If the default action is to debate the rule, the hierarchy is not enforced.",
  },
  {
    n: "IV", title: "Monotonicity",
    tagline: "Rules grow. They do not shrink.",
    body: (
      <>
        The rule set is monotonic. New findings can add rules, refine rules, split rules into narrower scopes, or strengthen existing rules with additional layers. They cannot remove rules, weaken rules, or soften language from MUST to SHOULD. A gap finding says the rule was incomplete — not that the rule was wrong and should be deleted. This asymmetry prevents a failure mode in which rationalization pressure leads reviewers to delete the requirement instead of fixing the code. The direction of change is fixed.
      </>
    ),
    counter: "A reviewer classifies a source defect as a specification gap and proposes deleting the rule that exposed it.",
    litmus: "Has any rule been deleted in the last release cycle without a corresponding stronger rule replacing it? If yes, monotonicity has been violated.",
  },
  {
    n: "V", title: "Origin Citation",
    tagline: "Every rule names the decision that produced it.",
    body: (
      <>
        Each rule carries a citation: a commit hash, a design decision, an incident, a legal requirement, or an architectural reference. Rules without origins drift. They become "someone thought this was a good idea" and are the first to be relaxed under pressure. An origin renders the rule auditable — by the next engineer, the next reviewer, the next agent, the next acquirer. The origin is the rule's proof of non-arbitrariness. A rule whose origin cannot be stated is a rule waiting to be deleted.
      </>
    ),
    counter: '"Money columns must be stored as integer cents." No origin. First rule to be weakened when a contractor prefers floating-point.',
    litmus: "The rule can be traced to a specific decision, commit, or incident in under sixty seconds of reading.",
  },
  {
    n: "VI", title: "Incident Capture",
    tagline: "Every failure becomes a rule that prevents its recurrence.",
    body: (
      <>
        A defect found in production is not a ticket. It is a missing rule. Remediation has four steps in order: identify the rule that would have caught the defect, write the rule, attach mechanical enforcement, then fix the defect. Fixing the defect alone is the weakest response — it repairs the artifact without updating the specification, leaving the class of defect free to recur in sibling domains. Every hook, linter, and gate rule in a mature codebase is a frozen incident.
      </>
    ),
    counter: '"Fixed in commit 3a7f8b." No rule added. The same defect reappears in a sibling domain three weeks later.',
    litmus: "For every significant defect fixed in the last quarter, the rule that prevents its recurrence can be named.",
  },
  {
    n: "VII", title: "Mechanical Enforcement",
    tagline: "Each rule is enforced at the strongest layer its shape allows.",
    body: (
      <>
        An unenforced rule is a policy statement, not a specification. Each rule is paired with the strongest mechanical enforcement its shape admits: at write-time the tool call is blocked, at gate-time the commit is blocked, at runtime the action is blocked. Advisory language is reserved only for rules whose violations cannot yet be mechanized — and those rules are candidates for future mechanization, not a resting state. The rule that exists only in prose is a rule that will be violated.
      </>
    ),
    counter: '"Developers should sanitize user input before rendering." Enforced nowhere. Violated routinely.',
    litmus: 'Each rule names the layer at which it is enforced. If the answer is "code review," the enforcement is advisory, not mechanical.',
  },
  {
    n: "VIII", title: "Specification Completeness",
    tagline: "Unspecified behavior is a violation.",
    body: (
      <>
        Behavior the code exhibits but the rules do not specify is a violation — independent of whether the behavior is correct. A retry loop that no rule specifies, a silent fallback to a default value, a branch that logs and continues: each is undocumented, unaudited, and cannot be preserved across refactors or ported to sibling domains. Remediation is binary. Either the behavior is removed, or a rule is added that specifies it. The default intuition — that undocumented-but-working code is acceptable — is inverted. Silence in the specification is a rule-sized gap.
      </>
    ),
    counter: "A procedure has a retry loop. No rule specifies it. Nobody knows it exists until it amplifies an outage.",
    litmus: "Every branch of every procedure traces to a rule. Branches without rules are violations.",
  },
  {
    n: "IX", title: "Adversarial Coverage",
    tagline: "Every external surface has an adversarial rule.",
    body: (
      <>
        Every domain accepting external input carries a mandatory adversarial layer covering: injection (wildcard, SQL, formula, prompt), enumeration (error-message probing, timing channels), cross-scope access (organization, user, tenant, property), race conditions (TOCTOU, concurrent mutation), and external-service failure (timeout, malformed response, rate-limit exhaustion). A domain that has not specified its adversarial rules is not specified. The absence of an adversarial rule at an input boundary is the presence of an attack surface.
      </>
    ),
    counter: 'A search procedure without a wildcard-escape rule. A request for "%" becomes a tool for enumerating every record visible to the caller.',
    litmus: "For every user-controllable input, a rule specifies what happens when the input is hostile.",
  },
  {
    n: "X", title: "Shared Vocabulary",
    tagline: "Cross-cutting concerns have canonical owners.",
    body: (
      <>
        Cross-cutting concerns — authentication, persistence, identifiers, errors, audit logging, permissions, security — are specified once, in shared rule files owned by the infrastructure layer. Every domain file that depends on a cross-cutting concern cites the canonical rule by identifier (<code className="mono" style={{ fontSize: 13 }}>AUTH‑5</code>, <code className="mono" style={{ fontSize: 13 }}>PER‑7</code>, <code className="mono" style={{ fontSize: 13 }}>SEC‑16</code>) rather than restating it. When the canonical rule changes, every referencing domain inherits the change. Drift is prevented by the absence of duplication, not by reviewer diligence.
      </>
    ),
    counter: "Each domain restates its own soft-delete semantics. Four variants appear across twenty-four domains. One is subtly wrong. The wrong one leaks deleted records.",
    litmus: "Cross-cutting concerns are cited by identifier, not restated.",
  },
  {
    n: "XI", title: "Zero Deferral",
    tagline: "Known violations are resolved before the domain closes.",
    body: (
      <>
        When a review finds a violation — a code defect, a rule gap, an architectural risk — it is resolved before the domain closes. There is no deferral to a future phase, no backlog category for known issues, no release path for a system carrying outstanding rule violations. Deferral compounds. Every unresolved violation is inherited by every future domain. The methodology admits no class of acceptable unresolved finding: FIX findings are repaired, gap findings generate new rules, RISK findings are either mitigated or escalated to an architectural decision. A finding documented is a finding owned.
      </>
    ),
    counter: '"Flagged for Stage 6 security review." Stage 6 never happens. The finding ages. The domain is shipped.',
    litmus: "There are zero outstanding findings on any closed domain. If there are, the domain is not closed.",
  },
  {
    n: "XII", title: "Gate as Specification",
    tagline: "The quality gate is the executable rule set.",
    body: (
      <>
        The gate is not a verification step performed on a codebase. It is the rule set itself, compiled to executable form. Every mechanically enforceable rule has a representation in it — a hook, a static-analysis pattern, a linter configuration, a test. When prose documentation and the gate disagree, the gate is authoritative. Human review is supplementary, never primary. The gate's passing state is the definition of compliance; its failing state names the rule violated. A codebase that passes is, by construction, compliant with the mechanically enforceable portion of the specification.
      </>
    ),
    counter: '"Verified by code review." Verified by nobody, past message three of the reviewer\'s session.',
    litmus: "The codebase can be validated by running the gate. Validation does not require a human.",
  },
];

function RuleCard({ rule }) {
  return (
    <article style={{ borderTop: "1px solid var(--rule-2)", paddingTop: 28, paddingBottom: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 32, alignItems: "start" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.12em" }}>{rule.n}</div>
        </div>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", margin: "0 0 6px", color: "var(--ink)" }}>
            {rule.title}
          </h3>
          <div className="serif" style={{ fontSize: 16, fontStyle: "italic", color: "var(--ink-3)", marginBottom: 18 }}>
            {rule.tagline}
          </div>
          <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", marginBottom: 18 }}>
            {rule.body}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 22 }}>
            <div style={{ borderLeft: "2px solid var(--rule-2)", paddingLeft: 14 }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Counter-example</div>
              <div className="serif" style={{ fontSize: 14.5, fontStyle: "italic", color: "var(--ink-3)", lineHeight: 1.55 }}>
                {rule.counter}
              </div>
            </div>
            <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 14 }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Litmus test</div>
              <div className="serif" style={{ fontSize: 14.5, fontStyle: "italic", color: "var(--ink-2)", lineHeight: 1.55 }}>
                {rule.litmus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function AnatomySlot({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div className="serif" style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>{children}</div>
    </div>
  );
}

function MethodologyFinal() {
  return (
    <div className="page" style={{ minHeight: "100%" }}>
      <Nav current="methodology" />

      {/* Hero */}
      <section style={{ padding: "44px 48px 32px", borderBottom: "1px solid var(--rule)" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 14 }}>
          DRDD Manifesto · v2 · locked 2026‑04‑11
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <h1 style={{ fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 600, margin: 0, maxWidth: "22ch" }}>
              Domain‑Rules‑Driven Development.
            </h1>
            <p className="serif" style={{ fontSize: 18, color: "var(--ink-2)", maxWidth: "44ch", marginTop: 22, lineHeight: 1.5, marginBottom: 0 }}>
              The methodology, as written. The rule set, not the code, is the source of truth. The code is either in compliance, or wrong.
            </p>
          </div>
          <table className="data" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td style={{ color: "var(--ink-4)" }}>Version</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>v2</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Locked</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>2026‑04‑11</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Read time</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>~17 min</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Commitments</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>4</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Rules</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>12</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Anatomy specimens</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>2</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Cited by</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>every locked rule</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why this exists — the opening prose */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§1 Why this exists</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>The problem the methodology defeats.</div>
          </div>
          <div className="prose">
            <p>
              In contemporary AI‑augmented software engineering, a specification is treated as an input to code generation. The methodology advances by making the specification better — longer, more precise, structured as decision records or acceptance criteria — on the expectation that sufficient detail produces correct code.
            </p>
            <p>
              This expectation is wrong. A specification treated as an input is read once, referenced imperfectly, and quietly overruled by the code written against it. Agent compliance with prose rules decays with context length — high at the start of a session, fragmented by the middle, effectively absent by the end. Defect densities, security‑vulnerability rates, and rates of silent fabrication rise in proportion to the distance between the specification's form and the machinery that enforces it.
            </p>
            <p>
              The gap is not closed by writing better specifications. It is closed by changing what a specification is. A domain rule is a specification in a form that can be mechanically verified, cited by every procedure that depends on it, and enforced at every boundary where violation could occur. The rule set, not the code, is the source of truth. The code is either in compliance, or wrong.
            </p>
          </div>
        </div>
      </section>

      {/* Four Commitments */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§2 Four commitments</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>The methodology rests here.</div>
          </div>
          <div>
            <p className="serif" style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 0, marginBottom: 22, maxWidth: "62ch" }}>
              Domain‑Rules‑Driven Development rests on four commitments. The items on the right are not rejected. They are insufficient for software produced by agents that are not themselves bound by the specification.
            </p>
            <table className="data" style={{ fontSize: 14 }}>
              <tbody>
                {commitments.map((c, i) => (
                  <tr key={i}>
                    <td className="mono" style={{ width: "8%", color: "var(--ink-4)" }}>{String(i + 1).padStart(2, "0")}</td>
                    <td style={{ fontSize: 17, color: "var(--ink)", fontWeight: 600 }}>{c.lead}</td>
                    <td className="serif" style={{ fontSize: 16, color: "var(--ink-3)", fontStyle: "italic" }}>{c.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Twelve Rules */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§3 The twelve rules</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>Of a domain rule.</div>
          </div>
          <div>
            <p className="serif" style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 0, marginBottom: 8, maxWidth: "62ch" }}>
              Each rule below specifies a property a domain rule must satisfy to qualify as a specification. A rule failing any of the twelve is not a rule — it is a wish, an opinion, or a policy statement. The discipline begins at the moment of writing.
            </p>
            {twelveRules.map((r) => (<RuleCard key={r.n} rule={r} />))}
          </div>
        </div>
      </section>

      {/* Anatomy of a Domain Rule */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§4 Anatomy</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>Two specimens. Six fixed slots.</div>
          </div>
          <div>
            <p className="serif" style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 0, marginBottom: 24, maxWidth: "62ch" }}>
              A worked specimen. The following rule is canonical and governs approximately every entity access in a cross‑organizationally scoped system.
            </p>

            {/* AUTH-5 */}
            <div style={{ border: "1px solid var(--rule)", background: "var(--paper)", padding: "22px 26px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>AUTH‑5</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Cross‑organization access</span>
                <span className="pill" style={{ marginLeft: "auto" }}>adversarial</span>
              </div>
              <AnatomySlot label="Origin">
                Resolution of audit finding HC‑1 (2026‑04‑07 authority‑hierarchy lockdown). Supersedes earlier <code className="mono" style={{ fontSize: 13 }}>FORBIDDEN "Access denied"</code> pattern. Prior pattern leaked entity existence to cross‑organization probes.
              </AnatomySlot>
              <AnatomySlot label="Text">
                Every single‑entity fetch MUST include <code className="mono" style={{ fontSize: 13 }}>organizationId = ctx.session.activeOrganizationId</code> in the SQL WHERE clause. If the query returns zero rows, throw <code className="mono" style={{ fontSize: 13 }}>NOT_FOUND "&lt;Entity&gt; not found"</code>. Never use <code className="mono" style={{ fontSize: 13 }}>FORBIDDEN "Access denied"</code> — that error leaks entity existence.
              </AnatomySlot>
              <AnatomySlot label="Testable assertion">
                <pre className="code" style={{ fontSize: 12, padding: "12px 14px", margin: 0, lineHeight: 1.5 }}>{`expect(error.code).toBe("NOT_FOUND");
expect(error.message).toBe("<Entity> not found");
// for any request crossing an organization boundary,
// regardless of whether the entity exists, is soft-deleted,
// or belongs to another organization.`}</pre>
              </AnatomySlot>
              <AnatomySlot label="Enforcement">
                <table className="data" style={{ fontSize: 13, marginTop: 4 }}>
                  <tbody>
                    <tr>
                      <td className="mono" style={{ width: "22%", color: "var(--accent)" }}>Write‑time</td>
                      <td>hookify rule blocks the string <code className="mono" style={{ fontSize: 12 }}>FORBIDDEN "Access denied"</code> in any procedure file.</td>
                    </tr>
                    <tr>
                      <td className="mono" style={{ color: "var(--accent)" }}>Gate‑time</td>
                      <td>static‑analysis rule requires <code className="mono" style={{ fontSize: 12 }}>organizationId</code> in every WHERE clause touching an organization‑scoped table.</td>
                    </tr>
                    <tr>
                      <td className="mono" style={{ color: "var(--accent)" }}>Runtime</td>
                      <td>middleware verifies session and active organization before procedure body executes.</td>
                    </tr>
                  </tbody>
                </table>
              </AnatomySlot>
              <AnatomySlot label="Violation closed">
                Three distinct failure cases — entity does not exist, entity was soft‑deleted, entity belongs to another organization — collapse into a single response. A probing client observes identical output for all three. Enumeration across organizational boundaries ceases to be possible. The rule turns a class of information‑disclosure vulnerability into a form the attacker cannot distinguish from a correctly‑operating system.
              </AnatomySlot>
            </div>

            {/* PER-7 */}
            <p className="serif" style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 0, marginBottom: 24, maxWidth: "62ch" }}>
              A second specimen, to demonstrate that the form generalizes across concern types.
            </p>
            <div style={{ border: "1px solid var(--rule)", background: "var(--paper)", padding: "22px 26px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>PER‑7</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Money persistence</span>
                <span className="pill" style={{ marginLeft: "auto" }}>spec</span>
              </div>
              <AnatomySlot label="Origin">
                Commit <code className="mono" style={{ fontSize: 13 }}>4d07fe2</code> (money‑column migration to <code className="mono" style={{ fontSize: 13 }}>bigint</code>). The prior <code className="mono" style={{ fontSize: 13 }}>integer</code> type silently overflowed on asset values above $21,474,836.47 — a threshold crossed routinely by luxury residential, commercial, and institutional real‑estate records.
              </AnatomySlot>
              <AnatomySlot label="Text">
                Money columns MUST be PostgreSQL <code className="mono" style={{ fontSize: 13 }}>bigint</code> with Zod input validator <code className="mono" style={{ fontSize: 13 }}>z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)</code>. The types <code className="mono" style={{ fontSize: 13 }}>integer</code>, <code className="mono" style={{ fontSize: 13 }}>numeric</code>, and <code className="mono" style={{ fontSize: 13 }}>real</code> — and any floating‑point representation — are FORBIDDEN. Currency values are stored as integer cents.
              </AnatomySlot>
              <AnatomySlot label="Testable assertion">
                <pre className="code" style={{ fontSize: 12, padding: "12px 14px", margin: 0, lineHeight: 1.5 }}>{`expect(result.valueCents).toBe(9_007_199_254_740_991);
// round-trips through the database without precision loss.

expect(() => create({ valueCents: Number.MAX_SAFE_INTEGER + 1 }))
  .rejects.toThrow();
// on out-of-range input.`}</pre>
              </AnatomySlot>
              <AnatomySlot label="Enforcement">
                <table className="data" style={{ fontSize: 13, marginTop: 4 }}>
                  <tbody>
                    <tr>
                      <td className="mono" style={{ width: "22%", color: "var(--accent)" }}>Gate‑time</td>
                      <td>static‑analysis rule forbids <code className="mono" style={{ fontSize: 12 }}>integer</code> on money columns; forbids <code className="mono" style={{ fontSize: 12 }}>parseFloat</code> and <code className="mono" style={{ fontSize: 12 }}>toFixed</code> on money values; forbids floating‑point arithmetic on money variables.</td>
                    </tr>
                    <tr>
                      <td className="mono" style={{ color: "var(--accent)" }}>Runtime</td>
                      <td>Zod bound rejects over‑range input at the procedure entry, before any database interaction.</td>
                    </tr>
                  </tbody>
                </table>
              </AnatomySlot>
              <AnatomySlot label="Violation closed">
                Silent overflow on any asset valued above the int32 ceiling. The failure mode is invisible at small scales — most records fit — and catastrophic at production scale: a single corrupted valuation destroys a derived report, a tax filing, or a portfolio summary. The bound is aligned to JavaScript's safe‑integer ceiling rather than PostgreSQL's <code className="mono" style={{ fontSize: 13 }}>bigint</code> ceiling, to prevent precision loss when values cross the API boundary.
              </AnatomySlot>
            </div>

            <p className="serif" style={{ fontSize: 16, color: "var(--ink-3)", lineHeight: 1.6, marginTop: 24, maxWidth: "62ch" }}>
              Two specimens, two concern types, one form. Every domain rule follows the same structure: layer, origin, text, testable assertion, enforcement, violation closed. A rule missing any of the six components is incomplete and cannot be mechanically enforced. A rule file, a domain, and a product are collections of such units, organized by the principles above.
            </p>
          </div>
        </div>
      </section>

      {/* Provenance */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§5 Provenance</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>Where this came from.</div>
          </div>
          <div className="prose">
            <p>
              The methodology described in this document is extracted from the construction of a working specification system: forty‑two domain‑rules files, approximately four thousand rules across twenty‑four domains, a five‑layer enforcement stack (identity file, write‑time hooks, gate‑time static analysis, lifecycle hooks, persistent memory), and an audit history of approximately one thousand findings resolved against the rules they named. The rules govern authentication, persistence, identifiers, errors, audit logging, permissions, and security primitives at the shared tier, and every product domain that references them.
            </p>
            <p>
              This document is the frame. The rule set is the substance. Every rule, every enforcement artifact, every litmus test, every adversarial case, every worked counter‑example — those are what the methodology is made of. They are published as they are written.
            </p>
          </div>
        </div>
      </section>

      {/* Next */}
      <section className="section tight" style={{ background: "var(--paper-2)", borderBottom: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§6 Next</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Browse the public corpus</div>
              <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 14 }}>
                The published rule sample — the methodology compiled to executable form. ast‑grep + hookify, every entry locked with origin and enforcement layer.
              </div>
              <a href="/rules">/rules →</a>
            </div>
            <div style={{ borderTop: "2px solid var(--rule-2)", paddingTop: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Read the failure catalog</div>
              <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 14 }}>
                The incidents that produced the corpus. Each entry: what failed, how it was caught, the rule that now blocks recurrence.
              </div>
              <a href="/incidents">/incidents →</a>
            </div>
          </div>
        </div>
      </section>

      <Footer page="/methodology" />
    </div>
  );
}

window.MethodologyFinal = MethodologyFinal;
