---
name: code-review
description: >-
  Review code changes for bugs, security vulnerabilities, performance issues, and correctness.
  Triggers on "review this code", "check my changes", "code review", "review the diff".
  NOT for requesting external reviews — use requesting-code-review instead.
allowed-tools: Read, Grep, Glob, Bash
---

## When to Use

- After implementing code changes, before committing
- When reviewing a git diff or set of changed files
- When asked to check code quality or find bugs
- After a PR is opened and needs review

## When NOT to Use

- Requesting a review from a human or external service — use `requesting-code-review`
- Planning or designing — use `plan`
- Writing code — use `implementation`

## Instructions

### 1. Gather Changes

Run `git diff` (or `git diff --cached` for staged changes) to identify all modified files. If reviewing specific files, read them directly with the Read tool.

### 2. Read All Changed Files

Read every changed file in full. Do NOT review from memory or summaries. Use Grep to check for patterns across the codebase when needed.

### 3. Check Each Dimension

**Security:**
- Scan for injection vectors (SQL, command, XSS)
- Check for hardcoded secrets, API keys, tokens
- Verify input validation and sanitization
- Confirm auth/authz checks are present where needed

**Correctness:**
- Trace logic paths for off-by-one errors, null checks, edge cases
- Verify error handling covers failure modes
- Check that API contracts match between caller and callee
- Look for resource leaks (unclosed files, connections, listeners)

**Performance:**
- Flag N+1 queries, unbounded loops, blocking I/O in async contexts
- Check for unnecessary allocations or copies
- Verify pagination on list endpoints

**Maintainability:**
- Identify dead code or unreachable branches
- Flag duplicated logic (3+ occurrences)
- Check naming clarity and function length (>50 lines is a warning)

### 4. Cross-Reference with Codebase

Use Grep to verify that changes are consistent with existing patterns. Check imports, naming conventions, and error handling style match the rest of the codebase.

### 5. Produce Structured Review

## Output

```
## Code Review: [scope]

**Verdict:** APPROVED | APPROVED WITH SUGGESTIONS | ISSUES

### Issues

#### [HIGH/MEDIUM/LOW] Issue title
- **File:** path/to/file.ext:line
- **Problem:** What is wrong
- **Fix:** Specific code change needed
- **Before:** `problematic code`
- **After:** `fixed code`

### Checklist Summary
- Security: PASS | issues found
- Correctness: PASS | issues found
- Performance: PASS | issues found
- Maintainability: PASS | issues found
```

### Severity Guide

| Level | Definition | Blocks merge? |
|-------|-----------|---------------|
| HIGH | Bugs, security flaws, data loss risk | Yes |
| MEDIUM | Performance, missing error handling | Yes |
| LOW | Style, naming, minor improvements | No |

Only flag actual issues — no false positives. Be specific with file paths and line numbers.
