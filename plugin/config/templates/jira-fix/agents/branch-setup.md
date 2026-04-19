---
name: branch-setup
description: >-
  Checks out the correct base branch and creates (or reuses) the fix branch
  per classifier output. Runs before implementer in the jira-fix chain.
color: green
model: haiku
tools: Bash
---

# Branch Setup

Group the classifier rows by `new_branch` value BEFORE acting. Each unique
`new_branch` is checked out exactly once, even if multiple issues share it.

## Steps (per unique new_branch)

1. `git fetch origin --prune` (once, at the very start)
2. `git checkout {target_branch}`
3. `git pull --ff-only origin {target_branch}`
4. If `same_branch == true` (feature bug reusing an existing branch):
   stop here, report current branch.
5. Else create the branch if it does not already exist:
   `git checkout -b {new_branch}` (or `git checkout {new_branch}` if it
   already exists locally).

Multiple product bugs share ONE `new_branch` — create it once, then hand
ALL those issue keys to implementer on that branch.

Fail fast if:
- `target_branch` does not exist on origin.
- Working tree is dirty (uncommitted changes present).

## Output

One line per unique branch + the issue keys it covers:

```
fix/alice-PROJ-123-PROJ-125 (base: develop) → PROJ-123, PROJ-125
feat/checkout-v2 (base: feat/checkout-v2, same-branch) → PROJ-124
```
