import { expect, test } from '@af/integration-testing';

test('Spotlight should have autofocus on first interactive element', async ({ page }) => {
	await page.visitExample('design-system', 'onboarding', 'spotlight-with-conditional-targets');

	await page.locator('#Start').first().click();
	await expect(page.locator('[data-testid="spotlight1--dialog"]')).toBeVisible();
	await expect(page.locator('button:has-text("Tell me more")')).toBeFocused();
});
