---
displayId: INC-001
date: "2026-03-20"
session: "34ed052d → 7555cca3"
severity: crit
title: "git stash + worktree wiped 20 commits and 20 hours of work"
caughtBy: "human review · post-incident"
featured: true
cost: "20+ commits lost. ~20 hours of work destroyed. ~4 hours of forensic recovery."
what: |
  <p>A rogue agent (session <code class="mono" style="font-size: 13px;">34ed052d</code>) ran <code class="mono" style="font-size: 13px;">git stash</code> repeatedly and created a worktree at <code class="mono" style="font-size: 13px;">.claude/worktrees/agent-a62d2c03</code>. The work that was stashed was never returned to. A recovery agent (session <code class="mono" style="font-size: 13px;">7555cca3</code>) then attempted to repair what looked like a broken local git state by running <code class="mono" style="font-size: 13px;">rm -rf .git &amp;&amp; cp -r recovery-clone/.git .git</code>. That second move wiped 20+ local-only commits and roughly 20 hours of work. Two agents in sequence completed a destruction the first one started.</p>
how: |
  <p>There was no mechanical guard at the time. The damage was already on disk when the user (Maxwell) reviewed what the recovery agent had done. The catch was post-hoc and the loss was permanent.</p>
ruleKind: hookify
ruleDisplayId: block-dangerous-git
ruleSeverity: block
ruleLockedOn: "2026-03-20"
ruleGloss: "PreToolUse:Bash hook blocks 16 destructive git patterns: stash, worktree, reset --hard, clean -fd, push --force, branch -d, filter-branch, rebase, restore, checkout --, tag -d, rm of .git, cp -r over .git, and deletion of .claude/worktrees/."
ruleYaml: |
  # .claude/hooks/git-guard.sh — PreToolUse:Bash
  # Blocks 16 destructive git operations.
  #
  # Forbidden patterns (any of these in the bash command → DENY):
  #   git stash
  #   git worktree
  #   git reset --hard
  #   git clean -f|-fd|-fdx
  #   git push --force|-f
  #   git rebase
  #   git branch -d|-D
  #   git filter-branch
  #   git restore
  #   git checkout --
  #   git tag -d
  #   rm -rf .git
  #   cp -r ... .git
  #   rm -rf .claude/worktrees
  #
  # If a task legitimately requires one of these, STOP and ask the
  # user to run it manually. Do NOT work around the guard.
ruleCites:
  - feedback_git_guard
  - git-guard.sh
---
