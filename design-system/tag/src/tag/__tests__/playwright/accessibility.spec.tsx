import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/0-basic-tag.tsx')>(
		'design-system',
		'tag',
		'basic-tag',
	);
	await expect(page.getByTestId('standard').first()).toBeVisible();
});
