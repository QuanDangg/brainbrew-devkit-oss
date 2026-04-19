---
name: lean-plan
description: >-
  Token-efficient planning with built-in self-review. Produces compact single-file plans.
  Eliminates planner↔reviewer bounce loop. Use when user says "lean plan", "fast plan",
  "plan this efficiently", or when invoked by develop-feature-fast chain.
argument-hint: "[fast] [task]"
allowed-tools: Read, Glob, Grep, AskUserQuestion, mcp__mcp_server_mysql__mysql_query
---

# Lean Planning

Create compact, self-reviewed implementation plans. Single-file output. No bounce loop.

## Core Rules

- Honor **YAGNI**, **KISS**, and **DRY**
- Concise. No filler prose. Fragments OK.
- DO NOT implement code — only plan
- Respect `./docs/development-rules.md` if it exists
- Self-review before output — no separate reviewer step

## Workflow

### Fast Mode (keyword: "fast")

1. Spawn `lean-planner` subagent → creates compact plan in `plans/YYYYMMDD-HHmm-plan-name/plan.md`
2. Report plan path and summary to user
3. **No separate review step** — lean-planner self-reviews internally

### Full Mode (default)

1. **Requirement Analysis** — If requirement docs provided, read them completely first. Extract hard constraints.

2. **Gap Analysis (MANDATORY — NEVER SKIP)** — This step is REQUIRED in ALL cases, even if requirements seem clear. Always perform gap analysis and reconfirm with user before proceeding.
   
   Use `AskUserQuestion` tool to present the structured report and get explicit confirmation:
   - **Achievable** — features with enough info
   - **Ambiguous** — unclear requirements (state what's missing)
   - **Missing** — referenced but no detail
   
   **CRITICAL:** You MUST use `AskUserQuestion` to ask the user to review and confirm the gap analysis. DO NOT proceed to step 3 until the user has explicitly responded. Even if all items are "Achievable", still present the report and ask for confirmation. No exceptions.

3. **Database Understanding (Optional)** — Use `mcp__mcp_server_mysql__mysql_query` to query the database when needed:
   - Understand table structures, relationships, constraints
   - Check existing data patterns, enum values in DB
   - Verify schema assumptions before planning
   - This complements `.docs/` reading — DB gives ground truth on data model

4. **Targeted .docs Reading** — Read ONLY relevant `.docs/` files based on task domain:
   - Backend → `backend/.docs/{overview,models,services,api-routes,patterns,data-contracts}.md`
   - Frontend → `frontend/.docs/{overview,components,routing,state,api-client,patterns,data-contracts}.md`
   - Full-stack → both sets
   - **Skip** `getting-started.md`, `dependencies.md`, `styling.md`, `migrations.md`, `auth.md` unless task directly involves those areas

5. **Enum Resolution** — For dropdown/filter/enum fields: run `find-enum` skill to query live DB. Do this before planning.

6. **Pattern Extraction** — Find ONE existing similar module. Read its structure. This becomes the pattern reference embedded in the plan — so the implementer never needs to re-scout.

7. **Research** (only if needed) — Spawn researcher ONLY when `.docs/` lack needed info. Most features in this codebase follow established patterns and don't need research.

8. **Plan Creation** — Spawn `lean-planner` subagent with all context. Produces single `plan.md` file.

## Plan Output Structure

Everything in ONE `plan.md` file:

```
plans/YYYYMMDD-HHmm-plan-name/
├── plan.md              # Everything: overview, phases, inline changes, review
└── research/            # Only if research was needed (usually not)
```

### plan.md Structure

```markdown
# Plan: <Name>

## Problem
1-2 sentences.

## Approach
High-level solution. 3-5 sentences max.

## Pattern Reference
> Copied from: `src/modules/xyz/`
> - File structure: ...
> - Import style: ...
> - Error pattern: ...

## Phase 1: <Name>
**Goal:** one sentence
**Files:**

### `path/to/file.ts` (create|modify)
Why: ...
Changes:
- ...
```ts
// code snippets for non-obvious parts only
```

## Phase N: ...

## Parallel Execution Map
- Backend phases (1-4): independent, run together
- Frontend phases (5-7): independent, run together
- Cross-dependencies: [list if any]

## Self-Review Result
- [x] All requirements addressed
- [x] File paths verified
- [x] Data contracts synced
- [x] Enum values confirmed
- [ ] [any remaining concerns noted here]
```

## Why This Is Faster

| Original Flow | Lean Flow | Saving |
|---|---|---|
| Planner (Opus) reads ALL .docs/ | Lean-planner (Sonnet) reads ONLY relevant .docs/ | ~60% less reading |
| Planner outputs 31 files (3K+ lines) | Single plan.md (~200-400 lines) | ~85% less plan I/O |
| Reviewer reads all 31 files, finds issues | Self-review checklist before output | Eliminates bounce loop |
| 2-3 planner↔reviewer cycles (45 min) | Single pass with self-review (~10-15 min) | ~70% time saved |
| Implementer re-scouts codebase | Plan embeds pattern reference | Eliminates re-scouting |

## Output

- Report plan file path and summary
- Include parallel execution map
- Flag any unresolved questions
