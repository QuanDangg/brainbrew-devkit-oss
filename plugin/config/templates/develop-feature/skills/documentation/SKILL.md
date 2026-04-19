---
name: documentation
description: >-
  Generate and update technical documentation for code, APIs, and projects. Triggers on
  "document this", "add docs", "write a README", "add JSDoc", "generate API docs".
  NOT for multi-file doc coordination — use doc-orchestration.
allowed-tools: Read, Write, Edit, Grep, Glob
---

## When to Use

- Adding inline documentation (JSDoc, docstrings, GoDoc comments)
- Writing or updating a README
- Documenting an API endpoint or function signature
- Adding architecture or design documentation

## When NOT to Use

- Coordinating docs across many files at once — use `doc-orchestration`
- Writing user-facing copy or UI text — use `copywriting`
- Creating an implementation plan — use `plan`

## Instructions

### 1. Detect What Needs Documentation

Read the target code or file. Determine the appropriate doc format:

| Language | Format | Example |
|----------|--------|---------|
| TypeScript/JavaScript | JSDoc | `/** @param {string} name */` |
| Python | Docstrings | `"""Description.\n\nArgs:\n    name: ..."""` |
| Go | GoDoc | `// FunctionName does X.` |
| Rust | Rustdoc | `/// Description` |
| General | Markdown | `README.md`, `docs/*.md` |

### 2. Read Existing Documentation Style

Use Grep to find existing doc comments in the project. Match the format, level of detail, and tone already established. Check for a style guide in `docs/` or `CONTRIBUTING.md`.

### 3. Write Documentation

Follow these principles:
- Lead with **what** and **why**, not how
- Keep descriptions concise — one sentence for simple items
- Document parameters, return values, and thrown errors
- Include a usage example for public APIs
- Note any side effects or important constraints

For README files:
- Start with project name and one-line description
- Include: installation, quick start, usage, configuration
- Add badges, links to full docs if applicable

### 4. Verify Accuracy

Re-read the code to confirm the documentation matches actual behavior. Check that:
- Parameter names and types are correct
- Return types match the implementation
- Examples compile/run if they are code blocks

## Output

- List of files updated with documentation
- Summary of what was documented
- Any items that need manual review (ambiguous behavior, missing context)
