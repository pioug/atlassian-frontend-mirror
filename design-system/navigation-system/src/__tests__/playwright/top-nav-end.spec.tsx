import { expect, test } from '@af/integration-testing';

const desktopViewport = { width: 1366, height: 768 };
const mobileViewport = { width: 360, height: 800 };

test.describe('top nav end', () => {
	test('should display the items in a popup on small viewports', async ({ page }) => {
		// Start at large viewport size
		await page.setViewportSize(desktopViewport);

		await page.visitExample('design-system', 'navigation-system', 'top-navigation');

		const chatButton = page.getByRole('button', { name: /Chat/ });
		const aiButton = page.getByRole('button', { name: /Atlassian Intelligence/ });
		const helpButton = page.getByRole('button', { name: /Help/ });
		const notificationsButton = page.getByRole('button', { name: /Notifications/ });
		const settingsButton = page.getByRole('button', { name: /Settings/ });
		const profileButton = page.getByRole('button', { name: /Your profile/ });

		// Items should be visible on large viewports
		await expect(chatButton).toBeVisible();
		await expect(aiButton).toBeVisible();
		await expect(helpButton).toBeVisible();
		await expect(notificationsButton).toBeVisible();
		await expect(settingsButton).toBeVisible();
		await expect(profileButton).toBeVisible();

		// Resize to small viewport
		await page.setViewportSize(mobileViewport);

		// Items should not be visible
		await expect(chatButton).toBeHidden();
		await expect(aiButton).toBeHidden();
		await expect(helpButton).toBeHidden();
		await expect(notificationsButton).toBeHidden();
		await expect(settingsButton).toBeHidden();
		await expect(profileButton).toBeHidden();

		// Open the "Show more" popup
		const showMoreButton = page.getByRole('button', { name: /Show more/ });
		await showMoreButton.click();

		// Items should now be visible in the popup
		await expect(chatButton).toBeVisible();
		await expect(aiButton).toBeVisible();
		await expect(helpButton).toBeVisible();
		await expect(notificationsButton).toBeVisible();
		await expect(settingsButton).toBeVisible();
		await expect(profileButton).toBeVisible();
	});

	test('should close the items popup when viewport size changes from small to large', async ({
		page,
	}) => {
		await page.setViewportSize(mobileViewport);

		await page.visitExample('design-system', 'navigation-system', 'top-navigation');

		// Open the "Show more" popup
		const showMoreButton = page.getByRole('button', { name: /Show more/ });
		await showMoreButton.click();

		const chatButton = page.getByRole('button', { name: /Chat/ });
		const aiButton = page.getByRole('button', { name: /Atlassian Intelligence/ });
		const helpButton = page.getByRole('button', { name: /Help/ });
		const notificationsButton = page.getByRole('button', { name: /Notifications/ });
		const settingsButton = page.getByRole('button', { name: /Settings/ });
		const profileButton = page.getByRole('button', { name: /Your profile/ });

		await expect(chatButton).toBeVisible();
		await expect(aiButton).toBeVisible();
		await expect(helpButton).toBeVisible();
		await expect(notificationsButton).toBeVisible();
		await expect(settingsButton).toBeVisible();
		await expect(profileButton).toBeVisible();

		// Resize to large viewport
		await page.setViewportSize(desktopViewport);

		// Wait for the resize to complete before resizing again (the "Show more" button gets hidden on large viewports).
		// This is to ensure that the browser registers that the viewport had changed - as otherwise the test can flake if we instantly
		// resize from small to large to small again, as the browser might not have time to update and respond to the viewport size changing.
		await expect(showMoreButton).toBeHidden();

		// Resize back to small viewport
		await page.setViewportSize(mobileViewport);

		// Items should not be visible
		await expect(chatButton).toBeHidden();
		await expect(aiButton).toBeHidden();
		await expect(helpButton).toBeHidden();
		await expect(notificationsButton).toBeHidden();
		await expect(settingsButton).toBeHidden();
		await expect(profileButton).toBeHidden();
	});
});
