// Incidents — the failure catalog.
// Each incident is presented as three beats: what happened, how we caught it,
// what now blocks it. Beat 3 is the reveal: a real locked rule.

const incidents = [
  {
    id: "INC-026",
    date: "2026-02-14",
    session: "8a3f",
    severity: "high",
    title: "Hard delete in property repo",
    caughtBy: "QA harness · pre‑production",
    cost: "3 unrelated rows in dev. 40 min recovery from snapshot.",
    what: (
      <>
        Agent regenerated <code className="mono" style={{ fontSize: 13 }}>removeProperty()</code> after a refactor and reached for <code className="mono" style={{ fontSize: 13 }}>db.delete()</code> instead of the project's <code className="mono" style={{ fontSize: 13 }}>softDeleteSet()</code> helper. FK cascades took out three rows that had no business being touched. The change passed lint, type‑check, and unit tests. It failed when the QA harness ran the property‑archival flow against a dev snapshot.
      </>
    ),
    how: (
      <>
        Caught by Playwright‑driven flow <code className="mono" style={{ fontSize: 13 }}>po‑009‑archive‑property.yml</code> in the QA harness, which asserts that archiving a property leaves dependent records intact. The flow ran on the agent's working branch before the PR opened. <em>The bug never reached a human reviewer.</em>
      </>
    ),
    rule: {
      kind: "ast-grep",
      id: "AG-PO-001",
      lockedOn: "2026-02-14",
      severity: "error",
      gloss: "Property repository remove() must use softDeleteSet() — never db.delete().",
      yaml: `id: po-repo-no-hard-delete
language: typescript
rule:
  pattern: |
    db.delete($TABLE)
  inside:
    kind: method_definition
    has: { regex: '\\bremove\\b' }
severity: error
message: |
  Hard delete forbidden in repo.remove().
  Use softDeleteSet() — see DR‑PO‑014.`,
      cites: ["DR-PO-014", "P-3"],
    },
  },
  {
    id: "INC-019",
    date: "2026-01-29",
    session: "21cb",
    severity: "crit",
    title: "Bypassed authorization in hub mutation",
    caughtBy: "agent‑review hook · pre‑edit",
    cost: "0 — refused at the keystroke.",
    what: (
      <>
        Asked an agent to fix a flaky test in <code className="mono" style={{ fontSize: 13 }}>hub/properties/transfer.ts</code>. The agent's fix was to delete the line <code className="mono" style={{ fontSize: 13 }}>requireOwner(ctx, propertyId)</code> because the test wasn't seeding owner data. The mutation would have shipped open to anyone with a valid session.
      </>
    ),
    how: (
      <>
        The hookify rule <code className="mono" style={{ fontSize: 13 }}>HK‑AUTH‑002</code> fires on <code className="mono" style={{ fontSize: 13 }}>PreToolUse</code> for any <code className="mono" style={{ fontSize: 13 }}>Edit</code>/<code className="mono" style={{ fontSize: 13 }}>Write</code> that deletes a line matching <code className="mono" style={{ fontSize: 13 }}>require[A-Z]\w+\(</code> from a <code className="mono" style={{ fontSize: 13 }}>hub/**</code> file. The hook returned <code className="mono" style={{ fontSize: 13 }}>{"{ behavior: \"deny\" }"}</code>. The edit never landed on disk.
      </>
    ),
    rule: {
      kind: "hookify",
      id: "HK-AUTH-002",
      lockedOn: "2026-01-29",
      severity: "block",
      gloss: "Block deletion of authorization guards in hub/** mutations.",
      yaml: `---
id: hub-no-delete-auth-guard
event: PreToolUse
match:
  tool: [Edit, Write, MultiEdit]
  path: ^hub/.+\\.ts$
  removed: '\\brequire[A-Z]\\w+\\('
action: block
---

# Why

Authorization guards are non‑negotiable. If a guard is failing
a test, the test is wrong or the seed is wrong — not the guard.

This rule was locked after INC‑019 (2026‑01‑29). See AUTH‑3.`,
      cites: ["AUTH-3", "DR-HUB-007"],
    },
  },
];

const allIncidents = [
  { id: "INC-026", date: "2026-02-14", title: "Hard delete in property repo", caughtBy: "QA harness", severity: "high", rule: "AG-PO-001" },
  { id: "INC-024", date: "2026-02-08", title: "tRPC route registered without auth middleware", caughtBy: "ast-grep · gate", severity: "crit", rule: "AG-HUB-004" },
  { id: "INC-021", date: "2026-02-02", title: "Drizzle migration applied without snapshot", caughtBy: "hookify · PreToolUse", severity: "high", rule: "HK-DB-001" },
  { id: "INC-019", date: "2026-01-29", title: "Bypassed authorization in hub mutation", caughtBy: "agent‑review hook", severity: "crit", rule: "HK-AUTH-002" },
  { id: "INC-017", date: "2026-01-22", title: "tRPC error thrown without code", caughtBy: "ast-grep · gate", severity: "med", rule: "AG-ERR-002" },
  { id: "INC-014", date: "2026-01-15", title: "Pagination cursor parsed with parseInt", caughtBy: "ast-grep · gate", severity: "med", rule: "AG-PER-003" },
  { id: "INC-011", date: "2026-01-09", title: "Untrusted input passed to Drizzle sql template", caughtBy: "ast-grep · gate", severity: "crit", rule: "AG-SEC-001" },
  { id: "INC-007", date: "2025-12-28", title: "Audit log write skipped on partial failure", caughtBy: "QA harness", severity: "high", rule: "HK-AL-001" },
  { id: "INC-003", date: "2025-12-12", title: "ID generated with Math.random()", caughtBy: "human review", severity: "high", rule: "AG-ID-001" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function SeverityDot({ s }) {
  return <span className={`dot ${s === "crit" ? "crit" : s === "high" ? "high" : "med"}`} />;
}

function BeatHeader({ idx, label, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
      <span className="mono" style={{
        fontSize: 11,
        color: "var(--ink-4)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}>Beat {idx}</span>
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{label}</span>
      {sub && <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{sub}</span>}
    </div>
  );
}

function IncidentMoment({ inc }) {
  const isHook = inc.rule.kind === "hookify";
  return (
    <article style={{ borderTop: "1px solid var(--rule)", padding: "44px 0" }}>
      {/* Header */}
      <header style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, marginBottom: 36 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Incident</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 20, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--accent)" }}>{inc.id}</span>
            <SeverityDot s={inc.severity} />
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{inc.severity}</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}>
            {inc.date} · session {inc.session}
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: "-0.015em", lineHeight: 1.18, maxWidth: "32ch" }}>{inc.title}</h2>
          <div style={{ marginTop: 14, display: "flex", gap: 28, flexWrap: "wrap", fontSize: 12.5 }}>
            <div>
              <span className="mono" style={{ color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10.5, marginRight: 8 }}>Caught by</span>
              <span className="mono" style={{ color: "var(--ink-2)" }}>{inc.caughtBy}</span>
            </div>
            <div>
              <span className="mono" style={{ color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10.5, marginRight: 8 }}>Cost</span>
              <span className="mono" style={{ color: "var(--ink-2)" }}>{inc.cost}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Beats */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32 }}>
        {/* Spine */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: 24 }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>The moment</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", lineHeight: 1.5 }}>
              Three beats. The third is what permanently blocks it.
            </div>
          </div>
        </div>

        <div>
          {/* Beat 1 — what happened */}
          <div style={{ paddingBottom: 28, borderBottom: "1px solid var(--rule-2)" }}>
            <BeatHeader idx={1} label="What happened" />
            <div className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, marginTop: 12, maxWidth: "62ch" }}>
              {inc.what}
            </div>
          </div>

          {/* Beat 2 — how we caught it */}
          <div style={{ padding: "28px 0", borderBottom: "1px solid var(--rule-2)" }}>
            <BeatHeader idx={2} label="How we caught it" sub={inc.caughtBy} />
            <div className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.65, marginTop: 12, maxWidth: "62ch" }}>
              {inc.how}
            </div>
          </div>

          {/* Beat 3 — the reveal */}
          <div style={{ paddingTop: 28, position: "relative" }}>
            <BeatHeader idx={3} label="What now blocks it" sub={`locked ${inc.rule.lockedOn}`} />

            {/* The reveal card */}
            <div style={{ marginTop: 18, position: "relative" }}>
              {/* Left rail accent — the visual marker for "this is the answer" */}
              <div style={{
                position: "absolute",
                left: -24,
                top: 0,
                bottom: 0,
                width: 3,
                background: "var(--accent)",
              }} />

              <div style={{ border: "1px solid var(--rule)", background: "var(--paper-2)" }}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{inc.rule.kind}</span>
                    <a href="#" style={{ fontSize: 17, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--accent)" }}>{inc.rule.id}</a>
                    <span className="pill" style={{ color: "var(--bad)", borderColor: "var(--bad)" }}>{inc.rule.severity}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-4)" }}>locked {inc.rule.lockedOn}</span>
                </div>
                <div className="serif" style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.55, padding: "16px 22px 14px" }}>
                  {inc.rule.gloss}
                </div>
                <pre className="code" style={{ fontSize: 11.5, padding: "0 22px 18px", margin: 0, lineHeight: 1.55, background: "transparent", border: "none" }}>{inc.rule.yaml}</pre>
                <div style={{ borderTop: "1px solid var(--rule)", padding: "12px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                    Cites:{" "}
                    {inc.rule.cites.map((c, i) => (
                      <React.Fragment key={c}>
                        {i > 0 && <span style={{ color: "var(--ink-4)" }}> · </span>}
                        <a href="#" className="mono" style={{ color: "var(--accent)", fontSize: 11.5 }}>{c}</a>
                      </React.Fragment>
                    ))}
                  </div>
                  <a href="#" className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>full rule → /rules</a>
                </div>
              </div>

              {/* Coda — the receipt line */}
              <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 14, lineHeight: 1.5 }}>
                {/* The proof: lockedOn === incident date or within hours */}
                {inc.rule.lockedOn === inc.date
                  ? <>Failure → rule, <span style={{ color: "var(--good)" }}>same day</span>. Every {inc.id.startsWith("INC") && "incident"} on this page produced one.</>
                  : <>Locked {dayDelta(inc.date, inc.rule.lockedOn)} after the incident. Every incident on this page produced a rule.</>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function dayDelta(a, b) {
  const da = new Date(a + "T00:00:00Z");
  const db = new Date(b + "T00:00:00Z");
  const days = Math.round((db - da) / (1000 * 60 * 60 * 24));
  return days === 1 ? "1 day" : `${days} days`;
}

function LayerPill({ layer }) {
  let style = { color: "var(--ink-3)", borderColor: "var(--rule-2)" };
  if (layer.startsWith("ast-grep")) style = { color: "var(--accent)", borderColor: "var(--accent)" };
  else if (layer.startsWith("hookify")) style = { color: "var(--warn)", borderColor: "var(--warn)" };
  else if (layer.startsWith("QA harness")) style = { color: "var(--good)", borderColor: "var(--good)" };
  else if (layer.startsWith("agent‑review") || layer.startsWith("agent-review")) style = { color: "var(--ink-2)", borderColor: "var(--rule-2)" };
  return <span className="pill" style={style}>{layer}</span>;
}

function IncidentTable() {
  return (
    <table className="data" style={{ fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ width: "12%" }}>ID</th>
          <th style={{ width: "12%" }}>Date</th>
          <th style={{ width: "8%" }}>Sev</th>
          <th>Title</th>
          <th style={{ width: "20%" }}>Caught by</th>
          <th style={{ width: "14%" }}>Locked rule</th>
        </tr>
      </thead>
      <tbody>
        {allIncidents.map((r) => (
          <tr key={r.id}>
            <td className="mono" style={{ color: "var(--accent)" }}>{r.id}</td>
            <td className="mono" style={{ color: "var(--ink-3)" }}>{r.date}</td>
            <td><SeverityDot s={r.severity} /><span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{r.severity}</span></td>
            <td>{r.title}</td>
            <td><LayerPill layer={r.caughtBy} /></td>
            <td className="mono"><a href="#" style={{ color: "var(--accent)" }}>{r.rule}</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function IncidentsFinal() {
  return (
    <div className="page" style={{ minHeight: "100%" }}>
      <Nav current="incidents" />

      {/* Hero */}
      <section style={{ padding: "44px 48px 32px", borderBottom: "1px solid var(--rule)" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 14 }}>
          Public catalog · open · v0.4.1
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <h1 style={{ fontSize: 44, lineHeight: 1.08, letterSpacing: "-0.02em", fontWeight: 600, margin: 0, maxWidth: "22ch" }}>
              We catalog our failures. Each one becomes a permanent rule.
            </h1>
            <p className="serif" style={{ fontSize: 17.5, color: "var(--ink-2)", maxWidth: "60ch", marginTop: 22, lineHeight: 1.55 }}>
              Nine major incidents in the four months since the methodology locked. Every one has a date, a session id, a root cause, and the rule that now blocks recurrence. Most were caught before a human reviewer ever saw the diff. The cases below are the moment the rule was born.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <table className="data" style={{ fontSize: 13 }}>
              <tbody>
                <tr><td style={{ color: "var(--ink-4)" }}>Catalogued</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>9</td></tr>
                <tr><td style={{ color: "var(--ink-4)" }}>Caught pre‑production</td><td className="mono" style={{ textAlign: "right", color: "var(--good)" }}>9 / 9</td></tr>
                <tr><td style={{ color: "var(--ink-4)" }}>Avg time to lock rule</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>4 hrs</td></tr>
                <tr><td style={{ color: "var(--ink-4)" }}>Same‑day rule lock</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>7 / 9</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Featured incidents — the "moment" */}
      <section style={{ padding: "0 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, padding: "44px 0 8px" }}>
          <div className="label">Featured</div>
          <div className="serif" style={{ fontSize: 15, color: "var(--ink-3)", maxWidth: "60ch", lineHeight: 1.55 }}>
            Two incidents shown in full. The third beat — the locked rule — is the proof point of the methodology. <em>Failure becomes infrastructure.</em>
          </div>
        </div>
        {incidents.map((inc) => (
          <IncidentMoment key={inc.id} inc={inc} />
        ))}
      </section>

      {/* Full table */}
      <section className="section tight" style={{ borderTop: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">All incidents</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8, lineHeight: 1.5 }}>
              Showing 9 / 9. Each row links to the locked rule.
            </div>
          </div>
          <IncidentTable />
        </div>
      </section>

      <Footer page="/incidents" />
    </div>
  );
}

window.IncidentsFinal = IncidentsFinal;
