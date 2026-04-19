---
name: copywriting
description: >-
  Write user-facing copy including UI text, error messages, notifications, and help content.
  Triggers on "write the copy for", "improve this error message", "write UI text",
  "help text for this feature". NOT for technical documentation — use documentation.
allowed-tools: Read, Edit, Write, Grep, Glob
---

## When to Use

- Writing button labels, form labels, placeholder text
- Crafting error messages, validation messages, toast notifications
- Writing onboarding flows, tooltips, or help text
- Creating empty states, loading states, confirmation dialogs
- Improving existing user-facing text for clarity

## When NOT to Use

- Writing technical docs, READMEs, or API docs — use `documentation`
- Writing code comments or docstrings — use `documentation`
- Designing UI layouts — use `ui-design`

## Instructions

### 1. Understand the Context

Read the component or feature code to understand:
- What the user is doing when they see this text
- What action the text should encourage or explain
- What the user's emotional state likely is (frustrated, exploring, completing a task)

### 2. Check Existing Tone

Use Grep to find existing user-facing strings in the codebase. Match the established tone:
- Formal vs. casual
- Technical vs. plain language
- Brand voice patterns (if `docs/style-guide.md` or similar exists)

### 3. Write Copy Following These Principles

**Clarity over cleverness:**
- Use plain language. Avoid jargon unless the audience is technical.
- Front-load the important information.
- Keep sentences short (under 20 words for UI text).

**Error messages must be helpful:**
- Say what happened (not just "Error")
- Say why it happened (if knowable)
- Say what to do next
- Example: "Could not save changes. The file was modified by another user. Reload the page to see their changes."

**Be consistent:**
- Use the same term for the same concept everywhere
- Match existing capitalization patterns (Title Case vs. sentence case)
- Keep action verbs consistent ("Save" vs. "Submit" — pick one pattern)

**Respect the user:**
- Never blame the user ("You entered an invalid email" -> "Enter a valid email address")
- Avoid unnecessary words ("Please" in every message, "Successfully" for every confirmation)
- Use active voice

### 4. Verify Integration

Check that the copy fits within the UI constraints (character limits, button widths). Confirm translations are not needed or flag if i18n is required.

## Output

- Updated files with new copy
- List of text changes with before/after comparison
- Notes on tone decisions or i18n considerations
