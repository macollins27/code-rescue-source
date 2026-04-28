---
displayId: block-dangerous-git
area: git
action: block
event: "bash (Bash tool calls matching destructive git patterns)"
lockedOn: "2026-03-20"
origin: "INC-001 — agent ran git stash + worktree, recovery agent ran rm -rf .git, 20+ commits and 20 hours of work destroyed"
verbatim: true
gloss: "Sixteen destructive git operations blocked at PreToolUse:Bash before they dispatch. git stash, reset --hard, clean -fd, worktree add, push --force, rebase, restore, branch -D, filter-branch, push origin --delete, rm -rf .git. Companion bash hook git-guard.sh enforces at the same layer."
cites:
  - feedback_git_guard
  - INC-001
  - INC-007
---

```markdown
---
name: block-dangerous-git
enabled: true
event: bash
tool_matcher: Bash
action: block
conditions:
  - field: command
    operator: regex_match
    pattern: (git\s+stash|git\s+reset\s+--hard|git\s+clean\s+-[fFxXd]|git\s+rebase|git\s+restore|git\s+worktree\s+add|git\s+filter-branch|git\s+filter-repo|git\s+push\s+(--force|-f)\b|git\s+branch\s+(-D|-d)\s|git\s+push\s+origin\s+--delete|rm\s+-rf\s+\.git)
---

🚫 **GIT GUARD — Destructive git command blocked!**

This command is forbidden. An agent previously used destructive git operations that:
- Created worktrees → corrupted git state → dropped a stash containing **20+ commits of work**
- Required **2 days of manual transcript recovery** to restore lost files

**Blocked commands:**

| Command | Risk |
|---------|------|
| `git stash` | Stashed work can be dropped, losing all uncommitted changes |
| `git reset --hard` | Destroys uncommitted work with no recovery path |
| `git clean -f/fd/fxd` | Permanently deletes untracked files |
| `git rebase` | Rewrites history; can lose commits if interrupted |
| `git restore` | Overwrites working directory files without a safety net |
| `git worktree add` | Creates isolated worktrees; past incident caused full git corruption |
| `git filter-branch` / `git filter-repo` | Rewrites all history; catastrophic if wrong |
| `git push --force` / `-f` | Overwrites remote history; can permanently lose team commits |
| `git branch -D` / `--delete` | Deletes branches and their unmerged history |
| `git push origin --delete` | Deletes remote branches permanently |
| `rm -rf .git` | Destroys the entire repository |

**What to do instead:**
- **Undo a commit:** `git revert HEAD` (creates new undo commit — safe)
- **See what changed:** `git status`, `git diff`
- **Switch context:** Make a new commit first, then ask the user to help

**This project uses trunk-based development.** All work goes directly to `main`. No branches, no worktrees, no stashes. Commit and push.

See: `.claude/hooks/pre-bash-policy.sh` and `.claude/settings.json` deny rules (technical enforcement)
See: Memory `feedback_git_guard.md` (incident history)
```
