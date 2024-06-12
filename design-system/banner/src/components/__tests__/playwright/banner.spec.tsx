import { expect, test } from '@af/integration-testing';

const myBannerTestId = "[data-testid='myBannerTestId']";

test('Banner should be identified and visible by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'banner', 'testing');
	await expect(page.locator(myBannerTestId).first()).toBeVisible();
	await expect(page.locator(myBannerTestId).first()).toHaveText(
		'Your Banner is rendered with a [data-testid="myBannerTestId"].',
	);
});
