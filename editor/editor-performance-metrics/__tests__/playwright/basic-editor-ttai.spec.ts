/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable compat/compat */
import { expect } from '@af/integration-testing';

import { test } from './fixtures';

test.describe('Editor TTAI', () => {
	test.use({
		examplePage: 'editor-full-page',
	});

	test('it should mark TTAI after the smart links being resolved', async ({
		page,
		waitForTicks,
	}) => {
		const resolvedSmartLinkDescription = page.locator('[data-testid="smart-block-resolved-view"]');
		let lastTimeCheckedForSmartlink = 0;

		// Check every 100ms when the Smart Link is visible and get the timestamp
		await expect
			.poll(
				async () => {
					lastTimeCheckedForSmartlink = await page.evaluate(() => {
						return performance.now();
					});
					return await resolvedSmartLinkDescription.isVisible();
				},
				{
					intervals: [100],
					timeout: 10000,
				},
			)
			.toBe(true);
		const idleAt = await waitForTicks(1);

		await expect(resolvedSmartLinkDescription).toBeVisible();
		expect(idleAt).toBeGreaterThan(lastTimeCheckedForSmartlink);
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await expect(page).toBeAccessible();
	});
});
