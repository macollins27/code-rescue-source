---
displayId: INC-005
date: "2026-04-19 → 2026-04-25"
severity: crit
title: "/contract-feature spiral — 25 iterations, 6 days, contract destroyed"
caughtBy: "human review · post-spiral"
featured: true
cost: "6 days lost. Contract grew 5,750 → 6,708 lines. Findings inflated ~25 → 750+. Tool destroyed; rebuilt from prior commit."
what: |
  <p>Between 2026-04-19 and 2026-04-25, the <code class="mono" style="font-size: 13px;">/contract-feature</code> skill produced a contract that the seven-agent review panel kept finding defects in. Successive agents tried to fix them. Each agent invoked Feynman's first principle — trace the defect to its source, fix the source — and concluded that the source was the skill itself: the <code class="mono" style="font-size: 13px;">SKILL.md</code>, the parser, the injector, the script. That conclusion was correct. The skill <em>was</em> producing defective output. Fixing it <em>was</em> the right move.</p>
  <p>The method was wrong. Each agent, while diagnosing the actual failure, took the opportunity to also modify parts of the skill that were not broken — for shits and giggles, was how the user named it later. They cleaned up working sections. They refactored prompts that were producing correct output. They tightened wording in places where the wording was already fine. Each unjustified modification regressed something that had previously worked. The next agent inherited a worse tool, ran the pipeline, found new defects caused by the prior agent's regressions, and repeated the pattern. Twenty-five iterations later, the tool was destroyed.</p>
how: |
  <p>Caught when the user ran the line counts and finding counts and saw what had happened. The diagnosis came in the user's verbatim message at 2026-04-26 20:27:38 EDT: <em>"the issue that caused 6 day richard feynman root cause fixes to spiral was due to integrity. the agents who were modifying the skill and script were taking parts that werent broken of the skill (prompt) and modifying them for shits and giggles."</em> The 9-step protocol was synthesized from that message and locked at <code class="mono" style="font-size: 13px;">.claude/docs/skill-iteration-protocol.md</code> the next day.</p>
ruleKind: agent-review
ruleDisplayId: skill-iteration-protocol
ruleSeverity: block
ruleLockedOn: "2026-04-27"
ruleGloss: "Sole source of truth on skill modification. Step 0 cap: 3 attempts on the same finding class, then escalate. Step 1.5: rule out non-skill causes. Step 2: independent fresh-context observer confirms the diagnosis. Step 4: three test cases (old-fails, new-passes, regression-unchanged). Step 5: every modified line documented; every non-modified line in the touched area also documented. Forbidden phrases: 'while I'm here,' 'let me clean this up,' 'improve the structure,' 'refactor for clarity,' 'tighten the wording,' 'for consistency.'"
ruleYaml: |
  # .claude/docs/skill-iteration-protocol.md — verbatim excerpt
  #
  # The integrity principle:
  #   Never modify something that is not broken.
  #
  # The 9-step protocol:
  #   Step 0:   Cap check. 3rd attempt on same finding class → STOP.
  #   Step 1:   Cite the exact failure (quoted, not paraphrased).
  #   Step 1.5: Rule out non-skill causes (contract, input, context-budget).
  #   Step 2:   Cite the exact line(s) responsible. Fresh-context observer
  #             confirms before proceeding.
  #   Step 3:   Articulate current invariants. Identify the one being changed.
  #             The rest are protected.
  #   Step 4:   Three test cases:
  #               (a) OLD skill on failing input → reproduces failure.
  #               (b) NEW skill on failing input → succeeds.
  #               (c) NEW skill on already-working input → unchanged.
  #   Step 5:   Diff justification artifact. Every modified line documented.
  #             Every non-modified line in the touched area documented.
  #   Step 6:   Apply. Run all three tests. Regression case unchanged →
  #             proceed; changed → revert, rediagnose.
  #   Step 7:   Commit with diff justification in the message body.
  #
  # Forbidden phrases (any → reject the dispatch and re-diagnose):
  #   "while I'm here"
  #   "let me clean this up"
  #   "improve the structure"
  #   "refactor for clarity"
  #   "tighten the wording"
  #   "for consistency"
ruleCites:
  - feedback_skill_iteration_protocol
  - skill-iteration-protocol
---
