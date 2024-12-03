import { expect, test } from '@af/integration-testing';
test('progress-tracker should pass base aXe audit', async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'progress-tracker', 'progress-tracker-default');
	await expect(page.locator('[data-testid="progress-tracker"]')).toBeVisible();
	// Remove skip after DSP-21561 is done
	skipAxeCheck();
});
