---
name: debugging
description: >-
  Quick diagnosis and fix for straightforward bugs and errors. Triggers on "fix this bug",
  "why is this broken", "this error keeps happening", "quick fix". NOT for complex
  multi-layer issues — use systematic-debugging instead.
allowed-tools: Read, Grep, Glob, Bash, Edit
---

## When to Use

- A single error message or stack trace needs diagnosis
- A test is failing with a clear error
- A quick bug fix is needed (off-by-one, typo, wrong import)
- Build or lint errors need resolution

## When NOT to Use

- Complex bugs spanning multiple systems or layers — use `systematic-debugging`
- Performance profiling or optimization — use `systematic-debugging`
- Intermittent failures that need deep investigation — use `systematic-debugging`
- Writing new features — use `implementation`

## Instructions

### 1. Collect Symptoms

Read the error message, stack trace, or failure description. Identify:
- The exact error text
- The file and line number (if available)
- What action triggered the error

### 2. Locate the Source

Use Grep to search for the error message in the codebase. Use Read to examine the file at the reported line. Check recent changes with `git diff` or `git log --oneline -5` if the bug is a regression.

### 3. Form a Hypothesis

Based on the error and surrounding code, identify the most likely cause:
- Wrong variable name or type
- Missing null/undefined check
- Incorrect import or path
- Logic error (wrong operator, off-by-one)
- Missing dependency or configuration

### 4. Verify the Hypothesis

Read related code to confirm the hypothesis. Check:
- Does the function signature match the call site?
- Are all required fields present?
- Is the data flow correct from input to output?

### 5. Apply the Fix

Make the minimal change that fixes the root cause. Use Edit to modify the file. Do NOT refactor surrounding code — fix only the bug.

### 6. Verify the Fix

Run the failing test or command again to confirm the fix works. Check that no new errors were introduced.

## Output

```
## Debug Report

**Issue:** [error description]
**Root Cause:** [what went wrong and why]
**Fix:** [what was changed, in which file]
**Verification:** [command run and result]
```
