---
name: implementation
description: >-
  Implement features following a plan and existing codebase patterns. Triggers on
  "implement this", "build this feature", "write the code for", "start coding".
  NOT for planning — use plan. NOT for fixing bugs — use debugging.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

## When to Use

- A plan exists and code needs to be written
- Requirements are clear and ready for implementation
- Translating a design or spec into working code

## When NOT to Use

- No plan or requirements exist yet — use `plan` first
- Fixing a bug or test failure — use `debugging`
- Exploring the codebase — use `scouting`
- Writing documentation only — use `documentation`

## Instructions

### 1. Read the Plan

Read `plan.md` and all referenced phase files and change files completely. Identify:
- Files to create vs. modify
- Dependencies between changes
- Success criteria for the phase

### 2. Scout Codebase Patterns

Before writing any code, use Glob and Grep to find existing patterns:
- File naming conventions (kebab-case, camelCase, etc.)
- Import style (relative vs. absolute, named vs. default)
- Error handling patterns (try/catch, Result types, error codes)
- Test file locations and naming (`.test.ts`, `_test.go`, `test_*.py`)
- Existing similar features to use as templates

**If the plan or requirement doc names a specific page or component as a UI/code template, use that exact one. Do not substitute with a different file found by exploration, even if it looks more similar.**

### 3. Implement Phase-by-Phase

Work through one phase at a time. For each file change:

1. Read the target file (or directory for new files) first
2. Follow existing code style exactly — match indentation, quotes, semicolons
3. Write self-documenting code; add comments only for non-obvious logic
4. Handle errors appropriately using the project's error pattern
5. No hardcoded secrets, credentials, or environment-specific values

### 4. Self-Review Before Reporting

After implementing, re-read each changed file and check:
- All plan requirements are addressed
- No TODO/FIXME left unresolved (unless plan specifies them)
- Imports are correct and no unused imports remain
- Types are consistent (no `any` unless justified)

### 5. Report Changes

## Output

After implementation, provide:
- List of files created with brief purpose
- List of files modified with summary of changes
- Any deviations from the plan with rationale
- Concerns, blockers, or remaining TODOs

## Principles

- **YAGNI** — only implement what the plan specifies
- **KISS** — simplest solution that satisfies requirements
- **DRY** — extract shared logic, but do not over-abstract
- Do NOT refactor unrelated code
- Do NOT make changes that only reformat or prettify code files
- Do NOT add features not in the plan
- Do NOT skip error handling
