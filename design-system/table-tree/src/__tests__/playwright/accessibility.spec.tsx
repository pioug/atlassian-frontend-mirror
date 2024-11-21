import { expect, test } from '@af/integration-testing';

test('table tree should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'table-tree', 'loading-nested');
	await expect(page.getByTestId('table-tree-spinner').first()).toBeVisible();
	await expect(page.getByTestId('table-tree-spinner').first()).toHaveAccessibleName('loading data');
});
