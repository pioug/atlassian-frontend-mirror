import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/02-basic-avatar-group.tsx')>(
		'design-system',
		'avatar-group',
		'basic-avatar-group',
	);
	await expect(page.getByTestId('stack--avatar-group').first()).toBeVisible();
});
