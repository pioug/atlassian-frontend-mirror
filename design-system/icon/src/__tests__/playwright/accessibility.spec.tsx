import { expect, test } from '@af/integration-testing';

test('Icon should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'icon', 'size-example');
	const icon = page.getByTestId('icon-1');
	await expect(icon).toBeVisible();
});
