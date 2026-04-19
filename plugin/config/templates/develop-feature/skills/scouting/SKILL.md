---
name: scouting
description: >-
  Explore codebase structure, discover files, map patterns, and understand architecture.
  Triggers on "explore the codebase", "find where X is", "map the project structure",
  "what files are related to", "how is this organized". NOT for external research — use research.
allowed-tools: Read, Grep, Glob, Bash
---

## When to Use

- Understanding a new or unfamiliar codebase
- Finding files related to a feature or component
- Mapping dependencies between modules
- Identifying code patterns and conventions before implementing
- Locating entry points, config files, or infrastructure

## When NOT to Use

- Researching external libraries or frameworks — use `research`
- Writing or modifying code — use `implementation`
- Reviewing code quality — use `code-review`

## Instructions

### 1. Map Top-Level Structure

Run `ls` on the project root to understand the directory layout. Use Glob with patterns like `**/README.md`, `**/package.json`, `**/go.mod` to identify project boundaries and sub-packages.

### 2. Identify Key Files

Search for entry points and configuration:
- Entry points: `main.go`, `index.ts`, `app.py`, `main.rs`
- Config: `tsconfig.json`, `webpack.config.*`, `.env.example`, `Makefile`
- CI/CD: `.github/workflows/*.yml`, `Dockerfile`, `docker-compose.yml`
- Docs: `README.md`, `CONTRIBUTING.md`, `docs/`

### 3. Discover Patterns

Use Grep to identify recurring patterns:
- Import style: `import { X } from` vs `require()` vs `from X import`
- Error handling: `try/catch`, `if err != nil`, `Result<T, E>`
- Naming conventions: `camelCase`, `snake_case`, `PascalCase`
- File organization: feature-based, layer-based, or hybrid

### 4. Trace Dependencies

For a specific feature or component:
- Use Grep to find all imports/references to the target module
- Use Read to examine the module's exports and interfaces
- Map the dependency chain: who calls this, and what does it call?

### 5. Document Findings

## Output

```
## Scout Report: [scope]

### Project Structure
[Directory tree or organized file listing]

### Key Files
| File | Purpose |
|------|---------|
| path/to/file | Brief description |

### Patterns Found
- **Naming:** [convention used]
- **Imports:** [style used]
- **Error handling:** [pattern used]
- **Testing:** [framework and file placement]

### Architecture Notes
[How components connect, data flow, key abstractions]

### Relevant Files for [task]
[Ordered list of files most relevant to the current task]
```

Keep output concise — paths and brief context only. Do NOT modify any files.
