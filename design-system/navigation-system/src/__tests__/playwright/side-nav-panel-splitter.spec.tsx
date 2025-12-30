import { expect, test } from '@af/integration-testing';

// Width greater than 64rem (1024px)
const desktopViewport = { width: 1366, height: 768 };
// Width between 48rem and 64rem (768px and 1024px)
const tabletViewport = { width: 900, height: 768 };
// Width below 48rem (768px)
const mobileViewport = { width: 600, height: 768 };

test.describe('side nav panel splitter', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'resizable-slots', {
			// Enabling both feature flags by setting the featureFlag query parameter twice
			featureFlag: 'navx-full-height-sidebar&featureFlag=platform-dst-side-nav-layering-fixes',
		});
	});

	test.describe('when screen size is greater than 64rem', () => {
		test.beforeEach(async ({ page }) => {
			await page.setViewportSize(desktopViewport);
		});

		test('side nav panel splitter should be visible [mobile=collapsed, desktop=expanded]', async ({
			page,
		}) => {
			// Side nav should be expanded by default
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeVisible();

			// Side nav panel splitter should be visible
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeVisible();
		});

		test('side nav panel splitter should be hidden [mobile=collapsed, desktop=collapsed]', async ({
			page,
		}) => {
			// Click the side nav toggle button to collapse the side nav
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();

			// Side nav should be collapsed
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeHidden();
		});

		test('side nav panel splitter should be hidden [mobile=collapsed, desktop=collapsed, flyout=visible]', async ({
			page,
		}) => {
			// Click the side nav toggle button to collapse the side nav
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();

			// Hover somewhere else to re-activate the flyout mouse listeners
			await page.getByRole('button', { name: /Switch apps/ }).hover();

			// Hover over the side nav toggle button to show the flyout
			await page.getByRole('button', { name: /Expand sidebar/ }).hover();

			// Side nav should be visible (in peek/flyout mode)
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeVisible();

			// Side nav panel splitter should be hidden
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeHidden();
		});
	});

	// When the screen size is between 48rem and 64rem:
	// - The side nav is resizable
	// - The side nav uses the mobile visibility state
	// - The side nav cannot enter the flyout (peek) mode
	test.describe('when screen size is between 48rem and 64rem', () => {
		test('side nav panel splitter should be hidden [mobile=collapsed, desktop=expanded]', async ({
			page,
		}) => {
			await page.setViewportSize(tabletViewport);

			// Side nav should be collapsed
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeHidden();

			// Side nav panel splitter should be hidden
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeHidden();
		});

		test('side nav panel splitter should be visible [mobile=expanded, desktop=expanded]', async ({
			page,
		}) => {
			await page.setViewportSize(tabletViewport);

			// Click the side nav toggle button to expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			// Side nav should be expanded
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeVisible();

			// Side nav panel splitter should be visible
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeVisible();
		});

		// Explicitly testing this scenario as it was a previous bug. It is fixed in fg('platform-dst-side-nav-layering-fixes').
		test('side nav panel splitter should be visible [mobile=expanded, desktop=collapsed]', async ({
			page,
		}) => {
			// First collapse the side nav on desktop
			await page.setViewportSize(desktopViewport);
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeHidden();

			// Reduce viewport size to between 48rem and 64rem
			await page.setViewportSize(tabletViewport);
			// Side nav should be collapsed
			await expect(sideNav).toBeHidden();

			// Click the side nav toggle button to expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			// Side nav should be expanded
			await expect(sideNav).toBeVisible();

			// Side nav panel splitter should be visible
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeVisible();
		});
	});

	// When the screen size is between 48rem and 64rem:
	// - The side nav is NOT resizable
	// - The side nav uses the mobile visibility state
	// - The side nav cannot enter the flyout (peek) mode
	test.describe('when screen size is below 48rem', () => {
		test.beforeEach(async ({ page }) => {
			await page.setViewportSize(mobileViewport);
		});

		test('side nav panel splitter should be hidden [mobile=collapsed, desktop=expanded]', async ({
			page,
		}) => {
			// Side nav should be collapsed
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeHidden();

			// Side nav panel splitter should be hidden
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeHidden();
		});

		test('side nav panel splitter should be hidden [mobile=expanded, desktop=expanded]', async ({
			page,
		}) => {
			// Click the side nav toggle button to expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			// Side nav should be expanded
			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });
			await expect(sideNav).toBeVisible();

			// Side nav panel splitter should be hidden
			const sideNavPanelSplitter = page.getByTestId('side-nav-slot-panel-splitter');
			await expect(sideNavPanelSplitter).toBeHidden();
		});
	});
});
