---
name: jira-save-attachments
description: Download all attachments from a Jira issue to local disk. Use when user asks to save, download, fetch, or grab attachments/screenshots/files from a Jira issue (e.g. "download attachments for PN-845", "save files from JIRA-123", "get screenshots from this ticket"). Also used by the jira-fetcher agent during issue intake.
---

# Jira Save Attachments

Downloads every attachment from a Jira issue to
`.jira/{issue_key}/attachments/` using credentials already in `.mcp.json`.

No credentials pass through the agent context.

## When to use

- User names a Jira key and asks for attachments/screenshots/files
- `jira-fetcher` agent step 3 (automated issue intake)
- Any flow that needs issue attachments on local disk for inspection
  (images, logs, PDFs)

## How to run

One argument — the issue key:

```bash
node .claude/skills/jira-save-attachments/save-attachments.cjs PN-845
```

The script:
1. Reads `JIRA_URL` + `JIRA_PERSONAL_TOKEN` from `.mcp.json`
   (`mcpServers.mcp-atlassian.env`)
2. Calls `GET /rest/api/2/issue/{KEY}?fields=attachment`
3. Downloads each attachment to `.jira/{KEY}/attachments/{filename}`
4. Prints JSON result to stdout

## Output

```json
{
  "issue_key": "PN-845",
  "saved": [".jira/PN-845/attachments/image-....png"],
  "failed": [{"filename": "x.bin", "error": "HTTP 403"}]
}
```

- `saved`: paths written (empty array = no attachments on issue)
- `failed`: per-file errors; report these to user
- Exits non-zero if `.mcp.json` missing, auth fails, or issue fetch fails

## What to do with the result

- Record `saved` paths in any YAML/report for the issue
- If `failed` non-empty, surface the filenames + errors to user
- To view images inline, Read the saved file paths

## Prerequisites

- `.mcp.json` must define `mcpServers.mcp-atlassian.env.JIRA_URL` and
  `JIRA_PERSONAL_TOKEN`. If missing, script exits with a clear error —
  tell user to configure mcp-atlassian first.
- Node.js (any recent version with `http`/`https`/`url` built-ins).
