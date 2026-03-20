import { expect, test } from '@af/integration-testing';

test('Icon should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/107-new-icons-size.tsx')>(
		'design-system',
		'icon',
		'new-icons-size',
	);
	const icon = page.getByTestId('icon-1');
	await expect(icon).toBeVisible();
});
