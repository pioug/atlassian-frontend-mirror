import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit on', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/0-basic.tsx')>(
		'design-system',
		'lozenge',
		'basic',
	);

	const subtleLozenge = page.locator("[data-testid='lozenge-subtle']").first();

	await expect(subtleLozenge).toBeVisible();
});
