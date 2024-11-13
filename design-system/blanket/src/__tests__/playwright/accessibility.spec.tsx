import { expect, test } from '@af/integration-testing';

test('blanket children scrollable region must have keyboard access', async ({ page }) => {
	// This test should remain to test color contrast a11y violations.
	await page.visitExample('design-system', 'blanket', 'blanket-with-children');
	await page.locator('[data-testid="show-button"]').click();
	await page.keyboard.press('Tab');
	await expect(page.locator('[data-testid="close-button"]')).toBeFocused();
	await expect(page.locator('[data-testid="blanket-with-children"]')).toHaveAttribute(
		'role',
		'presentation',
	);
});
