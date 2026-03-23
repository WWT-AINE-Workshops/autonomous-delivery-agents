import { expect, test } from '@playwright/test';

test('the board loads all 12 tasks in three columns', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('task-card')).toHaveCount(12);
  await expect(page.getByTestId('column-todo').getByTestId('task-card')).toHaveCount(6);
  await expect(page.getByTestId('column-doing').getByTestId('task-card')).toHaveCount(3);
  await expect(page.getByTestId('column-done').getByTestId('task-card')).toHaveCount(3);
});

test('filtering by assignee narrows the board', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Assignee').selectOption({ label: 'Unassigned' });
  await expect(page.getByTestId('task-card')).toHaveCount(2);
  await page.getByLabel('Assignee').selectOption({ label: 'Everyone' });
  await expect(page.getByTestId('task-card')).toHaveCount(12);
});

// Each run starts from its own freshly reset database (see playwright.config.ts), so nothing is
// restored here.
test('moving a task persists after a reload', async ({ page }) => {
  const title = 'Replace the placeholder logo';
  await page.goto('/');
  await page.getByRole('button', { name: `Move ${title} to Doing` }).click();
  const doing = page.getByTestId('column-doing');
  await expect(doing.getByText(title)).toBeVisible();

  await page.reload();
  await expect(page.getByTestId('column-doing').getByText(title)).toBeVisible();
  await expect(page.getByTestId('column-todo').getByText(title)).toHaveCount(0);
});
