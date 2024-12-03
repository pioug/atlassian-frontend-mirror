import { expect, test } from '@af/integration-testing';
test('toggle should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'toggle', 'stateful');
	await expect(page.getByLabel('Regular')).toBeVisible();
	await expect(page.getByLabel('Large')).toBeVisible();
});

test('disabled toggle should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'toggle', 'disabled');
	await expect(page.locator('#regular')).toBeVisible();
	await expect(page.locator('#large')).toBeVisible();
});
