import { expect, test } from '@af/integration-testing';

test.describe('side nav focus on expand', () => {
	test.describe('when platform_dst_nav4_skip_link_a11y_1 is enabled', () => {
		test.beforeEach(async ({ page }) => {
			await page.visitExample<typeof import('../../../examples/side-nav-flyout.tsx')>(
				'design-system',
				'navigation-system',
				'side-nav-flyout',
				{
					featureFlag: 'navx-full-height-sidebar&featureFlag=platform_dst_nav4_skip_link_a11y_1',
				},
			);
		});

		test('should move focus to the first focusable item in the side nav when expanding via the toggle button', async ({
			page,
		}) => {
			const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
			await expect(sideNav).toBeVisible();

			// Collapse the side nav so that the toggle button can then expand it
			// Separate hover before click reduces flakiness, particularly in Webkit
			await page.getByRole('button', { name: /Collapse sidebar/ }).hover();
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();
			await expect(sideNav).toBeHidden();

			// Click the toggle button to expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();
			await expect(sideNav).toBeVisible();

			// Focus should have been moved to the first focusable item inside the side nav
			// (the "Your work" link is the first menu item rendered in the example)
			await expect(page.getByRole('link', { name: /Your work/ })).toBeFocused();
		});

		test('should not move focus when collapsing via the toggle button', async ({ page }) => {
			const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
			await expect(sideNav).toBeVisible();

			// Click the toggle button to collapse the side nav
			const collapseButton = page.getByRole('button', { name: /Collapse sidebar/ });
			await collapseButton.hover();
			await collapseButton.click();
			await expect(sideNav).toBeHidden();

			// Focus should remain on the toggle button (which is now the "Expand sidebar" button)
			await expect(page.getByRole('button', { name: /Expand sidebar/ })).toBeFocused();
		});
	});

	test.describe('when platform_dst_nav4_skip_link_a11y_1 is disabled', () => {
		test.beforeEach(async ({ page }) => {
			await page.visitExample<typeof import('../../../examples/side-nav-flyout.tsx')>(
				'design-system',
				'navigation-system',
				'side-nav-flyout',
				{
					featureFlag: 'navx-full-height-sidebar',
				},
			);
		});

		test('should not move focus when expanding via the toggle button', async ({ page }) => {
			const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
			await expect(sideNav).toBeVisible();

			// Collapse the side nav so that the toggle button can then expand it
			await page.getByRole('button', { name: /Collapse sidebar/ }).hover();
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();
			await expect(sideNav).toBeHidden();

			// Click the toggle button to expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();
			await expect(sideNav).toBeVisible();

			// Focus should remain on the toggle button (which is now the "Collapse sidebar" button)
			await expect(page.getByRole('button', { name: /Collapse sidebar/ })).toBeFocused();
		});
	});
});
