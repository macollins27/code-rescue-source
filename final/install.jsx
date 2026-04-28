// Final /install page — DRDD Install service ($80–150K, 42–56 days).
// Mirrors /audit's structure: hero + scope card, deliverable TOC,
// concrete artifact specimens, the schedule, boundaries, CTAs.
// The big distinction from /audit: this is build work — the deliverables
// live IN the client's repo and run in their CI from day one.

function InstallFinal() {
  return (
    <div className="page" style={{ minHeight: "100%" }}>
      <Nav current="install" />

      {/* Hero */}
      <section style={{ padding: "44px 48px 32px", borderBottom: "1px solid var(--rule)" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-4)", marginBottom: 14 }}>
          DRDD‑I · fixed scope · build engagement
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: 34, lineHeight: 1.18, letterSpacing: "-0.02em", fontWeight: 600, margin: 0, maxWidth: "26ch" }}>
              The methodology, installed in your repo, with locked rules and a QA harness that runs in your CI.
            </h1>
            <p className="serif" style={{ fontSize: 17, color: "var(--ink-3)", maxWidth: "60ch", marginTop: 18, lineHeight: 1.55 }}>
              Six to eight weeks. The output is committed code in your repo: a constitution, gates, hooks, an ast‑grep + hookify rule pack tuned to your stack, a Playwright‑driven QA harness, a dispatch protocol, and agent‑review hooks. Locked, version‑pinned, with origin incidents documented.
            </p>
            <div style={{ display: "flex", gap: 22, marginTop: 22, fontSize: 14 }}>
              <a href="#book">Book a 30‑min intro →</a>
              <a href="#deliverables" style={{ color: "var(--ink-2)" }}>What gets committed (list)</a>
              <a href="#methodology" style={{ color: "var(--ink-2)" }}>Methodology paper</a>
            </div>
          </div>
          <table className="data" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td style={{ color: "var(--ink-4)" }}>Price</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>$80–150,000</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Calendar time</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>42–56 days</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Engagement model</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>solo, fixed scope</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Access required</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>write, scoped</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Stack ceiling</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>3 primary languages</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Deliverable</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>committed PR set</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>Rule pack base</td><td className="mono" style={{ textAlign: "right", color: "var(--ink)" }}>89 rules + custom</td></tr>
              <tr><td style={{ color: "var(--ink-4)" }}>30‑day support</td><td className="mono" style={{ textAlign: "right", color: "var(--good)" }}>included</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why this exists */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§1 Why install</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>The case in three lines.</div>
          </div>
          <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: "72ch" }}>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>An audit tells you what's wrong.</strong> It doesn't change what your team will do tomorrow. The findings sit in a PDF.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>An install changes the tomorrows.</strong> Rules become commits. Gates become CI checks. The constitution becomes the document every agent reads at session start. The next time someone — human or model — tries to make the same mistake, the build fails before review.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "var(--ink)" }}>Both, sometimes.</strong> Diligence buyers usually start with <a href="#audit">DRDD‑A</a>. Operators with a team still building usually go straight to install. If you bought a company and got a Red, you probably want both — the audit credit applies to install.
            </p>
          </div>
        </div>
      </section>

      {/* What gets committed — the artifact list */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§2 Deliverables</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What lands in your repo.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Path</th>
                <th style={{ width: "16%" }}>Artifact</th>
                <th>What it does</th>
                <th style={{ width: "12%", textAlign: "right" }}>Form</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/constitution.md</td>
                <td>Constitution</td>
                <td>Eight non‑negotiable principles. Read at every agent session start. Cited from every locked rule and gate by ID.</td>
                <td className="mono" style={{ textAlign: "right" }}>markdown</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/rules/ast‑grep/</td>
                <td>ast‑grep rule pack</td>
                <td>41 base rules + custom. Static patterns that fail the build on match. Origin incident documented per rule.</td>
                <td className="mono" style={{ textAlign: "right" }}>YAML</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/rules/hookify/</td>
                <td>hookify rule pack</td>
                <td>48 base rules + custom. Hookable patterns that run on file save, pre‑commit, or post‑agent‑edit.</td>
                <td className="mono" style={{ textAlign: "right" }}>markdown</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/gates/</td>
                <td>CI gates</td>
                <td>Lint / type / test / rules / harness, in that order. Each gate fails fast and cites the rule it tripped on.</td>
                <td className="mono" style={{ textAlign: "right" }}>shell + YAML</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/hooks/</td>
                <td>Agent‑review hooks</td>
                <td>PreToolUse and PostToolUse hooks. Block git stash, force review on three‑subagent disagreement, etc.</td>
                <td className="mono" style={{ textAlign: "right" }}>shell</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>scripts/qa‑flows/</td>
                <td>QA harness</td>
                <td>66 base flows + custom. Real Chromium via Playwright MCP. Emits over stdio. Findings survive back‑pressure.</td>
                <td className="mono" style={{ textAlign: "right" }}>YAML</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/skills/</td>
                <td>Dispatch skills</td>
                <td>Frontend‑implement, schema‑migrate, audit‑readout, etc. One shape. Lock protocol enforced.</td>
                <td className="mono" style={{ textAlign: "right" }}>markdown</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>.drdd/incidents/</td>
                <td>Incident catalog</td>
                <td>Open log. Each entry: date, session id, root cause, locked rule. Wired to your retrospectives.</td>
                <td className="mono" style={{ textAlign: "right" }}>markdown</td>
              </tr>
              <tr>
                <td className="mono" style={{ color: "var(--accent)" }}>docs/runbook.md</td>
                <td>Runbook</td>
                <td>How to add a rule, how to lock it, how to roll one back. The document your senior engineer reads in week six and never asks me a question about.</td>
                <td className="mono" style={{ textAlign: "right" }}>markdown</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Specimen rule */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§3 Specimen rule</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>One ast‑grep rule, with its origin.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ border: "1px solid var(--rule)", background: "var(--paper)" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--rule)", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)", display: "flex", justifyContent: "space-between" }}>
                <span>R‑017 · no‑silent‑git‑stash</span>
                <span style={{ color: "var(--good)" }}>locked 2026‑03‑22</span>
              </div>
              <pre className="code" style={{ border: "none", margin: 0 }}>
{`id: no-silent-git-stash
language: bash
severity: error
message: |
  git stash without --include-untracked silently
  drops files. Use the documented checkpoint
  protocol or commit instead.

rule:
  pattern: git stash $$$ARGS
  not:
    has:
      pattern: --include-untracked
  not:
    has:
      pattern: --keep-index

origin:
  incident: I-2026-03-22-stash
  cost: 20 commits, 4 hrs recovery
  by: orchestrator agent`}
              </pre>
            </div>
            <div style={{ border: "1px solid var(--rule)", background: "var(--paper)" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--rule)", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)" }}>
                Origin · I‑2026‑03‑22‑stash
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div className="serif" style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  <p style={{ margin: "0 0 0.8em" }}><strong>What happened.</strong> An orchestrator agent ran <code className="mono" style={{ fontSize: 13 }}>git stash</code> across a worktree to "clean up" before a checkpoint. Twenty commits' worth of in‑progress files were silently dropped.</p>
                  <p style={{ margin: "0 0 0.8em" }}><strong>Cost.</strong> Four hours of recovery. Two of those were spent re‑deriving a piece of work I'd already finished and forgotten.</p>
                  <p style={{ margin: 0 }}><strong>Lock.</strong> Rule R‑017 above. Plus sixteen other blocked git patterns in the same family. Documented at <a href="#writing">Twenty commits, one git stash, no warning.</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§4 The six weeks</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What ships when.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Week</th>
                <th style={{ width: "26%" }}>Phase</th>
                <th>What ships, in PRs</th>
                <th style={{ width: "16%", textAlign: "right" }}>You do</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">W‑1</td>
                <td>Scoping audit</td>
                <td>Read‑only sweep against the DRDD rubric. Output is a 10–15 pp. RAG memo sized to the install. Scope locked from this.</td>
                <td className="mono" style={{ textAlign: "right" }}>~2 hrs</td>
              </tr>
              <tr>
                <td className="mono">1</td>
                <td>Constitution + gates</td>
                <td>PR #1: <code className="mono" style={{ fontSize: 13 }}>.drdd/</code> scaffold, constitution drafted with your VPE, lint/type/test gates wired into CI.</td>
                <td className="mono" style={{ textAlign: "right" }}>~3 hrs review</td>
              </tr>
              <tr>
                <td className="mono">2</td>
                <td>Base rule pack</td>
                <td>PR #2: 89 base rules tuned to your stack and removed where they don't fit. Each rule's origin documented or marked <em>borrowed</em>.</td>
                <td className="mono" style={{ textAlign: "right" }}>~2 hrs review</td>
              </tr>
              <tr>
                <td className="mono">3</td>
                <td>Custom rules from your incidents</td>
                <td>PR #3: 8–20 custom rules derived from your last six months of postmortems and bug bashes. Each one with the incident as origin.</td>
                <td className="mono" style={{ textAlign: "right" }}>~4 hrs interviews</td>
              </tr>
              <tr>
                <td className="mono">4</td>
                <td>QA harness</td>
                <td>PR #4: scripts/qa‑flows/ with 8–15 flows covering your top user journeys. Real Chromium. Findings flow into the same rule‑violation surface.</td>
                <td className="mono" style={{ textAlign: "right" }}>~3 hrs review</td>
              </tr>
              <tr>
                <td className="mono">5</td>
                <td>Agent hooks + dispatch</td>
                <td>PR #5: PreToolUse / PostToolUse hooks, dispatch protocol, agent‑review hooks. Three‑subagent disagreement triggers escalation.</td>
                <td className="mono" style={{ textAlign: "right" }}>~3 hrs pairing</td>
              </tr>
              <tr>
                <td className="mono">6</td>
                <td>Lock + handoff</td>
                <td>PR #6: runbook, version pin, incident catalog scaffold, lock procedure. 90‑minute walkthrough with your senior engineers. They can add and lock rules without me.</td>
                <td className="mono" style={{ textAlign: "right" }}>90 min walkthrough</td>
              </tr>
              <tr>
                <td className="mono">+30d</td>
                <td>Support window</td>
                <td>30 calendar days. Rule‑authoring help, gate tuning, and one round of changes. Anything beyond that is a follow‑up engagement.</td>
                <td className="mono" style={{ textAlign: "right" }}>email</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Commitments */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§5 Commitments</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What I commit to, in writing.</div>
          </div>
          <div className="serif" style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)" }}>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Every rule has an origin.</strong> Either from your last six months of postmortems, or marked <em>borrowed</em>. No "we just thought it was a good idea."
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>Every gate runs in under 8 minutes</strong> on a clean cache. If yours exceeds, I tune it before lock.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>The runbook is sufficient.</strong> Your senior engineer adds and locks rules without me. The 30‑day window is for tuning, not for learning to use the toolkit.
            </p>
            <p style={{ margin: "0 0 0.9em" }}>
              <strong style={{ color: "var(--ink)" }}>If a rule causes false positives over 5%, I rewrite it before lock.</strong> No "we'll tighten it later."
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "var(--ink)" }}>If you'd unwind it after 30 days, I refund the lock‑week fee.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing band, what determines it */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§6 Pricing band</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What pushes you to the high end.</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: "26%" }}>Factor</th>
                <th style={{ width: "12%" }}>Floor</th>
                <th style={{ width: "12%" }}>Ceiling</th>
                <th>What it changes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Codebase size</td>
                <td className="mono">≤150k LOC</td>
                <td className="mono">≤750k LOC</td>
                <td>Drives sweep time in W‑1 and the size of the custom‑rule pass in W‑3.</td>
              </tr>
              <tr>
                <td>Primary languages</td>
                <td className="mono">1</td>
                <td className="mono">3</td>
                <td>ast‑grep rules are language‑specific. Each additional primary language adds ~5 days.</td>
              </tr>
              <tr>
                <td>Existing CI maturity</td>
                <td>Modern</td>
                <td>None</td>
                <td>If you already have a coherent pipeline, gates plug in. If not, half of W‑1 is laying CI.</td>
              </tr>
              <tr>
                <td>Postmortem history</td>
                <td>Documented</td>
                <td>Tribal</td>
                <td>Custom rules need origin incidents. If yours live in heads, W‑3 grows.</td>
              </tr>
              <tr>
                <td>Team size at handoff</td>
                <td className="mono">≤8 eng</td>
                <td className="mono">≤30 eng</td>
                <td>Drives the depth of the runbook and the W‑6 walkthrough format.</td>
              </tr>
              <tr style={{ borderTop: "2px solid var(--ink)" }}>
                <td style={{ fontWeight: 600 }}>Engagement total</td>
                <td className="mono" style={{ fontWeight: 600 }}>$80,000</td>
                <td className="mono" style={{ fontWeight: 600 }}>$150,000</td>
                <td className="serif" style={{ color: "var(--ink-3)" }}>Quoted as a band before contract; settled before W‑1.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Worked example */}
      <section className="section tight">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§7 Worked example</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>How a real codebase stacks.</div>
          </div>
          <div>
            <p className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "62ch", marginTop: 0, marginBottom: 18 }}>
              The engagement that produced this site's rule corpus and incident catalog is a clean specimen of the bands. Here's how its shape stacks.
            </p>
            <table className="data" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ width: "26%" }}>Factor</th>
                  <th style={{ width: "30%" }}>This codebase</th>
                  <th>Where that lands</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Codebase size</td>
                  <td className="mono">~225K LOC TS/TSX</td>
                  <td>Mid sweep range</td>
                </tr>
                <tr>
                  <td>Primary languages</td>
                  <td className="mono">1 (TypeScript)</td>
                  <td>At the floor</td>
                </tr>
                <tr>
                  <td>Existing CI maturity</td>
                  <td>None at engagement start</td>
                  <td>Ceiling — half of W‑1 was laying CI</td>
                </tr>
                <tr>
                  <td>Postmortem history</td>
                  <td>Tribal at engagement start</td>
                  <td>Ceiling — the 9 incidents at /incidents were locked during W‑3 origin pass</td>
                </tr>
                <tr>
                  <td>Team size at handoff</td>
                  <td className="mono">1 eng (solo build)</td>
                  <td>At the floor</td>
                </tr>
                <tr style={{ borderTop: "2px solid var(--ink)" }}>
                  <td style={{ fontWeight: 600 }}>Lands at</td>
                  <td className="mono" style={{ fontWeight: 600 }}>$120,000</td>
                  <td className="serif" style={{ color: "var(--ink-3)" }}>Mid‑sized codebase + zero starting infrastructure cancels low language count and small team.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Boundaries */}
      <section className="section tight" style={{ background: "var(--paper-2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, alignItems: "start" }}>
          <div>
            <div className="label">§8 Boundaries</div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", fontFamily: "var(--mono)", marginTop: 8 }}>What the install is not.</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 10 }}>Not included</div>
            <table className="data" style={{ fontSize: 14 }}>
              <tbody>
                <tr>
                  <td className="mono" style={{ width: "8%", color: "var(--ink-4)" }}>01</td>
                  <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Feature work or product engineering.</td>
                </tr>
                <tr>
                  <td className="mono" style={{ color: "var(--ink-4)" }}>02</td>
                  <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Refactors of existing code (rules guard going forward).</td>
                </tr>
                <tr>
                  <td className="mono" style={{ color: "var(--ink-4)" }}>03</td>
                  <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Hiring, eng leadership, or org‑design advisory.</td>
                </tr>
                <tr>
                  <td className="mono" style={{ color: "var(--ink-4)" }}>04</td>
                  <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Security pen‑testing or compliance certification.</td>
                </tr>
                <tr>
                  <td className="mono" style={{ color: "var(--ink-4)" }}>05</td>
                  <td className="serif" style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.55 }}>Operating your CI past the 30‑day window.</td>
                </tr>
              </tbody>
            </table>
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
                Tell me the stack, the team size, and what your last bad outage was. I'll quote a band and a window before we hang up.
              </div>
              <a href="mailto:max@code-rescue.com">max@code-rescue.com →</a>
            </div>
            <div style={{ borderTop: "2px solid var(--rule-2)", paddingTop: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Read the corpus first</div>
              <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 14 }}>
                The 89 base rules are public. If they look like the kind of thing your team should already be enforcing, an install is probably the right shape.
              </div>
              <div style={{ display: "flex", gap: 18, fontSize: 14 }}>
                <a href="#rules">Rule corpus →</a>
                <a href="#methodology">Methodology paper →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer page="/install" />
    </div>
  );
}

window.InstallFinal = InstallFinal;
