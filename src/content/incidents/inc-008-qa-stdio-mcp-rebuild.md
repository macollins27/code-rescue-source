---
displayId: INC-008
date: "2026-04-21"
session: "cb82dc8b"
severity: crit
title: "QA emission silently dropped — CSP blocked HTTP, watchdog killed agent before batch fired"
caughtBy: "post-run review · zero findings"
featured: true
cost: "Zero findings preserved from a 67-tool-call discovery that had already root-caused a CRITICAL `o.map` bug and reproduced 5 March-29 reference findings."
what: |
  <p>The earlier QA harness real-time findings channel was implemented as an HTTP endpoint at <code class="mono" style="font-size: 13px;">scripts/qa-emit-server.ts</code>. The user had asked for an MCP server; the implementing plan silently downgraded the request to "MCP or HTTP — chose HTTP for simplicity," and HTTP is what shipped. Phase 2's first real Phase 2 dispatch (run <code class="mono" style="font-size: 13px;">qa-reports/2026-04-21/1452</code>) revealed the flaw: the app's Content Security Policy <code class="mono" style="font-size: 13px;">connect-src</code> directive rejected <code class="mono" style="font-size: 13px;">browser_evaluate</code> fetches from <code class="mono" style="font-size: 13px;">localhost:3011</code> to <code class="mono" style="font-size: 13px;">127.0.0.1:3012</code>. The agent fell back to batch-at-end <code class="mono" style="font-size: 13px;">Write</code>. Then the 60-minute wall-clock watchdog killed the agent before the batch <code class="mono" style="font-size: 13px;">Write</code> could fire.</p>
  <p>What was lost: a 67-tool-call discovery run that had already root-caused a CRITICAL <code class="mono" style="font-size: 13px;">o.map</code> bug and reproduced five reference findings from the March-29 baseline. None of it survived to disk. The agent had done correct, valuable work; the emission layer ate all of it.</p>
how: |
  <p>The fix was an architectural rewrite, not a patch — no further QA dispatches until the emission layer was rebuilt and no work deferred. The HTTP server was deleted. The new emission layer is a stdio MCP server at <code class="mono" style="font-size: 13px;">scripts/qa-emit-mcp.ts</code>: JSON-RPC over the <code class="mono" style="font-size: 13px;">claude -p</code> subprocess's stdin/stdout. Browser CSP does not apply because there is no browser request — the bytes move through process pipes, not network sockets.</p>
  <p>The rebuild also pinned the durability primitive — <code class="mono" style="font-size: 13px;">scripts/qa-emit-writer.ts</code> with <code class="mono" style="font-size: 13px;">O_EXCL</code> lockfile, fsync per write, TTL-based stale-holder recovery — and shipped a 12-test validation suite (T1-T12) that exercises the full chain runner → MCP config → claude -p → stdio → writer → disk without spending budget on a real QA flow. T11 and T12 specifically run a real <code class="mono" style="font-size: 13px;">claude -p</code> against a runner-shape <code class="mono" style="font-size: 13px;">.mcp-test.json</code>, prompt the agent to call the tool exactly once, and verify the line landed on disk. T12 is the last gate before any new Phase 2 dispatch.</p>
ruleKind: qa-harness
ruleDisplayId: qa-emit-mcp + writer + T1-T12
ruleSeverity: error
ruleLockedOn: "2026-04-21"
ruleGloss: "Stdio MCP transport for QA findings emission. fsync-per-write + O_EXCL lockfile + TTL-based stale-holder recovery + in-memory Promise chain for same-process serialization. The shared writer is imported by the MCP server AND by in-process deterministic probes (prescan, fuzz, state-walk, contract-check). 12-test validation suite (T1-T12) gates every Phase 2 dispatch."
ruleYaml: |
  # scripts/qa-emit-mcp.ts — stdio MCP server (architecture excerpt)
  #
  # Replaces deleted scripts/qa-emit-server.ts (CSP-blocked HTTP).
  #
  # Transport: JSON-RPC over claude -p subprocess stdin/stdout.
  # No browser. No fetch. CSP does not apply.
  #
  # ─── Tools exposed ───
  #   finding_emit  — append a finding to .findings-stream.jsonl
  #   flow_open     — record flow start
  #   flow_close    — record flow end
  #   status        — return durability counters
  #
  # ─── Durability primitive (qa-emit-writer.ts) ───
  #   O_EXCL lockfile      — cross-process atomicity above PIPE_BUF
  #   fsync per write      — survives SIGKILL mid-burst
  #   TTL stale recovery   — reclaim lock if holder dies (<2s)
  #   Promise chain        — same-process serialization
  #
  # ─── Validation suite (T1-T12) ───
  #   T1-T4    writer durability (10 procs × 100 writes × 8KB → 1000 lines)
  #   T5-T10   MCP server via SDK client (handshake, tools, lifecycle,
  #            invalid input survival, SIGTERM drain, SIGKILL)
  #   T11-T12  full integration: real claude -p against runner-shape
  #            .mcp-test.json — last gate before any QA dispatch
  #
  # ─── Survives ───
  #   60-min watchdog kill mid-flow → all emitted findings on disk
  #   Browser CSP                   → not applicable (no fetch)
  #   Agent crash                   → fsync per write
  #   Process restart               → stale lock reclaimed
ruleCites:
  - project_session_2026_04_21_qa_mcp_rebuild
  - qa-emit-mcp
  - qa-emit-writer
---
