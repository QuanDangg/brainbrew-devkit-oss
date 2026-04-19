---
name: journaling
description: >-
  Write structured session notes, retrospectives, and lessons learned. Triggers on
  "write a retro", "document what happened", "journal this session", "lessons learned",
  "what went wrong". NOT for technical documentation — use documentation.
allowed-tools: Read, Write, Glob, Grep
---

## When to Use

- After a debugging session to capture what was learned
- Writing a retrospective on a completed feature or incident
- Documenting a production issue and its resolution
- Capturing lessons learned for the team
- Recording decision rationale for future reference

## When NOT to Use

- Writing code documentation or READMEs — use `documentation`
- Creating implementation plans — use `plan`
- Tracking project status — use `project-management`

## Instructions

### 1. Gather Context

Review the session or incident by checking:
- Recent git history: `git log --oneline -20`
- Changed files: `git diff --stat HEAD~5`
- Any error logs, test outputs, or debug reports from the session
- Plan files if working from a plan

### 2. Identify Key Events

Build a timeline of what happened:
- What was the initial goal or trigger?
- What approaches were tried?
- What worked and what did not?
- What was the root cause (if debugging)?
- What was the final resolution?

### 3. Extract Lessons

For each significant event, note:
- What was surprising or unexpected?
- What would be done differently next time?
- What patterns or anti-patterns were discovered?
- What tools or techniques proved useful?

### 4. Write the Journal Entry

Save to `docs/journal/` or `docs/retros/` (create the directory if needed). Use the filename format `YYYY-MM-DD-topic.md`.

## Output

```
## [Retro/Journal]: [Topic]
**Date:** YYYY-MM-DD
**Duration:** [time spent]
**Participants:** [who was involved]

### Context
[What was being worked on and why]

### Timeline
1. [Event 1 — what happened]
2. [Event 2 — what was tried]
3. [Event 3 — resolution]

### What Went Well
- [Positive outcome or practice]

### What Went Wrong
- [Problem encountered and impact]

### Lessons Learned
- [Actionable insight for future work]

### Action Items
- [ ] [Specific follow-up task]
```

Keep entries concise and actionable. Focus on insights that help future work, not just a log of events.
