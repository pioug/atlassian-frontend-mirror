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

	test('should have a scrolled indicator border on scroll in TopNavStart when there is no SideNavHeader [layering fixes enabled]', async ({
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
			// Enabling both feature flags by setting the featureFlag query parameter twice
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});

		// This example does not have a SideNavHeader, so the scrolled indicator border is applied to TopNavStart.
		const topNavStartInner = page.getByTestId('top-nav-start');
		// We need the parent (wrapper) element, as that is where the scroll indicator border is applied.
		const topNavStart = topNavStartInner.locator('..');

		const sideNavContent = page.getByTestId('side-nav-content');

		// When not scrolled (default) it has no visible box shadow
		await expect(topNavStart).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0) 0px -1px 0px 0px inset');
		// SideNavContent should not have a visible box shadow
		await expect(sideNavContent).toHaveCSS('box-shadow', 'none');

		await sideNavContent.evaluate((element) => (element.scrollTop = 1));
		await expect(topNavStart).toHaveCSS(
			'box-shadow',
			// Main point is that the alpha is non-0
			// Don't want to hardcode a color to avoid adding friction if token values change
			/^rgba\(\d+, \d+, \d+, (1|(0\.\d+))\) 0px -1px 0px 0px inset$/,
		);
		await expect(sideNavContent).toHaveCSS('box-shadow', 'none');

		await sideNavContent.evaluate((element) => (element.scrollTop = 999));
		await expect(topNavStart).toHaveCSS(
			'box-shadow',
			/^rgba\(\d+, \d+, \d+, (1|(0\.\d+))\) 0px -1px 0px 0px inset$/,
		);
		await expect(sideNavContent).toHaveCSS('box-shadow', 'none');

		await sideNavContent.evaluate((element) => (element.scrollTop = 0));
		await expect(topNavStart).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0) 0px -1px 0px 0px inset');
		await expect(sideNavContent).toHaveCSS('box-shadow', 'none');
	});

	test('should have a scrolled indicator border on scroll in SideNavContent when there is a SideNavHeader [layering fixes enabled]', async ({
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

		await page.visitExample('design-system', 'navigation-system', 'page-layout-side-nav-slots', {
			// Enabling both feature flags by setting the featureFlag query parameter twice
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});

		// This example does have a SideNavHeader, so the scrolled indicator border is applied to SideNavContent.

		// Grabbing the top nav start element to check the scroll indicator is not being applied to it.
		const topNavStartInner = page.getByTestId('top-nav-start');
		// We need the parent (wrapper) element, as that is where the scroll indicator border is applied.
		const topNavStart = topNavStartInner.locator('..');

		const sideNavContent = page.getByTestId('side-nav-content');

		// When not scrolled (default) it has no box shadow
		await expect(sideNavContent).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px');
		// TopNavStart should not have a scroll indicator
		await expect(topNavStart).toHaveCSS('box-shadow', 'none');

		await sideNavContent.evaluate((element) => (element.scrollTop = 1));
		await expect(sideNavContent).toHaveCSS(
			'box-shadow',
			// Main point is that the alpha is non-0
			// Don't want to hardcode a color to avoid adding friction if token values change
			/^rgba\(\d+, \d+, \d+, (1|(0\.\d+))\) 0px -1px 0px 0px$/,
		);
		await expect(topNavStart).toHaveCSS('box-shadow', 'none');

		await sideNavContent.evaluate((element) => (element.scrollTop = 999));
		await expect(sideNavContent).toHaveCSS(
			'box-shadow',
			/^rgba\(\d+, \d+, \d+, (1|(0\.\d+))\) 0px -1px 0px 0px$/,
		);
		await expect(topNavStart).toHaveCSS('box-shadow', 'none');

		await sideNavContent.evaluate((element) => (element.scrollTop = 0));
		await expect(sideNavContent).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0) 0px 0px 0px 0px');
		await expect(topNavStart).toHaveCSS('box-shadow', 'none');
	});

	test('side nav should be layered above top nav by default', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'side-nav-layering', {
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});

		const sideNav = page.getByTestId('side-nav');
		const topNav = page.getByTestId('top-nav');

		// Equal z-index values, which means the DOM order determines the layering.
		await expect(topNav).toHaveCSS('z-index', '2');
		await expect(sideNav).toHaveCSS('z-index', '2');
	});

	test('top nav should be layered above side nav when there is an open popup in top nav start', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'navigation-system', 'side-nav-layering', {
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});

		const sideNav = page.getByTestId('side-nav');
		const topNav = page.getByTestId('top-nav');

		await expect(topNav).toHaveCSS('z-index', '2');
		await expect(sideNav).toHaveCSS('z-index', '2');

		// Open a layer in top nav start
		await page.getByRole('button', { name: 'Switch apps' }).click();

		// Top nav now has an increased z-index
		await expect(topNav).toHaveCSS('z-index', '3');
		await expect(sideNav).toHaveCSS('z-index', '2');
	});

	test('top nav should be layered above side nav when there is an open popup in top nav middle', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'navigation-system', 'side-nav-layering', {
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});

		const sideNav = page.getByTestId('side-nav');
		const topNav = page.getByTestId('top-nav');

		await expect(topNav).toHaveCSS('z-index', '2');
		await expect(sideNav).toHaveCSS('z-index', '2');

		// Open a layer in top nav start
		await page.getByTestId('create-button').click();

		// Top nav now has an increased z-index
		await expect(topNav).toHaveCSS('z-index', '3');
		await expect(sideNav).toHaveCSS('z-index', '2');
	});

	test('top nav should be layered above side nav when there is an open popup in top nav end', async ({
		page,
		skipAxeCheck,
	}) => {
		// The example is just for tests
		skipAxeCheck();

		await page.visitExample('design-system', 'navigation-system', 'side-nav-layering', {
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});

		const sideNav = page.getByTestId('side-nav');
		const topNav = page.getByTestId('top-nav');

		await expect(topNav).toHaveCSS('z-index', '2');
		await expect(sideNav).toHaveCSS('z-index', '2');

		// Open a layer in top nav end
		await page.getByRole('button', { name: 'Notifications' }).click();

		// Top nav now has an increased z-index
		await expect(topNav).toHaveCSS('z-index', '3');
		await expect(sideNav).toHaveCSS('z-index', '2');
	});
});
