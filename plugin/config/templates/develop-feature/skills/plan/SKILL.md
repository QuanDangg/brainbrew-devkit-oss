---
name: plan
description: Create technical implementation plans with research and codebase analysis. Use when user says "plan this", "design the approach", "how should we implement", "architect this", "break down this feature", or needs a roadmap before coding. Use "fast" to skip research phase.
argument-hint: "[fast] [task]"
allowed-tools: Read, Glob, Grep
---

# Planning

Create detailed technical implementation plans through research, codebase analysis, solution design, and comprehensive documentation.

## Core Rules

- Honor **YAGNI**, **KISS**, and **DRY** principles
- Be honest, brutal, straight to the point, and concise
- DO NOT implement code — only create plans
- Fully respect `./docs/development-rules.md` if it exists

## Workflow

### Fast Mode (keyword: "fast")

> **Warning:** Fast mode skips research and enum resolution. If the task involves enum/dropdown fields, use Full Mode instead, or pass enum values explicitly in your request (e.g., `status: ['active', 'inactive']`).

1. Spawn `planner` subagent → creates plan in `plans/YYYYMMDD-HHmm-plan-name/`
2. Spawn `plan-reviewer` subagent → validates
3. Report plan path and summary to user

### Full Mode (default)

1. **Requirement Analysis — mandatory first step.** If the user provided requirement documents or a spec, read all of them completely before anything else. Extract every explicit instruction — named UI templates, referenced pages, business rules, constraints. These are hard constraints the plan must follow. No exploration result overrides them.

2. **Requirement Gap Analysis — present to user before proceeding.** After reading all requirement docs, produce a structured gap report and **stop to show it to the user**. Do not proceed to planning until the user confirms or clarifies. The report must contain three sections:

   **✅ Achievable** — Features/requirements with enough information to implement. List each one concisely.

   **❓ Ambiguous / Confusing** — Requirements that exist but are unclear, contradictory, or underspecified. For each, state exactly what information is missing or what makes it ambiguous.

   **🚫 Missing Information** — Features implied or referenced by the docs but with no implementation detail (no UI spec, no data model, no business rule). For each, state what is needed before it can be planned.

   After showing this report, ask: **"Do you want to clarify any ambiguous or missing items before I continue planning?"** Wait for the user's response. If they say proceed, continue. If they provide clarifications, incorporate them as hard constraints before moving on.

3. **Initial Analysis** — `.docs/` directories are next. Before reading any source file or spawning any research agent, locate ALL `.docs/` directories at the current level or one level deeper (`*/.docs/`). Read **every file** inside them completely. These files are the ground truth for architecture, patterns, data contracts, API shapes, models, routing, and conventions — treat them as authoritative for every aspect of planning, not just specific topics. Do not skip, skim, or partially read `.docs/` files. Only read source files directly if a specific detail is absent from `.docs/`, and only after finishing all `.docs/` files first.

4. **Enum Resolution** — For every field in the spec that needs a dropdown, filter select, or enum constant: run the `find-enum` skill to query the live DB for actual stored values, then locate existing definitions in the codebase. Do this after the gap analysis response is received and before spawning research subagents — never use placeholder values or invent enum contents. Pass the resolution table to the planner.

5. **Research** — Spawn `research` subagents to investigate approaches. Brief them with the hard constraints from step 1 and the clarifications from step 2. If the spec names a specific page or component as a template, the researcher must read that exact one — not find a "similar" alternative.

6. **Synthesis** — Analyze reports, identify optimal solution. Every decision must be checked against the requirement doc hard constraints. Requirement wins over any codebase pattern.

7. **Plan Creation** — Spawn `planner` subagent → creates plan in `plans/YYYYMMDD-HHmm-plan-name/`. Pass all hard constraints, clarifications from gap analysis, and the enum resolution table explicitly in the planner prompt. Ambiguous items from step 2 that the user did not clarify must be flagged as assumptions in `plan.md`. Enum fields with no codebase match (outcome C from find-enum) must also be flagged as implementation decisions in `plan.md`.

8. **Plan Review** — Spawn `plan-reviewer` subagent → validates

## Plan Directory Structure

```
plans/YYYYMMDD-HHmm-plan-name/
├── research/                # researcher-XX-report.md
├── reports/                 # XX-report.md
├── scout/                   # scout-XX-report.md
├── plan.md                  # Overview + links (keep short)
├── phase-XX-*.md            # Phase overview + links
└── changes/                 # Per-file change details
    ├── src--auth--login.ts.md
    ├── src--api--routes.ts.md
    └── ...
```

### plan.md Structure (overview only)

`plan.md` must be a **short overview** that links to sub-files. Do NOT inline per-file changes.

```markdown
# Plan: <Name>

## Problem
Brief problem statement.

## Approach
High-level solution summary.

## Phases
1. [Phase 1: Auth setup](./phase-01-auth-setup.md)
2. [Phase 2: API routes](./phase-02-api-routes.md)

## Files Affected
| File | Change Type | Details |
|------|-------------|---------|
| `src/auth/login.ts` | modify | [→ changes](./changes/src--auth--login.ts.md) |
| `src/api/routes.ts` | create | [→ changes](./changes/src--api--routes.ts.md) |
```

### changes/ Sub-files

Each file in `changes/` describes what to change in ONE source file. Filename uses `--` as path separator (e.g., `src--auth--login.ts.md`).

```markdown
# src/auth/login.ts (modify)

## Why
Brief reason for changes.

## Changes
1. Add `validateToken()` function after line ~42
2. Update `login()` to call `validateToken()` before session creation
3. Add error handling for expired tokens

## Code Snippets
(pseudocode or actual code for non-obvious changes)
```

### phase-XX-*.md Structure

Each phase links to its relevant `changes/` files:

```markdown
# Phase 1: Auth Setup

## Goal
What this phase achieves.

## Tasks
1. Create token validation — [src/auth/login.ts](./changes/src--auth--login.ts.md)
2. Add auth middleware — [src/middleware/auth.ts](./changes/src--middleware--auth.ts.md)

## Dependencies
- None (first phase)

## Success Criteria
- Token validation passes unit tests
- Auth middleware blocks unauthorized requests
```

## Output

- Respond with plan file path and summary
- Keep `plan.md` as a short index — detail lives in sub-files
- Include code snippets/pseudocode in `changes/` files when clarifying
- Provide multiple options with trade-offs when appropriate
- Make plans detailed enough for junior developers

## Quality Standards

- Be thorough and specific
- Consider long-term maintainability
- Research thoroughly when uncertain
- Address security and performance concerns
- Validate against existing codebase patterns
