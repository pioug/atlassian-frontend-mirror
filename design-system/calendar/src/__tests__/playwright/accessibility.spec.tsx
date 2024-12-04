import { expect, test } from '@af/integration-testing';

test('Calendar component should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'calendar', 'testing');
	await expect(page.locator('[data-testid="the-calendar--calendar"]')).toBeVisible();
});
