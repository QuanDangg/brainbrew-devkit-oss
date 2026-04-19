---
name: doc-orchestration
description: >-
  Coordinate multi-file documentation updates across a codebase. Triggers on "update all docs",
  "sync docs with code", "documentation sweep", "audit documentation", "docs are out of date".
  NOT for single-file doc updates — use documentation.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

## When to Use

- Documentation is out of sync with code after major changes
- A documentation audit or sweep is needed across the project
- Multiple doc files need coordinated updates (API docs, README, guides)
- Establishing documentation standards across a codebase
- Generating docs from code changes in bulk

## When NOT to Use

- Updating a single file's docs — use `documentation`
- Writing user-facing UI copy — use `copywriting`
- Creating a plan — use `plan`

## Instructions

### 1. Scan for Documentation Gaps

Use Glob to find all documentation files:
- `**/*.md` in `docs/`, project root
- Inline docs: use Grep for functions/classes missing doc comments

Compare against code changes:
- Run `git diff --name-only HEAD~10` to find recently changed source files
- Check if corresponding docs exist and are current
- Flag undocumented public APIs, exported functions, or new modules

### 2. Prioritize Updates

Rank documentation gaps by impact:
1. **Critical:** Public API docs that are wrong or missing
2. **High:** README sections that reference removed/changed features
3. **Medium:** Internal docs that are stale but not misleading
4. **Low:** Style or formatting inconsistencies

### 3. Execute Updates

Work through updates in priority order:
- Read the current code to understand actual behavior
- Update each doc file to match the code
- Ensure cross-references between docs are valid (links, file paths)
- Update table of contents or index files if they exist

### 4. Verify Consistency

After all updates:
- Use Grep to check that renamed functions/classes are updated everywhere in docs
- Verify all doc links point to existing files
- Confirm code examples in docs match current API signatures
- Check for orphaned docs (docs for deleted features)

### 5. Report Changes

## Output

```
## Documentation Orchestration Report

### Files Updated
| File | Change | Reason |
|------|--------|--------|
| docs/api.md | Updated endpoints | New routes added in v2 |
| README.md | Updated install steps | Dependency changed |

### Gaps Remaining
- [Doc that still needs manual review with reason]

### Cross-Reference Check
- All internal links: VALID | [broken links listed]
- Code examples: CURRENT | [stale examples listed]

### Standards Applied
- [Any formatting or style standards enforced]
```

Do NOT change source code — only documentation files. Read code to verify accuracy but do not modify it.
