import { expect, test } from '@af/integration-testing';

test('Logo should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/0-basic.tsx')>(
		'design-system',
		'logo',
		'basic',
	);
	const logo = page.getByTestId('atlassian-logo--wrapper');
	await expect(logo.first()).toHaveAttribute('role', 'img');
	await expect(logo).toBeVisible();
});
