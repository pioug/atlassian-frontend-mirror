import { BROWSERS, expect, fixTest, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='media-svg']";

test('MediaSvg should be able to be identified by data-testid', async ({ page }) => {
	fixTest({
		jiraIssueId: 'UTEST-1839',
		reason:
			'Skipped due to a timeout issue with locating elements in Chromium after upgrading to Playwright 1.44.1',
		browsers: [BROWSERS.chromium],
	});
	await page.visitExample('media', 'media-svg', 'basic');
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});
