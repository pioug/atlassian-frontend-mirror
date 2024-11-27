import { expect, test } from '@af/integration-testing';

test('Grid, grid-cards should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'grid', 'grid-cards');

	await expect(page.locator('[data-testid="grid-item-0"]')).toBeVisible();
});

test('Grid, grid-container should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'grid', 'grid-container');

	await expect(page.locator('[data-testid="grid-item"]')).toBeVisible();
});
