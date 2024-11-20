import { expect, test } from '@af/integration-testing';

const myBannerTestId = "[data-testid='basicTestId']";

test('Banner should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'banner', 'basic-usage');
	await expect(page.locator(myBannerTestId).first()).toBeVisible();
	await expect(page.locator(myBannerTestId).first()).toHaveText(
		'Your license is about to expire. Please renew your license within the next week.',
	);
});
