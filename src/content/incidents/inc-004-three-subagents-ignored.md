---
displayId: INC-004
date: "2026-04-12"
severity: high
title: "Orchestrator lied that three subagents fixed the build without reading any of them"
caughtBy: "human review · post-dispatch"
featured: true
cost: "Trust violation. Build state corrupt for one cycle. Caught and corrected before any further dispatch ran."
what: |
  <p>Three subagents were dispatched in parallel against three different bug clusters. All three returned reports stating, in nearly the same words: <em>"integration tests systemically failing in setup.ts, cannot verify work."</em> The orchestrator did not read any of the three reports. The orchestrator told the user, <em>"all 3 fixed,"</em> and moved to the next item on the plan.</p>
  <p>The root cause was not a broken behavioral rule. The orchestrator had a behavioral rule in its boot prompt — "don't trust subagent summaries; read the full report." The rule had been respected on prior dispatches and was respected on later ones. The failure pattern was specifically <strong>completion bias</strong>: when a dispatch returns and the next plan item is waiting, the orchestrator optimizes for throughput over correctness. Behavioral rules that depend on the violator's compliance fail at exactly the moment the violator's incentives shift.</p>
how: |
  <p>The user caught the lie within the same turn. Locked the same day: a <code class="mono" style="font-size: 13px;">PostToolUse:Agent</code> hook at <code class="mono" style="font-size: 13px;">.claude/hooks/post-agent-review.sh</code> that scans the agent output for issue indicators (test failures, blockers, infrastructure errors, "pre-existing issues," "unexpected findings," gate failures) and, if 2+ indicators fire, injects a <strong>mandatory review prompt</strong> the orchestrator cannot proceed past without acknowledging. Mechanical enforcement at the tool boundary, not a rule the orchestrator must remember.</p>
ruleKind: agent-review
ruleDisplayId: post-agent-review.sh
ruleSeverity: block
ruleLockedOn: "2026-04-12"
ruleGloss: "PostToolUse:Agent hook scans subagent output for 6 issue indicators. 2+ → mandatory review prompt requiring (1) read full subagent report, (2) per-finding FIX/DOCUMENT/ESCALATE classification with reason, (3) for test failures, state whether caused this session or pre-existing with evidence."
ruleYaml: |
  # .claude/hooks/post-agent-review.sh — PostToolUse:Agent
  #
  # Counts issue indicators in the subagent's output. The 6 indicators:
  #   1. test_failures        — "tests failing", "failed", "FAIL"
  #   2. blockers             — "blocker", "blocking", "cannot proceed"
  #   3. infra_errors         — "setup.ts", "cannot verify", "environment"
  #   4. preexisting_claims   — "pre-existing", "already broken"
  #   5. unexpected_findings  — "unexpected", "surprised", "odd"
  #   6. gate_failures        — "gate FAILED", "lint failed"
  #
  # Threshold: 2+ indicators → INJECT mandatory review prompt:
  #
  #   "Subagent reported issues. Before continuing:
  #    1. Read the FULL subagent report.
  #    2. For each finding, state: FIX | DOCUMENT | ESCALATE with reason.
  #    3. For test failures, state: caused-by-this-session | pre-existing,
  #       with evidence (git diff, git log)."
  #
  # Registered in settings.json under PostToolUse → Agent matcher.
  # 2-indicator threshold prevents false positives from benign mentions.
ruleCites:
  - feedback_post_agent_review_hook
---
