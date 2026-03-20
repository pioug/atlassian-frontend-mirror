import { expect, test } from '@af/integration-testing';

const resizeControl = "[data-resize-button='true']";

test('Basic usage page layout should have expanded sidebar', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/03-integration-example.tsx')>(
		'design-system',
		'page-layout',
		'integration-example',
	);
	await expect(page.locator(resizeControl).first()).toHaveAttribute('aria-expanded', 'true');
});
