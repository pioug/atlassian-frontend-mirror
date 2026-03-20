import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/00-basic-example-uncontrolled.tsx')>(
		'design-system',
		'range',
		'basic-example-uncontrolled',
	);
	await expect(page.getByTestId('range-uncontrolled').first()).toBeVisible();
});
