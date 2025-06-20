import { expect, test } from '@af/integration-testing';

import { sideNavFlyoutCloseDelayMs } from '../../ui/page-layout/side-nav/flyout-close-delay-ms';

const mobileViewport = { width: 360, height: 800 };

test.describe('side nav flyout', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'side-nav-flyout');
	});

	test('should not show flyout when hovering on toggle button right after collapsing', async ({
		page,
	}) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Hover on the toggle button to [attempt to] show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav should NOT be visible - the flyout should not have opened.
		// This is because the user needs to mouse out of and then back into the toggle button before the flyout can open.
		await expect(sideNav).toBeHidden();
	});

	test('should show flyout after mousing out of and then back into toggle button after collapsing', async ({
		page,
	}) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Move mouse somewhere else to re-activate the flyout mouse listeners
		await page.getByRole('button', { name: /Switch apps/ }).hover();

		// Hover on the toggle button to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav (flyout) should be visible
		await expect(sideNav).toBeVisible();
	});

	test('should keep the flyout open when mousing over the side nav', async ({ page }) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Move mouse somewhere else to re-activate the flyout mouse listeners
		await page.getByRole('button', { name: /Switch apps/ }).hover();

		// Hover on the toggle button to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav (flyout) should be visible
		await expect(sideNav).toBeVisible();

		// Hover over a menu item within the side nav
		await page.getByRole('link', { name: /Projects/ }).hover();

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Side nav (flyout) should still be visible
		await expect(sideNav).toBeVisible();
	});

	test('should stop showing the flyout when mousing outside the side nav', async ({ page }) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Move mouse somewhere else to re-activate the flyout mouse listeners
		await page.getByRole('button', { name: /Switch apps/ }).hover();

		// Hover on the toggle button to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav (flyout) should be visible
		await expect(sideNav).toBeVisible();

		// Move mouse outside the side nav
		await page.getByRole('button', { name: /More settings/ }).hover();

		// Side nav (flyout) should be hidden
		await expect(sideNav).toBeHidden();
	});

	test('should keep the flyout open when mousing out of the side nav and then back in before timer expires', async ({
		page,
	}) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Move mouse somewhere else to re-activate the flyout mouse listeners
		await page.getByRole('button', { name: /Switch apps/ }).hover();

		// Hover on the toggle button to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav (flyout) should be visible
		await expect(sideNav).toBeVisible();

		// Move mouse outside the side nav
		await page.getByRole('button', { name: /More settings/ }).hover();

		// Move mouse back into the side nav before the flyout "collapse" timeout has finished
		await page.getByRole('link', { name: /Your work/ }).hover();

		// Wait for the flyout "collapse" timeout to have finished to make sure the flyout stays open.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Side nav (flyout) should still be visible
		await expect(sideNav).toBeVisible();
	});

	test('should lock the flyout open when a child layer is open', async ({ page }) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Move mouse somewhere else to re-activate the flyout mouse listeners
		await page.getByRole('button', { name: /Switch apps/ }).hover();

		// Hover on the toggle button to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav (flyout) should be visible
		await expect(sideNav).toBeVisible();

		// Open a child layer
		await page.getByRole('button', { name: /Starred more menu/ }).click();

		// Move mouse outside the side nav
		await page.getByRole('button', { name: /More settings/ }).hover();

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Side nav (flyout) should still be visible
		await expect(sideNav).toBeVisible();
	});

	test('should close the flyout after the open child layer is closed', async ({ page }) => {
		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		await expect(sideNav).toBeVisible();

		// Collapse side nav
		await page.getByRole('button', { name: /Collapse sidebar/ }).click();
		await expect(sideNav).toBeHidden();

		// Move mouse somewhere else to re-activate the flyout mouse listeners
		await page.getByRole('button', { name: /Switch apps/ }).hover();

		// Hover on the toggle button to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav (flyout) should be visible
		await expect(sideNav).toBeVisible();

		// Open a child layer
		await page.getByRole('button', { name: /Starred more menu/ }).click();

		// Move mouse outside the side nav
		await page.getByRole('button', { name: /More settings/ }).hover();

		// Wait for the flyout "collapse" timeout to have finished.
		// Waiting for a period of time is appropriate in this case,
		// as the logic we are testing is timeout based.
		// eslint-disable-next-line playwright/no-wait-for-timeout
		await page.waitForTimeout(sideNavFlyoutCloseDelayMs * 2);

		// Side nav (flyout) should still be visible
		await expect(sideNav).toBeVisible();

		// Click something outside of the side nav to close the child layer
		await page.getByRole('button', { name: /More settings/ }).click();

		await expect(sideNav).toBeHidden();
	});

	test('should not show the flyout on small viewports', async ({ page }) => {
		await page.setViewportSize(mobileViewport);

		const sideNav = page.getByRole('navigation', { name: /Sidebar/ });
		// Side nav is collapsed by default on small viewports
		await expect(sideNav).toBeHidden();

		// Hover on the toggle button to attempt to show the flyout
		await page.getByRole('button', { name: /Expand sidebar/ }).hover();

		// Side nav should not be visible
		await expect(sideNav).toBeHidden();
	});
});
