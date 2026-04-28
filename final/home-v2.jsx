// Homepage v2 — Dense editorial. Tigerbeetle / Oxide tone.
// Information density is the message. Tables, footnotes, monospace metadata.

function HomeV2() {
  return (
    <div className="page" style={{ minHeight: "100%" }}>
      <Nav current="home" />

      {/* Above-the-fold: positioning + masthead numbers */}
      <section style={{ padding: "44px 48px 24px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "end" }}>
          <div>
            <div className="label" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 14 }}>
              Code Rescue · v0.4.1 · Locked 2026‑04‑11
            </div>
            <h1 style={{
              fontSize: 34,
              lineHeight: 1.18,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              margin: 0,
              maxWidth: "26ch",
            }}>
              AI‑augmented engineering and due‑diligence audits for codebases that have to survive review.
            </h1>
            <p className="serif" style={{ fontSize: 16, color: "var(--ink-3)", maxWidth: "58ch", marginTop: 16, lineHeight: 1.55 }}>
              Maxwell A. Collins. Solo operator. The methodology, the rule corpus, and the incident catalog on this site are the artifacts the work produces. Every claim has a source.
            </p>
          </div>
          <table className="data" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td style={{ color: "var(--ink-4)" }}>Production systems shipped</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>6<FN n={1} /></td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Hours on this methodology</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>~2,000<FN n={2} /></td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Major incidents catalogued</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>9<FN n={3} /></td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Enforcement rules in corpus</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>89<FN n={4} /></td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>QA flows in harness</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>66<FN n={5} /></td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Production incidents on shipped code</td><td className="mono" style={{ textAlign: "right", color: "var(--good)" }}>0<FN n={6} /></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Offerings — bare table, prices visible */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§1 Offerings</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>3 / 3 fixed‑scope</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Code</th>
                <th style={{ width: "22%" }}>Offering</th>
                <th style={{ width: "11%" }}>Price</th>
                <th style={{ width: "10%" }}>Days</th>
                <th>What you get</th>
                <th style={{ width: "10%", textAlign: "right" }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>DRDD‑A</td>
                <td>DRDD Audit</td>
                <td className="mono">$25–40K</td>
                <td className="mono">5</td>
                <td>Source‑first read‑only audit against the DRDD rubric. Findings classified Type 1 / 2 / 3. Partner‑ready summary, full report, remediation plan, redacted sample available before signing.</td>
                <td style={{ textAlign: "right" }}><a href="#">/audit →</a></td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>DRDD‑I</td>
                <td>DRDD Install</td>
                <td className="mono">$80–150K</td>
                <td className="mono">42–56</td>
                <td>Constitution, gates, hooks, ast‑grep + hookify rule packs, QA harness, dispatch protocol, agent‑review hooks. Tuned to your stack. Locked rules with origin incidents.</td>
                <td style={{ textAlign: "right" }}><a href="#">/install →</a></td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>ENG</td>
                <td>Engagement</td>
                <td className="mono">Custom</td>
                <td className="mono">—</td>
                <td>Bounded technical work. Use this when you want the operator who wrote the methodology, not someone trained on it.</td>
                <td style={{ textAlign: "right" }}><a href="#">/engagements →</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Buyer fit */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr", gap: 32 }}>
          <div>
            <div className="label">§2 Fit</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>Read yourself in.</div>
          </div>
          {[
            { who: "PE / VC tech‑DD", what: "Diligence on AI‑augmented portfolio companies. The methodology paper and a redacted sample audit are usually enough to know whether to talk.", buy: "DRDD‑A" },
            { who: "CTOs at AI‑native SaaS", what: "Preparing for a funding round, acquisition, or any external audit. Install if the team will keep building; Audit if the codebase is a fixed artifact.", buy: "DRDD‑I" },
            { who: "Eng leaders rolling out AI", what: "Internal AI‑coding rollout at orgs where the rules you write will outlive the rollout itself. Install scoped to the rollout.", buy: "DRDD‑I" },
          ].map((b, i) => (
            <div key={i}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{b.who}</div>
              <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>{b.what}</div>
              <div style={{ marginTop: 10, fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink-4)" }}>
                Likely fit: <span style={{ color: "var(--accent)" }}>{b.buy}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent work — dense table */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§3 Engagements</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>Redacted, specific.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "13%" }}>Period</th>
                <th style={{ width: "8%" }}>Type</th>
                <th style={{ width: "26%" }}>Subject</th>
                <th>Notes</th>
                <th style={{ width: "8%", textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">2026‑01 → present</td>
                <td><span className="pill">build</span></td>
                <td>Six‑product TS monorepo, NDA<FN n={1} /></td>
                <td>Solo build under 90/100 audit target. Hub, PO, LIP, LSP, LMP, Admin. ~2,000 hrs. Source‑first pipeline. 9‑pass adversarial review per domain. External audit on roadmap.</td>
                <td className="mono" style={{ textAlign: "right", color: "var(--good)" }}>active</td>
              </tr>
              <tr>
                <td className="mono">2026‑04‑11</td>
                <td><span className="pill">paper</span></td>
                <td>DRDD methodology v0.4</td>
                <td>17‑min read. Eight non‑negotiable principles. Locked, version‑pinned. Cited from every CTO decision and skill in the system.</td>
                <td className="mono" style={{ textAlign: "right" }}>locked</td>
              </tr>
              <tr>
                <td className="mono">2026‑02 → 2026‑04</td>
                <td><span className="pill">corpus</span></td>
                <td>Public rule corpus, 89 rules</td>
                <td>41 ast‑grep + 48 hookify. Each entry: origin incident, locked‑on date, enforcement layer (file / bash / agent / gate).</td>
                <td className="mono" style={{ textAlign: "right" }}>open</td>
              </tr>
              <tr>
                <td className="mono">ongoing</td>
                <td><span className="pill">catalog</span></td>
                <td>Nine major incidents</td>
                <td>Each entry has a date, a session id, what failed, the rule that locked, and the hook or grep pattern that now blocks recurrence.</td>
                <td className="mono" style={{ textAlign: "right" }}>open</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Now + Writing — two columns */}
      <section className="section tight" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div>
          <div className="label">§4 Now</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 14px" }}>What I'm working on this week.</h2>
          <div className="serif" style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Building.</strong> Canonical‑identity migration v2 inside the monorepo. Wave 1, layer 0a audit complete; layer 0 retro validation in flight.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Stuck on.</strong> Making <code className="mono" style={{ fontSize: 13 }}>/frontend‑implement</code> reliable enough that one agent can take a wireframe and a tRPC contract and produce production‑grade React without a seven‑round human review loop. I have no answer yet.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Last week.</strong> Re‑locked the skill‑iteration protocol after a near‑regression. <a href="#">Writeup.</a>
            </p>
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 14 }}>
            Last edited 2026‑04‑27 · <a href="#" style={{ color: "var(--ink-4)", borderBottomColor: "var(--rule)" }}>full /now page →</a>
          </div>
        </div>
        <div>
          <div className="label">§5 Writing</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 14px" }}>Recent.</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { d: "2026‑04‑27", t: "Skill‑iteration protocol, re‑locked." },
              { d: "2026‑04‑21", t: "Why the QA harness emits over stdio, not HTTP." },
              { d: "2026‑04‑12", t: "When three subagents say the build is broken, listen." },
              { d: "2026‑03‑22", t: "Twenty commits, one git stash, no warning." },
              { d: "2026‑03‑16", t: "Eight principles. Why the constitution is short." },
            ].map((p, i) => (
              <li key={i} style={{ borderBottom: "1px solid var(--rule)", padding: "10px 0", display: "grid", gridTemplateColumns: "100px 1fr", gap: 16, alignItems: "baseline" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--ink-4)" }}>{p.d}</span>
                <a href="#" style={{ color: "var(--ink)", borderBottom: "none", fontSize: 15 }}>{p.t}</a>
              </li>
            ))}
          </ul>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 14 }}>
            <a href="#" style={{ color: "var(--ink-4)", borderBottomColor: "var(--rule)" }}>archive →</a> · <a href="#" style={{ color: "var(--ink-4)", borderBottomColor: "var(--rule)" }}>RSS</a>
          </div>
        </div>
      </section>

      <Footnotes items={[
        <span>Hub, PO, LIP, LSP, LMP, Admin. TypeScript monorepo. Built solo with Claude Code under a documented dispatch protocol. Client name redacted under NDA.</span>,
        <span>Approximation. Counted from session logs and dispatch records 2026‑01‑02 → 2026‑04‑27.</span>,
        <span>Catalogued at <a href="#">/incidents</a>. Each entry includes session id, date, root cause, and the locked rule that now blocks recurrence.</span>,
        <span>41 ast‑grep YAML rules + 48 hookify markdown rules. Browseable at <a href="#">/rules</a>.</span>,
        <span>66 flow YAML files in <code className="mono">scripts/qa-flows/</code>, each driving a real Chromium browser via Playwright MCP.</span>,
        <span>Zero production incidents on the six shipped products in the engagement above. Pre‑production incidents are catalogued openly at <a href="#">/incidents</a>; that's the point.</span>,
      ]} />

      <Footer page="/" />
    </div>
  );
}

window.HomeV2 = HomeV2;
