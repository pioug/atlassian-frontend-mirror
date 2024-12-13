import { expect, test } from '@af/integration-testing';

test('Menu should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'menu', 'skeleton-items');
	const toggleLoading = page.getByTestId('toggle-loading');
	const elementWhileLoading = page.locator('span:has-text("John Smith")').first();

	await expect(elementWhileLoading).toHaveCount(0);

	await toggleLoading.click();

	await expect(elementWhileLoading).toBeVisible();
});
