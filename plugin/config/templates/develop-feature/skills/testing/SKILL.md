---
name: testing
description: >-
  Run tests, verify builds, and report results with evidence. Triggers on "run tests",
  "check if tests pass", "verify the build", "test this". NOT for writing new test
  files — use implementation. NOT for debugging failures — use debugging.
allowed-tools: Read, Grep, Glob, Bash
---

## When to Use

- After code changes, to verify nothing is broken
- When asked to run the test suite or specific tests
- To check build status before committing
- To verify a fix resolved a test failure

## When NOT to Use

- Writing new test files from scratch — use `implementation`
- Debugging why a test fails — use `debugging`
- Reviewing code quality — use `code-review`

## Instructions

### 1. Detect Test Framework

Check the project root for framework indicators:

| Indicator | Framework | Build Command | Test Command |
|-----------|-----------|---------------|-------------|
| `go.mod` | Go | `go build ./...` | `go test ./... -count=1 -v` |
| `pytest.ini` or `pyproject.toml` | pytest | — | `python -m pytest -v` |
| `package.json` with `"test"` script | Node | `npm run build` (if exists) | `npm test` |
| `Cargo.toml` | Rust | `cargo build` | `cargo test` |
| `Makefile` with `test` target | Make | `make build` (if exists) | `make test` |
| `pom.xml` | Maven | `mvn compile` | `mvn test` |

### 2. Build First

Run the build/compile command before tests. If the build fails, stop immediately and report FAIL with the build output.

### 3. Run Tests

Run the full test suite with verbose output. Capture the complete terminal output.

For targeted testing (when only specific files changed):
- Go: `go test ./path/to/package/... -count=1 -v`
- pytest: `python -m pytest path/to/test_file.py -v`
- Node: `npx jest --testPathPattern=path/to/test`

### 4. Parse Results

Count: total tests, passed, failed, skipped. Extract failure details including test name, file, line number, and error message.

### 5. Report

## Output

```
## Test Report

**Verdict:** PASS | FAIL

### Build
- Command: `<command>` — Result: OK | FAILED

### Tests
- Command: `<command>` — Total: N | Passed: N | Failed: N | Skipped: N

### Raw Output
<actual terminal output — REQUIRED>

### Failures (if any)
1. **TestName** — file:line — error message
```

### Verdict Rules

| Result | Meaning |
|--------|---------|
| PASS | All tests pass, build succeeds |
| FAIL | Any test fails or build fails |

Do NOT fix code — only report results. Do NOT claim tests pass without running them. Always include raw terminal output as evidence.
