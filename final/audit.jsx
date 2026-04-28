// Final /audit page — DRDD Audit service.
// Modeled on the real sample audit report's structure:
//   cover RAG + score + remediation $ + hours
//   exec summary by domain
//   RAG matrix table (6 domains × severity counts)
//   remediation roadmap (Immediate / 100-day / 6-12mo)
//   finding format (title, effort hrs, confidence, impact prose)

function AuditFinal() {
  return (
    <div className="page" style={{ minHeight: "100%" }}>
      <Nav current="audit" />

      {/* Hero — the offer in one screen */}
      <section style={{ padding: "44px 48px 32px", borderBottom: "1px solid var(--rule)" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 14 }}>
          DRDD‑A · fixed scope · read‑only
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: 34, lineHeight: 1.18, letterSpacing: "-0.02em", fontWeight: 600, margin: 0, maxWidth: "24ch" }}>
              A 30‑to‑43 page technical due‑diligence audit, sourced from the codebase, defensible in committee.
            </h1>
            <p className="serif" style={{ fontSize: 17, color: "var(--ink-3)", maxWidth: "58ch", marginTop: 18, lineHeight: 1.55 }}>
              Five business days. Read‑only access. No agents writing code. The deliverable is a partner‑ready report with an overall RAG, a score per domain, a finding for every issue, and a remediation budget you can put in the model.
            </p>
            <div style={{ display: "flex", gap: 22, marginTop: 22, fontSize: 14 }}>
              <a href="#book">Book a 30‑min intro →</a>
              <a href="#sample" style={{ color: "var(--ink-2)" }}>Sample audit (PDF, 43 pp.)</a>
              <a href="#methodology" style={{ color: "var(--ink-2)" }}>Methodology paper</a>
            </div>
          </div>
          <table className="data" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td style={{ color: "var(--ink-4)" }}>Price</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>$25–40,000</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Calendar time</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>5 business days</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Access required</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>read‑only repo</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Codebase ceiling</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>~750k LOC</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Deliverable</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>30–43 pp. PDF</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Scoring rubric</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>DRDD v0.4</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>NDA / SOC 2 lite</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>standard</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Re‑audit discount</td><td className="mono" style={{ textAlign: "right", color: "var(--good)" }}>40%</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* What you get — page-by-page from the real report TOC */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§1 Deliverable</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What's in the PDF.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "8%" }}>Pages</th>
                <th style={{ width: "22%" }}>Section</th>
                <th>Contents</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">1</td>
                <td>Cover</td>
                <td>Overall RAG, score / 100, remediation estimate in $ and engineering hours, codebase size, primary stack, audit ID.</td>
              </tr>
              <tr>
                <td className="mono">2–3</td>
                <td>Executive summary</td>
                <td>One paragraph per domain. Plain‑English deal implication. Investment recommendation with contingency reserve.</td>
              </tr>
              <tr>
                <td className="mono">3</td>
                <td>RAG risk matrix</td>
                <td>Six domains × severity counts (critical / high / medium / low / info). One table, no prose.</td>
              </tr>
              <tr>
                <td className="mono">4–7</td>
                <td>Remediation roadmap</td>
                <td>Every finding bucketed Immediate / 100‑day / 6–12 month, with hours, $ estimate, and confidence band.</td>
              </tr>
              <tr>
                <td className="mono">8–37</td>
                <td>Findings</td>
                <td>Per finding: title, effort, confidence, evidence (file + line), impact, remediation. Cross‑linked to rule corpus where applicable.</td>
              </tr>
              <tr>
                <td className="mono">38–41</td>
                <td>Domain deep‑dives</td>
                <td>Security, Team Health, Technical Debt, Dependencies, Scalability, Compliance — each with score derivation.</td>
              </tr>
              <tr>
                <td className="mono">42–43</td>
                <td>Appendix</td>
                <td>Methodology version, AI model and version pin, audit depth, reproducibility statement, what was <em>not</em> assessed.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Boundaries — what the audit is not */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§2 Boundaries</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What the audit is not.</div>
          </div>
          <table className="data" style={{ fontSize: 14 }}>
            <tbody>
              <tr>
                <td className="mono" style={{ width: "8%", color: "var(--ink-4)" }}>01</td>
                <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Penetration testing or active exploitation.</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--ink-4)" }}>02</td>
                <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Live infrastructure review (cloud config, DNS, IAM).</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--ink-4)" }}>03</td>
                <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Legal opinion or formal regulatory filing.</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--ink-4)" }}>04</td>
                <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Remediation work — that's <a href="#install">DRDD‑I</a>.</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--ink-4)" }}>05</td>
                <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Anything beyond the repos you grant access to.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* The cover — a real reproduction */}
      <section className="section tight">
        <div className="label">§3 Cover, redacted</div>
        <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginBottom: 18 }}>
          Page 1 of a real audit. Numbers verbatim, identifiers redacted.
        </div>
        <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", padding: 36, maxWidth: 720, margin: "0 auto", boxShadow: "0 1px 0 var(--rule), 0 4px 20px rgba(0,0,0,0.04)" }}>
          <div style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 10, marginBottom: 22, fontSize: 10, fontFamily: "var(--mono)", color: "var(--ink-4)", display: "flex", justifyContent: "space-between" }}>
            <span>CONFIDENTIAL — TECHNICAL DUE DILIGENCE</span>
            <span>Audit ID: ████ · 2026‑03‑06 · 1 / 43</span>
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", marginBottom: 8 }}>TECHNICAL DUE DILIGENCE</div>
          <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 28px" }}>Audit Report</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28, padding: "20px 24px", background: "var(--bad)", color: "#fff" }}>
            <div>
              <div style={{ fontSize: 10, opacity: 0.8, letterSpacing: "0.12em", textTransform: "uppercase" }}>Overall risk</div>
              <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>RED</div>
            </div>
            <div>
              <div style={{ fontSize: 10, opacity: 0.8, letterSpacing: "0.12em", textTransform: "uppercase" }}>Score</div>
              <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4, fontFamily: "var(--mono)" }}>73<span style={{ fontSize: 18, opacity: 0.7 }}> / 100</span></div>
            </div>
          </div>

          <table className="data" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td style={{ color: "var(--ink-4)", width: "44%" }}>Remediation estimate</td><td className="mono" style={{ textAlign: "right" }}>$1,240,000</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Engineering hours</td><td className="mono" style={{ textAlign: "right" }}>8,287 hrs</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Approximate FTE‑years</td><td className="mono" style={{ textAlign: "right" }}>4.8</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Codebase size</td><td className="mono" style={{ textAlign: "right" }}>692,922 LOC</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Primary stack</td><td className="mono" style={{ textAlign: "right" }}>PHP / Laravel 8 + Vue.js 2</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>AI model</td><td className="mono" style={{ textAlign: "right" }}>claude‑sonnet‑4‑5‑20250929</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Audit depth</td><td className="mono" style={{ textAlign: "right" }}>Standard</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* RAG matrix */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§4 RAG matrix</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>From the same report, page 3.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "22%" }}>Domain</th>
                <th style={{ width: "8%" }}>RAG</th>
                <th style={{ width: "10%" }}>Score</th>
                <th style={{ width: "10%", textAlign: "right" }}>Critical</th>
                <th style={{ width: "10%", textAlign: "right" }}>High</th>
                <th style={{ width: "10%", textAlign: "right" }}>Medium</th>
                <th style={{ width: "10%", textAlign: "right" }}>Low</th>
                <th style={{ width: "10%", textAlign: "right" }}>Info</th>
              </tr>
            </thead>
            <tbody>
              {[
                { d: "Security", rag: "RED", s: "68/100", c: 1, h: 2, m: 1, l: 1, i: 0 },
                { d: "Team Health", rag: "RED", s: "62/100", c: 0, h: 3, m: 2, l: 1, i: 0 },
                { d: "Technical Debt", rag: "RED", s: "78/100", c: 1, h: 4, m: 0, l: 0, i: 0 },
                { d: "Dependency Health", rag: "RED", s: "71/100", c: 1, h: 2, m: 2, l: 1, i: 0 },
                { d: "Scalability", rag: "RED", s: "71/100", c: 1, h: 2, m: 2, l: 1, i: 0 },
                { d: "Compliance", rag: "RED", s: "86/100", c: 2, h: 3, m: 2, l: 0, i: 0 },
              ].map((row) => (
                <tr key={row.d}>
                  <td>{row.d}</td>
                  <td><span className="pill" style={{ background: "var(--bad)", color: "#fff", borderColor: "var(--bad)" }}>{row.rag}</span></td>
                  <td className="mono">{row.s}</td>
                  <td className="mono" style={{ textAlign: "right", color: row.c ? "var(--bad)" : "var(--ink-4)" }}>{row.c}</td>
                  <td className="mono" style={{ textAlign: "right", color: row.h ? "var(--warn)" : "var(--ink-4)" }}>{row.h}</td>
                  <td className="mono" style={{ textAlign: "right", color: "var(--ink-3)" }}>{row.m}</td>
                  <td className="mono" style={{ textAlign: "right", color: "var(--ink-4)" }}>{row.l}</td>
                  <td className="mono" style={{ textAlign: "right", color: "var(--ink-4)" }}>{row.i}</td>
                </tr>
              ))}
              <tr style={{ background: "var(--paper-2)" }}>
                <td style={{ fontWeight: 600 }}>Total</td>
                <td></td>
                <td className="mono" style={{ fontWeight: 600 }}>73/100</td>
                <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>6</td>
                <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>16</td>
                <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>9</td>
                <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>4</td>
                <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Remediation roadmap */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§5 Remediation roadmap</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>Bucketed by tier. Hours shown with confidence band.</div>
          </div>
          <div>
            <table className="data" style={{ marginBottom: 24 }}>
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Priority tier</th>
                  <th style={{ width: "12%", textAlign: "right" }}>Items</th>
                  <th style={{ width: "20%", textAlign: "right" }}>Hours</th>
                  <th style={{ textAlign: "right" }}>Estimated cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="dot crit"></span>Immediate</td>
                  <td className="mono" style={{ textAlign: "right" }}>8</td>
                  <td className="mono" style={{ textAlign: "right" }}>1,048</td>
                  <td className="mono" style={{ textAlign: "right" }}>$157,200</td>
                </tr>
                <tr>
                  <td><span className="dot high"></span>100‑day plan</td>
                  <td className="mono" style={{ textAlign: "right" }}>23</td>
                  <td className="mono" style={{ textAlign: "right" }}>5,222</td>
                  <td className="mono" style={{ textAlign: "right" }}>$783,300</td>
                </tr>
                <tr>
                  <td><span className="dot med"></span>6–12 month</td>
                  <td className="mono" style={{ textAlign: "right" }}>4</td>
                  <td className="mono" style={{ textAlign: "right" }}>161</td>
                  <td className="mono" style={{ textAlign: "right" }}>$24,150</td>
                </tr>
                <tr style={{ borderTop: "2px solid var(--ink)" }}>
                  <td style={{ fontWeight: 600 }}>Total</td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>35</td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>8,287</td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>$1,240,000 – $1,964,650</td>
                </tr>
              </tbody>
            </table>

            <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, maxWidth: "70ch" }}>
              The wide upper bound is <em>not</em> padding — it accounts for team‑health risk surfacing during execution. Where the audit finds a Red on Team Health, the report flags which remediation lines are likely to overrun and by how much.
            </div>
          </div>
        </div>
      </section>

      {/* Sample finding — the canonical format */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§6 Finding format</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>One specimen. Every finding follows this shape.</div>
          </div>
          <div style={{ border: "1px solid var(--rule)", background: "var(--paper)" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)" }}>
              <span>SEC‑001 · Immediate · Security</span>
              <span><span className="dot crit"></span>CRITICAL</span>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 12 }}>
                Master Password Backdoor Allows Unrestricted Account Access
              </div>
              <table className="data" style={{ fontSize: 13, marginBottom: 16 }}>
                <tbody>
                  <tr>
                    <td style={{ color: "var(--ink-4)", width: "20%" }}>Effort</td>
                    <td className="mono">40 hrs</td>
                    <td style={{ color: "var(--ink-4)", width: "20%" }}>Confidence</td>
                    <td className="mono" style={{ color: "var(--good)" }}>high</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--ink-4)" }}>Evidence</td>
                    <td className="mono" colSpan={3}>app/Http/Controllers/Auth/LoginController.php:127–148</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--ink-4)" }}>Frameworks impacted</td>
                    <td colSpan={3}>GDPR Art. 32 · PCI‑DSS Req. 8 · SOC 2 CC6.1</td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--ink-4)" }}>Locked rule</td>
                    <td colSpan={3}><a href="#rules" style={{ fontFamily: "var(--mono)" }}>R‑042 · no‑master‑bypass</a> (added 2025‑11‑02)</td>
                  </tr>
                </tbody>
              </table>
              <div className="serif" style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>
                <p style={{ margin: "0 0 0.8em" }}><strong>Impact.</strong> An attacker who discovers the master password can impersonate any user, including administrators, accessing all sensitive data and performing financial transactions. Creates severe legal liability and regulatory violations.</p>
                <p style={{ margin: 0 }}><strong>Remediation.</strong> Remove the bypass. Audit the access log for the past 24 months for any use of the credential. Add the locked rule above to CI on day one of post‑close integration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§7 The five days</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What happens, and what you do.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Day</th>
                <th style={{ width: "30%" }}>Phase</th>
                <th>What happens</th>
                <th style={{ width: "18%", textAlign: "right" }}>You do</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="mono">D‑3</td><td>NDA, repo access, scope lock</td><td>Standard NDA. Read‑only deploy key. Stack and module list. Anything you want me to ignore.</td><td className="mono" style={{ textAlign: "right" }}>~30 min</td></tr>
              <tr><td className="mono">1</td><td>Topology + scoring frame</td><td>Whole‑repo read. Domain weighting set against your industry and stage. Initial RAG hypothesis.</td><td className="mono" style={{ textAlign: "right", color: "var(--ink-4)" }}>—</td></tr>
              <tr><td className="mono">2</td><td>Source‑first findings pass</td><td>Every finding lands with a file + line. AST‑grep + hookify rule corpus run as a first sweep.</td><td className="mono" style={{ textAlign: "right", color: "var(--ink-4)" }}>—</td></tr>
              <tr><td className="mono">3</td><td>Adversarial review</td><td>Nine‑pass review per domain. Findings either survive with stronger evidence or get cut.</td><td className="mono" style={{ textAlign: "right", color: "var(--ink-4)" }}>—</td></tr>
              <tr><td className="mono">4</td><td>Remediation costing</td><td>Hours per finding × confidence. Bucketed Immediate / 100‑day / 6–12 month with cost band.</td><td className="mono" style={{ textAlign: "right" }}>~45 min Q&A</td></tr>
              <tr><td className="mono">5</td><td>Report + walkthrough</td><td>Final PDF. 60‑min walkthrough with your deal team. One round of Q&A by email afterward.</td><td className="mono" style={{ textAlign: "right" }}>60 min</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Commitments — what I will tell you, in writing */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§8 Commitments</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What I will tell you, in writing.</div>
          </div>
          <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)" }}>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Where my confidence is low, and why.</strong> Spelled out per finding.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Which findings depend on assumptions about traffic or data volume.</strong> The assumption named.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Which line items are likely to overrun if Team Health is Red.</strong> Where the team probably can't absorb the work.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Which findings are blockers for your specific exit thesis.</strong> Not generic risk.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "var(--ink)" }}>What I would not buy this company for.</strong> In writing, in the report.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section tight" style={{ borderBottom: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§9 Next</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Book a 30‑minute intro</div>
              <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 14 }}>
                Tell me the company, the stack, and the deadline. I'll tell you whether DRDD‑A is the right shape for the diligence and quote a band before we hang up.
              </div>
              <a href="mailto:max@code-rescue.com">max@code-rescue.com →</a>
            </div>
            <div style={{ borderTop: "2px solid var(--rule-2)", paddingTop: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Read the artifact first</div>
              <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 14 }}>
                Most buyers want the sample audit and the methodology paper before any call. Both are public. Skim them, then book if the shape fits.
              </div>
              <div style={{ display: "flex", gap: 18, fontSize: 14 }}>
                <a href="#sample">Sample audit (PDF) →</a>
                <a href="#methodology">Methodology paper →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer page="/audit" />
    </div>
  );
}

window.AuditFinal = AuditFinal;
