import { expect, test } from '@af/integration-testing';

test('Skeleton, default should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'skeleton', 'all');

	await expect(page.locator('[data-testid="skeleton-default"]')).toBeVisible();
});

test('Skeleton, skeleton-border should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'skeleton', 'all');

	await expect(page.locator('[data-testid="skeleton-border"]')).toBeVisible();
});
