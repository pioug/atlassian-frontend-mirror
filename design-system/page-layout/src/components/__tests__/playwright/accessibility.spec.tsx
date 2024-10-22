import { expect, test } from '@af/integration-testing';

const resizeControl = "[data-resize-button='true']";

test('Basic usage page layout should have expanded sidebar', async ({ page }) => {
	await page.visitExample('design-system', 'page-layout', 'integration-example');
	await expect(page.locator(resizeControl).first()).toHaveAttribute('aria-expanded', 'true');
});
