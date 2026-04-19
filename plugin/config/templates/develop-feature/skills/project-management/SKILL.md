---
name: project-management
description: >-
  Track implementation progress, update plan status, identify blockers, and write status reports.
  Triggers on "update the plan status", "what's the progress", "mark phase as done",
  "project status", "track progress". NOT for creating plans — use plan.
allowed-tools: Read, Write, Edit, Grep, Glob
---

## When to Use

- Updating phase status in a plan after implementation completes
- Generating a progress report across phases
- Identifying blockers or dependencies that are stuck
- Coordinating what to work on next

## When NOT to Use

- Creating a new plan — use `plan`
- Implementing code — use `implementation`
- Reviewing code — use `code-review`

## Instructions

### 1. Read the Plan

Read `plan.md` and all phase files in the plan directory. Identify:
- Total number of phases
- Current status of each phase (not started, in progress, done, blocked)
- Dependencies between phases

### 2. Check Implementation Status

Use Grep and Glob to verify which planned files have been created or modified:
- Check if files listed in `changes/` exist in the codebase
- Run `git log --oneline -20` to see recent commits related to the plan
- Cross-reference committed changes against phase requirements

### 3. Update Phase Status

Edit the relevant phase files or `plan.md` to mark completed phases. Use a consistent status format:
- `[x]` for completed tasks
- `[ ]` for pending tasks
- `[BLOCKED]` for blocked tasks with reason

### 4. Identify Blockers

Flag any phase that cannot proceed due to:
- Missing dependencies from a prior phase
- Unresolved technical questions
- External blockers (API access, credentials, third-party services)

### 5. Write Status Report

## Output

```
## Project Status: [plan name]

### Phase Progress
| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: [name] | Done | 100% |
| Phase 2: [name] | In Progress | 60% |
| Phase 3: [name] | Not Started | 0% |

### Blockers
- [Phase X] blocked by [reason]

### Next Steps
1. [Most important next action]
2. [Second priority]

### Files Modified
- [List of files changed since last update]
```
