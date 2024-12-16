import { expect, test } from '@af/integration-testing';
test('table should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'table', 'expandable');
	await expect(page.getByTestId('expandable-table')).toBeVisible();
});
