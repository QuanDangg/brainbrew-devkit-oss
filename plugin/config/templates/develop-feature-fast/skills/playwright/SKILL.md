---
name: playwright
description: >-
  Write and run Playwright E2E browser tests for a feature. Tests drive the real UI
  (login, click, fill forms, verify notifications) instead of calling APIs directly.
  Triggers on "test this feature", "run e2e test", "playwright test", "browser test",
  "test from frontend", "/playwright". Pass a plan path or feature name as argument.
  NOT for unit tests — use testing. NOT for API-only tests — this tests through the browser.
argument-hint: "[plan-path-or-feature-name]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

## When to Use

- After implementing a new feature, to verify it works end-to-end through the browser
- When asked to "test like from frontend" or "run e2e tests"
- To verify CRUD operations work through the UI (create, read, edit, copy, delete)
- Before shipping a feature to verify the full stack works together

## When NOT to Use

- Running existing unit/integration tests — use `testing`
- Testing API endpoints directly without UI — use `testing`
- Debugging a failing test — use `debugging`
- Writing test plans without running them — use `plan`

## Instructions

### 1. Understand What to Test

If a plan path is given, read it to understand:
- What routes/pages the feature has
- What forms and dialogs exist
- What CRUD operations are supported
- What API endpoints are called
- What the Vietnamese labels are (the app uses Vietnamese)

If no plan given, explore the frontend views:
```
frontend/src/views/<feature>/
frontend/src/api/<feature>/
```

### 2. Ensure Servers Are Running

Check that both backend (port 8000) and frontend (port 9527) are running:

```bash
# Check
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/1.0/
curl -s -o /dev/null -w "%{http_code}" http://localhost:9527

# Start if needed (from project root)
cd backend && npm run start:dev > /tmp/backend.log 2>&1 &
cd frontend && npm run dev > /tmp/frontend.log 2>&1 &
# Wait ~15s then verify
```

### 3. Ensure Auth Setup Exists

Check `playwright/.playwrights/tests/auth.setup.ts` exists. Create if missing — see playwright agent docs.

### 4. Write the Test File

Create `playwright/.playwrights/tests/<feature>.spec.ts`.

**Template structure:**

```typescript
import { test, expect, type Page } from '@playwright/test';

const TIMESTAMP = Date.now();
// Unique names to avoid collisions
const ITEM_NAME = `Test Item ${TIMESTAMP}`;

/** Navigate and wait for list API */
async function gotoAndWaitForList(page: Page) {
  const responsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes('/<feature>') &&
      resp.request().method() === 'GET' &&
      !resp.url().includes('/filter'),
    { timeout: 15_000 },
  );
  await page.goto('/<feature>');
  await responsePromise;
  await page.waitForLoadState('networkidle');
}

/** Get the add/edit form dialog */
function getFormDialog(page: Page) {
  return page.locator('.el-dialog.global-dialog')
    .filter({ has: page.locator('.el-form') }).first();
}

test.describe.serial('<Feature> CRUD', () => {
  test('navigate to page', async ({ page }) => {
    await page.goto('/<feature>');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('Expected Title');
  });

  test('create item', async ({ page }) => {
    // Navigate, click add, fill form, save, verify response
  });

  test('verify in list', async ({ page }) => {
    await gotoAndWaitForList(page);
    await expect(page.locator('.el-table__body-wrapper')).toContainText(ITEM_NAME);
  });

  test('view detail', async ({ page }) => {
    // Navigate, click eye icon, verify dialog content
  });

  test('edit item', async ({ page }) => {
    // Navigate, click edit icon, change fields, save
  });

  test('delete item', async ({ page }) => {
    // Navigate, click delete icon, confirm, verify
  });

  test('verify no backend errors', async ({ page }) => {
    await gotoAndWaitForList(page);
    await expect(page.locator('.el-table__body-wrapper')).toBeVisible();
    await expect(page.locator('.el-notification--error')).toHaveCount(0);
  });
});
```

**Key Element UI patterns for this codebase:**

| Action | Selector |
|--------|----------|
| Form dialog | `.el-dialog.global-dialog` with `.el-form` inside |
| Form field by label | `.el-form-item` filter `hasText` + `input` |
| Select dropdown | `.el-select .el-input` first, then `.el-select-dropdown__item:visible` |
| Exact option match | `filter({ hasText: /^Exact$/ })` |
| Save button | `.dialog-footer button` filter `hasText: /Lưu|Save/` |
| Table row | `.el-table__body tr` filter `hasText` |
| Row action buttons | `.el-button` nth (0=eye, 1=edit, 2=copy, 3=delete) |
| Delete confirm | `.app-btn--danger` filter `hasText: /Xoá/` |
| Success notification | `.el-notification` containText `/thành công|Success/` |
| Detail dialog | `.modal-detail-<feature>` (check custom-class) |

**Critical timing rules:**
- Set up `waitForResponse` BEFORE the action that triggers it
- `waitForTimeout(500)` after dialog-opening clicks
- `waitForTimeout(1000)` after blur on name-check fields
- Use `gotoAndWaitForList()` pattern — set up promise before `goto()`

### 5. Run the Tests

```bash
cd playwright && npx playwright test --reporter=list
```

### 6. Iterate on Failures

1. Check screenshot: `playwright/.playwrights/results/*/test-failed-1.png`
2. Check error context: `playwright/.playwrights/results/*/error-context.md`
3. Common fixes:
   - **Strict mode**: selector matches multiple elements — add `.first()` or more specific filter
   - **Timeout**: response promise set up too late — move before the triggering action
   - **Not visible**: dialog uses `display: none` wrapper — use content-based filter not `:visible`
   - **Wrong text**: app uses Vietnamese — check actual labels with screenshot
4. Fix and re-run until all green

### 7. Verify Backend

After all tests pass, check backend logs:

```bash
grep -i "error\|exception" /tmp/backend.log | grep -v "WARN\|Redis\|i18n\|EADDRINUSE\|Unauthorized" | tail -10
```

### 8. Report Results

Report with raw test output and backend log check. Include screenshot paths for any failures.

## Output Format

```
## Playwright E2E Report

**Verdict:** PASS | FAIL

### Tests: N passed, M failed (Xs)

<raw npx playwright test --reporter=list output>

### Backend: CLEAN | ERRORS
<backend log check results>
```
