import { expect, test } from '@af/integration-testing';

test('Spinner should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
		'design-system',
		'spinner',
		'testing',
	);
	await expect(page.locator('[data-testid="my-spinner"]').first()).toBeVisible();
});
