import { expect, test } from '@af/integration-testing';
test('table should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/expandable.tsx')>(
		'design-system',
		'table',
		'expandable',
	);
	await expect(page.getByTestId('expandable-table')).toBeVisible();
});
