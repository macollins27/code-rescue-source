---
displayId: INC-009
date: "2026-04-27"
severity: high
title: "Earlier skill-iteration framing inverted Feynman; re-locked as canonical"
caughtBy: "founder correction · in-thread"
featured: true
cost: "One bad framing committed to the master plan. Caught and corrected before any skill modification ran against it."
what: |
  <p>The previous version of skill-iteration discipline — committed to <code class="mono" style="font-size: 13px;">docs/plans/master-remediation-plan.md</code> §0.2 on 2026-04-26 — diagnosed the cause of the contract-feature spiral as <em>"agents Feynman-rooting into the tool itself was the cause."</em> The corrective rule that followed banned phrases like <em>"fix the skill,"</em> <em>"iterate on the tool,"</em> <em>"improve the script."</em></p>
  <p>This was wrong. The cause of the spiral was an integrity violation — agents modifying parts of the skill that were not broken. The act of fixing the skill is correct, necessary, and required. A discipline that bans the verb is contradictory: skills that produce wrong output must be fixed at the source. The prior agent's diagnosis had landed before the founder's 2026-04-26 20:27 EDT correction was integrated, and the correction landed only as a sub-bullet — not as the headline.</p>
how: |
  <p>The founder caught the inverted framing on read-through and re-locked the discipline. The new canonical doc, <code class="mono" style="font-size: 13px;">.claude/docs/skill-iteration-protocol.md</code>, is the sole source of truth for skill modification in the codebase. It supersedes every prior framing — including the master plan paragraph that produced the inversion. The forbidden-phrases list narrowed to the actually-forbidden patterns (<em>"while I'm here," "let me clean this up," "improve the structure," "refactor for clarity," "tighten the wording," "for consistency"</em>). The verbs <em>"fix the skill"</em> and <em>"iterate on the tool"</em> are not on that list — they describe what the protocol prescribes.</p>
ruleKind: agent-review
ruleDisplayId: skill-iteration-protocol · re-lock
ruleSeverity: block
ruleLockedOn: "2026-04-27"
ruleGloss: "Re-locked canonical doc at .claude/docs/skill-iteration-protocol.md. Supersedes all prior framings of skill-iteration discipline. If any other doc — plan, memory file, skill SKILL.md — contradicts the protocol, the protocol wins. Correct the other doc by pointing it at this file. The integrity principle (never modify what is not broken) is the operating constraint; the act of fixing skills is REQUIRED when output is wrong."
ruleYaml: |
  # .claude/docs/skill-iteration-protocol.md — re-lock metadata
  #
  # Authority level:    Foundational. Sole source of truth.
  # Audience:           Every Claude agent dispatched in this codebase.
  # Locked:             2026-04-27
  # Source:             Founder's verbatim message 2026-04-26 20:27:38 EDT.
  # Supersedes:         All prior framings of skill-iteration discipline,
  #                     specifically docs/plans/master-remediation-plan.md
  #                     §0.2 (which inverted Feynman by banning "fix the
  #                     skill" / "iterate on the tool").
  #
  # Conflict rule:
  #   If any document — memory file, plan, skill SKILL.md, or any other
  #   artifact — contradicts this protocol, the protocol wins. Correct
  #   the other document by pointing it at this file.
  #
  # The verbs that describe correct application of this protocol are NOT
  # forbidden, even though a prior framing banned them:
  #   "fix the skill"        ← required when output is wrong
  #   "iterate on the tool"  ← required when output is wrong
  #   "improve the script"   ← required when output is wrong
  #
  # The phrases that ARE forbidden — listed for completeness — are tells
  # that an agent has already decided to modify code it has not diagnosed
  # as broken:
  #   "while I'm here"
  #   "let me clean this up"
  #   "improve the structure"
  #   "refactor for clarity"
  #   "tighten the wording"
  #   "for consistency"
ruleCites:
  - feedback_skill_iteration_protocol
  - skill-iteration-protocol
  - INC-005
---
