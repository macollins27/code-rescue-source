---
displayId: INC-006
date: "2026-04-20"
severity: high
title: "CTO and QA personas hit ~80% compliance ceiling via agent frontmatter"
caughtBy: "empirical regression · session"
featured: true
cost: "12 hours debugging the wrong layer of the stack. Then ~80% → 100% compliance migration on first empirical test."
what: |
  <p>Two custom agents, <code class="mono" style="font-size: 13px;">plw-cto</code> and <code class="mono" style="font-size: 13px;">plw-qa-auditor</code>, both specified personas via agent frontmatter. Both consistently failed to obey instructions that appeared in their frontmatter. The CTO skipped required file reads. The QA auditor ignored its STOP CONDITION and ran 21–77 extra tool calls past the point its deliverable was complete.</p>
  <p>Twelve hours were spent rewriting the prose in both frontmatter files — sharper language, more emphasis, terser stop conditions. None of it worked. The compliance ceiling held at roughly 80%. The root cause was not the wording; it was the delivery mechanism. Agent frontmatter loads into the subagent's <strong>system prompt</strong>. Per Arize's research and the prompt-engineering doc at <code class="mono" style="font-size: 13px;">.claude/docs/research/prompt-engineering-for-ai-coding-agents.md</code>, system-prompt instructions have a measured ~80% compliance ceiling on long or complex directives — the model treats them as background, not as the foreground task.</p>
how: |
  <p>Caught by the user noticing the same persona-non-compliance pattern across two unrelated agents. The fix was a delivery-mechanism change, not a content change: rebuild both as Skills invoked from a freshly-dispatched general-purpose subagent. Skill content delivered through the Skill tool loads into the <strong>user message</strong> of the new subagent — treated as the task itself. Empirical retest on 2026-04-20: the CTO fact-recall test passed with zero extra tool calls, the QA auth-signup dropped from a 77-tool runaway to a 37-tool clean completion, and the forgot-password verification returned the correct classification. The two old agent files were deleted. <code class="mono" style="font-size: 13px;">/cto</code>, <code class="mono" style="font-size: 13px;">/cto-decide</code>, <code class="mono" style="font-size: 13px;">/qa-audit</code>, and <code class="mono" style="font-size: 13px;">/qa-verify</code> shipped as Skills the same day.</p>
ruleKind: agent-review
ruleDisplayId: skills-over-agent-frontmatter
ruleSeverity: block
ruleLockedOn: "2026-04-20"
ruleGloss: "If a persona's behavior must be reliably followed (severity calibration, output format, stop conditions, required reading), specify as a Skill invoked from a fresh general-purpose subagent — NOT as an agent-frontmatter persona. Inline ALL required content in SKILL.md; do not reference external files the skill 'must read first' — the indirection causes skim-or-ignore behavior. Always empirically test a new skill before trusting it: construct a question whose correct answer exists ONLY in the skill body."
ruleYaml: |
  # feedback_skills_over_agent_frontmatter.md (verbatim excerpt)
  #
  # Compliance ceiling, empirically measured on PLW:
  #   Persona via agent frontmatter (system prompt)   ~80%
  #   Persona via Skill tool (user message)          ~100%
  #
  # The dispatch shape that delivers ~100%:
  #
  #   Agent(
  #     subagent_type="general-purpose",
  #     model="opus",
  #     prompt="Invoke the /<skill-name> skill via the Skill tool with args: <JSON>"
  #   )
  #
  # The "via the Skill tool" phrase matters. "Invoke /X" without it
  # causes some subagents to search the filesystem for the skill file
  # instead of calling the tool.
  #
  # Always inline. Do NOT link to external files the skill "must read."
  # The 500-line ceiling in Claude Code docs is folk wisdom that produces
  # skills that skim or ignore referenced files. The user has personally
  # shipped 2,500-line skills that are followed perfectly. Length is not
  # the bug; indirection is.
  #
  # If the persona needs both an orchestrator-level dispatcher and a
  # subagent-level worker, split into two skills:
  #   <name>          — dispatcher, ~40 lines, neutralizes the question
  #   <name>-decide   — worker, full persona, all content inlined
ruleCites:
  - feedback_skills_over_agent_frontmatter
  - cto-decide
  - qa-audit
---
