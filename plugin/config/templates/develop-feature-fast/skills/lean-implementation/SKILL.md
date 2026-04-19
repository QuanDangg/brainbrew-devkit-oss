---
name: lean-implementation
description: >-
  Token-efficient implementation from lean plans. Parallel backend/frontend tracks.
  Skips re-scouting — trusts plan's embedded patterns. Use when user says "lean implement",
  "implement efficiently", or when invoked by develop-feature-fast chain.
argument-hint: "[plan-path]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Lean Implementation

Implement code from lean plans with minimal token usage. Parallel tracks. No re-scouting.

## Core Rules

- **Trust the plan** — pattern reference is embedded, don't re-explore
- Honor **YAGNI**, **KISS**, **DRY**
- Read only files you need to modify or that the plan explicitly references
- Do NOT read `.docs/` — planner already distilled relevant info into plan

## Workflow

### 1. Read the Plan

Read `plan.md` (single file). Identify:
- Total phases and their dependencies
- Which phases are backend-only, frontend-only, or cross-cutting
- The "Parallel Execution Map" section

### 2. Determine Execution Strategy

Check the plan's parallel execution map:

**If backend and frontend phases are independent:**
- Spawn TWO `lean-implementer` subagents in parallel:
  - Agent 1: all backend phases (e.g., Phase 1-4)
  - Agent 2: all frontend phases (e.g., Phase 5-7)
- Each agent gets the full plan.md but instructions to implement only their assigned phases

**If phases have cross-dependencies:**
- Run dependent phases sequentially
- Run independent groups in parallel where possible

**If task is small (≤3 phases, single domain):**
- Spawn ONE `lean-implementer` subagent for all phases
- No need for parallel split on small tasks

### 3. Prompt Template for Subagents

```
Implement phases [N-M] from this plan: plans/<plan-name>/plan.md

You are responsible for:
- Phase N: <name>
- Phase M: <name>

The plan contains a Pattern Reference section — use those patterns directly.
Do NOT explore the codebase for patterns. Do NOT read .docs/ files.
Only read files you need to modify.

After implementing, list files created/modified with 1-line descriptions.
```

### 4. Collect Results

After all subagents complete:
- Merge file lists from both tracks
- Flag any conflicts (rare — backend/frontend are usually independent)
- Report summary to user

## Why This Is Faster

| Original Flow | Lean Flow | Saving |
|---|---|---|
| Implementer reads all .docs/ files | Skips .docs/ entirely | ~2K lines not read |
| Implementer scouts codebase for patterns | Uses plan's embedded pattern reference | Eliminates scouting phase |
| 7 phases run sequentially | Backend + frontend run in parallel | ~40-50% time saved |
| Implementer reads 31 plan files | Reads 1 plan.md file | ~90% less plan I/O |

## Output

After all implementation:
- Files created (path + purpose)
- Files modified (path + summary)
- Deviations from plan (if any)
- Blockers or concerns
