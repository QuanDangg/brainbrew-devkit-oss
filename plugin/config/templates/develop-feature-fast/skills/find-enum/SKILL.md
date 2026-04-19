---
name: find-enum
description: >-
  Resolve enum/dropdown values for plan fields by querying the live database
  for distinct values, then searching the codebase for existing matching
  definitions. Use during planning when a field needs enum options and the
  source is unclear. Pass `all` to automatically resolve every enum field in
  the current plan. Requires mcp_server_mysql to be connected.
argument-hint: "<table.column> [table.column ...] or 'all' to resolve all filterable fields in the current plan"
allowed-tools: Read, Grep, Glob, mcp__mcp_server_mysql__mysql_query
---

# Find Enum

Resolve enum and dropdown option values for filterable fields by combining live
DB data with codebase search — no guessing, no placeholders.

## When to Use

- During planning, when a field needs dropdown options and you are unsure what
  values exist or where the enum is defined
- When the codebase has many enum files and it is hard to find the right one
- Before writing `OPTIONS` arrays or constant maps — always check DB first

## When NOT to Use

- When the requirement document explicitly defines the enum values — use those
  directly without querying the DB
- When no MCP MySQL connection is available — report the missing tool and stop;
  do not guess or proceed with placeholder values
- When implementing or writing code — this skill only produces a resolution
  table; hand the output to the implementer

## Workflow

### Step 1 — Identify fields to resolve

Fields requested: $ARGUMENTS

Parse the value above into a list of `table.column` pairs. Examples:
- `calloff_radio.technology`
- `nims_radio_proposal_information.proposal_type`
- `calloff_mechatronic.vendor_code`

If the argument is `all`, read the most recently modified `plan.md` under
`plans/` (i.e., glob `plans/*/plan.md`, sort by modification time, take the
latest) and collect every `table.column` pair referenced in enum or filter
context, then proceed as normal with the full list.

### Step 2 — Query DB for distinct values

For each `table.column`, run:

```sql
SELECT DISTINCT `<column>` FROM `<table>`
WHERE `<column>` IS NOT NULL AND `<column>` != ''
ORDER BY `<column>`
LIMIT 100;
```

Use `mcp__mcp_server_mysql__mysql_query` for each query.

Collect the raw values. These are the ground truth — what is actually stored
in the database right now.

### Step 3 — Search codebase for matching enum definitions

First, check CLAUDE.md to determine the actual backend and frontend directory
names for this project (they may not be `backend/` and `frontend/`). Use those
names as the root for all paths below.

Take the distinct values and search for them in the codebase:

**Backend — search in order** (replace `<backend>/` with actual dir name):
1. `<backend>/src/common/enums/` — canonical cross-domain enums
2. `<backend>/src/modules/*/enum/` — module-specific enums
3. `<backend>/src/modules/*/helper/` — format helpers that map codes to labels
4. `<backend>/src/database/entities/mariadb/` — TypeORM entities (sometimes contain inline enums)

**Frontend — search in order** (replace `<frontend>/` with actual dir name):
1. `<frontend>/src/utils/constants.js` — shared constant maps
2. `<frontend>/src/views/*/enum/` — view-local enum files
3. `<frontend>/src/views/*/helper/format.js` — format helpers with value→label maps

Search strategy: grep for the raw DB values as string literals. If `"4G"`,
`"5G"`, `"2G"` are the DB values, search for `'4G'` or `"4G"` across the
relevant directories. A file that contains multiple values from the same
column is almost certainly the right enum.

### Step 4 — Report findings per field

For each field, report one of three outcomes:

**A — Enum found in codebase:**
```
✅ calloff_radio.technology
   DB values: 4G, 5G, 2G, 3G
   Existing enum: frontend/src/utils/constants.js → TECHNOLOGY_OPTIONS
   Use this directly — do not create a new constant.
```

**B — Partial match (DB has values not in the enum, or enum has extra values):**
```
⚠️  nims_radio_proposal_information.proposal_type
   DB values: XM, CS, DD, DI
   Partial match: backend/src/common/enums/voffice.enum.ts → proposalTypeMap
     covers: XM, CS — missing: DD, DI
   Action: extend existing enum with missing values DD and DI.
```

**C — No match found:**
```
❌ calloff_mechatronic.vendor_code
   DB values: HW, ZTE, NSN, ERI, VT, ALU
   No existing enum found in codebase.
   Action: create new constant with these exact values:
     HW, ZTE, NSN, ERI, VT, ALU
```

### Step 5 — Output a resolution table

Produce a concise table for use in the plan:

```
| Field                          | DB Values (sample)     | Resolution                                      |
|-------------------------------|------------------------|-------------------------------------------------|
| calloff_radio.technology       | 4G, 5G, 2G, 3G         | ✅ Use TECHNOLOGY_OPTIONS in constants.js        |
| proposal_type                  | XM, CS, DD, DI         | ⚠️  Extend proposalTypeMap — add DD, DI          |
| vendor_code                    | HW, ZTE, NSN, ERI, VT | ❌ Create new VENDOR_OPTIONS with these values   |
```

## Rules

- **Never invent values.** Only use what the DB query returns.
- **Never create a new constant if an existing one already covers the values.** Reuse first.
- **If DB returns 0 rows** for a column, note it: the table may be empty (no sync run yet) or the column may have a different name. Try a `SHOW COLUMNS FROM <table>` to confirm the column exists.
- **If DB query fails**, report the error and the table/column — do not guess.
- **If grep returns no hits** across all search directories for a field, classify it directly as outcome C (no match) — do not expand the search beyond the listed directories without user instruction.
- This skill does not write any code. It produces a resolution table for the planner to act on.
