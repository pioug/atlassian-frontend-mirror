import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/00-basic-example.tsx')>(
		'design-system',
		'section-message',
		'basic-example',
	);
	await expect(page.getByTestId('section-message').first()).toBeVisible();
});
