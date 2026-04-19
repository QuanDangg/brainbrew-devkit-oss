---
name: research
description: >-
  Research technical topics, compare solutions, and produce structured reports. Triggers on
  "research this", "compare options for", "what's the best approach for", "evaluate frameworks",
  "find best practices". NOT for codebase exploration — use scouting.
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
---

## When to Use

- Evaluating frameworks, libraries, or tools
- Investigating best practices for a technical approach
- Comparing multiple solutions with trade-offs
- Answering "how do others solve X?" questions
- Gathering context before planning

## When NOT to Use

- Exploring the local codebase structure — use `scouting`
- Creating an implementation plan — use `plan`
- Writing code — use `implementation`

## Instructions

### 1. Define Scope

Clarify the research question. Break broad questions into specific sub-questions. Identify:
- Decision criteria (performance, ease of use, community support, cost)
- Constraints (language, framework, budget, timeline)
- What "done" looks like for this research

### 2. Gather from Local Sources

Use Read to check existing project docs (`README.md`, `docs/`, `ARCHITECTURE.md`). Use Grep to find how the project currently handles related concerns. Check `package.json`, `go.mod`, `requirements.txt` for existing dependencies.

### 3. Search External Sources

Use WebSearch to find:
- Official documentation for candidate solutions
- Comparison articles and benchmarks
- GitHub repository stats (stars, recent commits, open issues)
- Stack Overflow discussions on common pitfalls

Use WebFetch to read specific pages for deeper detail. Prioritize official docs and recent sources (within last 2 years).

### 4. Evaluate Options

Score each option against the defined criteria. Note:
- Maturity and stability (version number, release frequency)
- Community size and activity
- Integration effort with existing stack
- Long-term maintenance burden
- License compatibility

### 5. Synthesize Findings

## Output

```
## Research: [topic]

### Question
[Specific research question]

### Options Evaluated

#### Option 1: [Name]
- **Pros:** [list]
- **Cons:** [list]
- **Fit:** [how well it matches criteria]

#### Option 2: [Name]
- **Pros:** [list]
- **Cons:** [list]
- **Fit:** [how well it matches criteria]

### Recommendation
[Recommended option with rationale, tied to criteria]

### Risks
[Known risks or unknowns with the recommendation]

### Sources
[Links to key references used]
```

Apply YAGNI, KISS, DRY to all recommendations. Prefer stable, proven solutions over cutting-edge experiments unless the project specifically requires them.
