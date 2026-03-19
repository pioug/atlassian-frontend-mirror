import { expect, test } from '@af/integration-testing';

test('Grid, grid-cards should pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/01-grid-cards.tsx')>('design-system', 'grid', 'grid-cards');

	await expect(page.locator('[data-testid="grid-item-0"]')).toBeVisible();
});

test('Grid, grid-container should pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/96-grid-container.tsx')>('design-system', 'grid', 'grid-container');

	await expect(page.locator('[data-testid="grid-item"]')).toBeVisible();
});
