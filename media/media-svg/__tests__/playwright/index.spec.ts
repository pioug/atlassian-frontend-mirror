import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='media-svg']";

test('MediaSvg should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample('media', 'media-svg', 'basic');
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});
