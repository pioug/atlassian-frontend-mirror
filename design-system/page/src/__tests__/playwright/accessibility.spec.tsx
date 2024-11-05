import { expect, test } from '@af/integration-testing';

test('should set aria-hidden to false when page banner is visible', async ({ page }) => {
	// This test should remain to test color contrast a11y violations.
	await page.visitExample('design-system', 'page', 'basic-usage');
	await expect(page.locator('[data-testid="page--banner-container"]')).toHaveAttribute(
		'aria-hidden',
		'false',
	);
});
