import { expect, test } from '@af/integration-testing';

const desktopViewport = { width: 1366, height: 768 };
const mobileViewport = { width: 360, height: 800 };

test.describe('side nav responsive behaviour', () => {
	test.describe('when useIsFhsEnabled is true', () => {
		test.beforeEach(async ({ page }) => {
			await page.visitExample('design-system', 'navigation-system', 'menu-item-integration', {
				featureFlag: 'navx-full-height-sidebar',
			});
		});

		test('should collapse side nav when resizing viewport from desktop to mobile', async ({
			page,
		}) => {
			// Start at large viewport size
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			await expect(sideNav).toBeVisible();

			// Resize to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav should be hidden on small viewports by default
			await expect(sideNav).toBeHidden();
		});

		test('should expand side nav when resizing viewport from small to large', async ({ page }) => {
			// Start at small viewport size
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be hidden on small viewports by default
			await expect(sideNav).toBeHidden();

			// Resize to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();
		});

		test('should maintain desktop expanded state when resizing viewport from large to small, then back to large', async ({
			page,
		}) => {
			// Start at large viewport size
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be expanded on large viewports by default
			await expect(sideNav).toBeVisible();

			// Resize to small viewport
			await page.setViewportSize(mobileViewport);

			await expect(sideNav).toBeHidden();

			// Resize back to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();
		});

		test('should maintain mobile expanded state when resizing viewport from small to large, then back to small', async ({
			page,
		}) => {
			// Start at small viewport size
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be collapsed on small viewports by default
			await expect(sideNav).toBeHidden();

			// Click toggle button to expand side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			// Side nav should now be expanded
			await expect(sideNav).toBeVisible();

			// Resize to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();

			// Resize back to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav should still be expanded
			await expect(sideNav).toBeVisible();
		});

		// This test only passes when `useIsFhsEnabled` is true
		test('should maintain mobile expanded state when collapsed on desktop, peeking side nav open, then resizing back to small', async ({
			page,
		}) => {
			// Start at small viewport size
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be collapsed on small viewports by default
			await expect(sideNav).toBeHidden();

			// Click toggle button to expand side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			// Side nav should now be expanded
			await expect(sideNav).toBeVisible();

			// Resize to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();

			// Click the toggle button to collapse the side nav on desktop
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();

			await expect(sideNav).toBeHidden();

			// Move mouse somewhere else to re-activate the flyout mouse listeners
			await page.getByRole('button', { name: /Create/ }).hover();

			// Hover on the toggle button to peek open the side nav (in flyout mode)
			await page.getByRole('button', { name: /Expand sidebar/ }).hover();

			// Side nav should be visible in peeking/flyout mode
			await expect(sideNav).toBeVisible();

			// Move mouse outside the side nav
			await page.getByRole('button', { name: /Create/ }).hover();

			// Side nav should not be visible
			await expect(sideNav).toBeHidden();

			// Resize back to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav should still be expanded
			await expect(sideNav).toBeVisible();
		});

		test('should expand the desktop side nav when expanded on mobile and resized to desktop', async ({
			page,
		}) => {
			// Start at large viewport size
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be expanded on large viewports by default
			await expect(sideNav).toBeVisible();

			// Collapse the side nav on desktop
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();

			await expect(sideNav).toBeHidden();

			// Resize to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav is always collapsed by default on small viewports
			await expect(sideNav).toBeHidden();

			// Expand the side nav on mobile
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			await expect(sideNav).toBeVisible();

			// Resize back to large viewport
			await page.setViewportSize(desktopViewport);

			// Side nav should now be expanded on desktop too
			await expect(sideNav).toBeVisible();
		});
	});

	test.describe('when useIsFhsEnabled is false', () => {
		test.beforeEach(async ({ page }) => {
			await page.visitExample('design-system', 'navigation-system', 'menu-item-integration');
		});

		test('should collapse side nav when resizing viewport from desktop to mobile', async ({
			page,
		}) => {
			// Start at large viewport size
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			await expect(sideNav).toBeVisible();

			// Resize to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav should be hidden on small viewports by default
			await expect(sideNav).toBeHidden();
		});

		test('should expand side nav when resizing viewport from small to large', async ({ page }) => {
			// Start at small viewport size
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be hidden on small viewports by default
			await expect(sideNav).toBeHidden();

			// Resize to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();
		});

		test('should maintain desktop expanded state when resizing viewport from large to small, then back to large', async ({
			page,
		}) => {
			// Start at large viewport size
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be expanded on large viewports by default
			await expect(sideNav).toBeVisible();

			// Resize to small viewport
			await page.setViewportSize(mobileViewport);

			await expect(sideNav).toBeHidden();

			// Resize back to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();
		});

		test('should maintain mobile expanded state when resizing viewport from small to large, then back to small', async ({
			page,
		}) => {
			// Start at small viewport size
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be collapsed on small viewports by default
			await expect(sideNav).toBeHidden();

			// Click toggle button to expand side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			// Side nav should now be expanded
			await expect(sideNav).toBeVisible();

			// Resize to large viewport
			await page.setViewportSize(desktopViewport);

			await expect(sideNav).toBeVisible();

			// Resize back to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav should still be expanded
			await expect(sideNav).toBeVisible();
		});

		test('should expand the desktop side nav when expanded on mobile and resized to desktop', async ({
			page,
		}) => {
			// Start at large viewport size
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be expanded on large viewports by default
			await expect(sideNav).toBeVisible();

			// Collapse the side nav on desktop
			await page.getByRole('button', { name: /Collapse sidebar/ }).click();

			await expect(sideNav).toBeHidden();

			// Resize to small viewport
			await page.setViewportSize(mobileViewport);

			// Side nav is always collapsed by default on small viewports
			await expect(sideNav).toBeHidden();

			// Expand the side nav on mobile
			await page.getByRole('button', { name: /Expand sidebar/ }).click();

			await expect(sideNav).toBeVisible();

			// Resize back to large viewport
			await page.setViewportSize(desktopViewport);

			// Side nav should now be expanded on desktop too
			await expect(sideNav).toBeVisible();
		});
	});

	test.describe('click outside to close', () => {
		test.beforeEach(async ({ page }) => {
			await page.visitExample('design-system', 'navigation-system', 'menu-item-integration');
		});

		test('should not close when clicking outside on desktop', async ({ page }) => {
			await page.setViewportSize(desktopViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Side nav should be expanded on large viewports by default
			await expect(sideNav).toBeVisible();

			// Click outside the side nav.
			// Not using main because on mobile the side nav partially covers main, this keeps it simpler
			await page.getByRole('banner').click();

			// Side nav did not close because desktop viewport
			await expect(sideNav).toBeVisible();
		});

		test('should close when clicking outside on mobile', async ({ page }) => {
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Closed by default on mobile
			await expect(sideNav).toBeHidden();

			// Expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();
			await expect(sideNav).toBeVisible();

			// Click outside the side nav.
			// Not using main because on mobile the side nav partially covers main, this keeps it simpler
			await page.getByRole('banner').click();

			// The side nav closed from the outside click
			await expect(sideNav).toBeHidden();
		});

		test('should correctly handle resizing', async ({ page }) => {
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Closed by default on mobile
			await expect(sideNav).toBeHidden();

			// Expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();
			await expect(sideNav).toBeVisible();

			// Resize to desktop size
			await page.setViewportSize(desktopViewport);

			// The side nav is open by default on desktop
			await expect(sideNav).toBeVisible();

			// Click outside the side nav.
			// Not using main because on mobile the side nav partially covers main, this keeps it simpler
			await page.getByRole('banner').click();

			// The side nav is still open
			await expect(sideNav).toBeVisible();

			// Resize back to mobile size
			await page.setViewportSize(mobileViewport);

			// The side nav is still open from before
			await expect(sideNav).toBeVisible();

			// Click outside the side nav.
			// Not using main because on mobile the side nav partially covers main, this keeps it simpler
			await page.getByRole('banner').click();

			// The side nav closed from the outside click
			await expect(sideNav).toBeHidden();
		});

		// This is tested using Playwright instead of Jest, as Jest isn't able to reproduce this nuanced edge case
		test('should not collapse when clicking on an element that is removed from the document once clicked, on mobile', async ({
			page,
		}) => {
			await page.setViewportSize(mobileViewport);

			const sideNav = page.getByRole('navigation', { name: /Side navigation/ });

			// Closed by default on mobile
			await expect(sideNav).toBeHidden();

			// Expand the side nav
			await page.getByRole('button', { name: /Expand sidebar/ }).click();
			await expect(sideNav).toBeVisible();

			// Open a dropdown menu
			await page.getByRole('button', { name: /Starred more options/ }).click();

			// Click a dropdown menu item
			await page.getByRole('menuitem', { name: /Manage starred/ }).click();

			// The side nav should still be open
			await expect(sideNav).toBeVisible();
		});
	});
});
