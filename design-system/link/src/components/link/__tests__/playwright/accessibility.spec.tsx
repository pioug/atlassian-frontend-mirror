import { expect, test } from '@af/integration-testing';

test('Link passes aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'link', 'default');
	const link = page.getByTestId('link');
	await link.focus();
	await expect(link).toBeVisible();
});
