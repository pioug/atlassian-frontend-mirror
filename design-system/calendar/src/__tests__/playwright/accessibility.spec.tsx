import { expect, test } from '@af/integration-testing';

test('Calendar component should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/99-testing.vr.ap.tsx')>(
		'design-system',
		'calendar',
		'testing',
	);
	await expect(page.getByRole('group', { name: 'calendar' })).toBeVisible();
	await expect(page.locator('[data-testid="the-calendar--calendar"]')).not.toHaveAttribute(
		'aria-label',
	);
});
