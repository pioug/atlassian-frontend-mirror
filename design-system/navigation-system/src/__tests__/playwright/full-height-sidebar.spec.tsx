import { expect, test } from '@af/integration-testing';

test.describe('full height sidebar', () => {
	/**
	 * This test checks CSS because animations are disabled in VR tests and our styles
	 * rely on CSS scroll-driven animations.
	 */
	test('should have a scrolled indicator border on scroll', async ({
		page,
		skipAxeCheck,
		browserName,
	}) => {
		// The example is just for tests
		skipAxeCheck();

		// eslint-disable-next-line playwright/no-conditional-in-test
		if (browserName === 'firefox' || browserName === 'webkit') {
			// Only testing in Chromium because Webkit treats the computed values differently
			// and Firefox doesn't support scroll-driven animations yet.
			// This test is already quite indirect, so it's okay to just have one browser as a smoke test
			return;
		}

		await page.visitExample('design-system', 'navigation-system', 'confluence-mock', {
			featureFlag: 'navx-full-height-sidebar',
		});

		const sideNavContent = page.getByTestId('side-nav-content');

		// When not scrolled (default) it has no box shadow
		await expect(sideNavContent).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px');

		await sideNavContent.evaluate((element) => (element.scrollTop = 1));
		await expect(sideNavContent).toHaveCSS(
			'box-shadow',
			// Main point is that the alpha is non-0
			// Don't want to hardcode a color to avoid adding friction if token values change
			/^rgba\(\d+, \d+, \d+, (1|(0\.\d+))\) 0px -1px 0px 0px$/,
		);

		await sideNavContent.evaluate((element) => (element.scrollTop = 999));
		await expect(sideNavContent).toHaveCSS(
			'box-shadow',
			/^rgba\(\d+, \d+, \d+, (1|(0\.\d+))\) 0px -1px 0px 0px$/,
		);

		await sideNavContent.evaluate((element) => (element.scrollTop = 0));
		await expect(sideNavContent).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px');
	});
});
