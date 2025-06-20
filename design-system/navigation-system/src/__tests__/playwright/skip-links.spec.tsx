import { expect, test } from '@af/integration-testing';

test.describe('skip links', () => {
	test.beforeEach(({ page }) => {
		// Rethrowing uncaught errors from the page, otherwise they don't seem to get surfaced
		page.on('pageerror', (error) => {
			throw error;
		});
	});

	test('should move focus after clicking the skip link', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'composition');

		const bannerSkipLink = page.getByRole('link', { name: 'Banner', includeHidden: true });

		await bannerSkipLink.focus();
		await bannerSkipLink.click();

		const skipLinkHref = await bannerSkipLink.getAttribute('href');
		const activeElementId = await page.evaluate(() => document.activeElement?.id);

		expect(`#${activeElementId}`).toEqual(skipLinkHref);
	});

	test('should move focus after clicking the skip link (with React 18 useId)', async ({ page }) => {
		/**
		 * This test case exists because the `useId()` hook in React 18 has ids with `:` characters.
		 *
		 * This previously broke our skip links.
		 */
		await page.visitExample('design-system', 'navigation-system', 'composition', {
			featureFlag: 'platform-dst-react-18-use-id',
		});

		const bannerSkipLink = page.getByRole('link', { name: 'Banner', includeHidden: true });

		await bannerSkipLink.focus();
		await bannerSkipLink.click();

		const skipLinkHref = await bannerSkipLink.getAttribute('href');
		const activeElementId = await page.evaluate(() => document.activeElement?.id);

		expect(`#${activeElementId}`).toEqual(skipLinkHref);
	});

	test('should not be visible until it has focus', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'composition');

		const skipLinkContainer = page.getByTestId('root--skip-links-container');
		const firstSkipLink = skipLinkContainer.getByRole('link').first();

		/**
		 * Using `opacity` checks to see if the skip links are visible because `.toBeVisible()` does not consider opacity.
		 *
		 * We don't use `display: none` because we want it to still be interactive.
		 */
		await expect(skipLinkContainer).toHaveCSS('opacity', '0');
		await firstSkipLink.focus();
		await expect(skipLinkContainer).toHaveCSS('opacity', '1');
	});

	test('should be hidden when pressing escape while focus is inside', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'composition');

		const skipLinkContainer = page.getByTestId('root--skip-links-container');
		const firstSkipLink = skipLinkContainer.getByRole('link').first();

		/**
		 * Using `opacity` checks to see if the skip links are visible because `.toBeVisible()` does not consider opacity.
		 *
		 * We don't use `display: none` because we want it to still be interactive.
		 */
		await firstSkipLink.focus();
		await expect(skipLinkContainer).toHaveCSS('opacity', '1');
		await firstSkipLink.press('Escape');
		await expect(skipLinkContainer).toHaveCSS('opacity', '0');
	});

	test('should expand side navigation when navigating by skip link on desktop', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'navigation-system', 'composition');

		const collapseSidebarButton = page.getByRole('button', { name: 'Collapse sidebar' });
		const sidebar = page.getByLabel('Sidebar');
		const sidebarSkipLink = page.getByRole('link', { name: 'Sidebar' });

		await collapseSidebarButton.click();
		await expect(sidebar).toBeHidden();

		await sidebarSkipLink.press('Enter');
		await expect(sidebar).toBeVisible();
		await expect(sidebar).toBeFocused();
	});

	test('should expand side navigation when navigating by skip link on mobile', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'composition');

		const sidebar = page.getByLabel('Sidebar');
		const sidebarSkipLink = page.getByRole('link', { name: 'Sidebar' });

		page.setViewportSize({ width: 400, height: 780 });

		// Sidebar is collapsed by default on mobile
		await expect(sidebar).toBeHidden();

		await sidebarSkipLink.press('Enter');
		await expect(sidebar).toBeVisible();
		await expect(sidebar).toBeFocused();
	});
});
