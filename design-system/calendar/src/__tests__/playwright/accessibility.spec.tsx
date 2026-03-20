import { expect, test } from '@af/integration-testing';

test('Calendar component should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
		'design-system',
		'calendar',
		'testing',
	);
	await expect(page.locator('[data-testid="the-calendar--calendar"]')).toBeVisible();
});
