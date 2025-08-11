import { expect, test } from '@af/integration-testing';

const viewportSize = { width: 1200, height: 700 };

test.describe('scroll into view', () => {
	test.describe('link menu item', () => {
		test('should scroll the newly selected menu item into view', async ({ page }) => {
			await page.setViewportSize(viewportSize);

			await page.visitExample('design-system', 'navigation-system', 'menu-item-scroll-into-view');

			// The "Your work" menu item is selected by default, and should be in view
			// We are intentionally starting on "Your work" to avoid flake with initial scroll position
			// because it is at the top, so no scrolling is needed.
			// We previously used "Filters" but the initial scroll position was inconsistent,
			// sometimes it would not be scrolled to.
			const yourWorkMenuItem = page.getByRole('link', { name: /Your work/ });
			await expect(yourWorkMenuItem).toBeInViewport();

			// The "Customize" menu item should not be scrolled in view yet
			const customizeMenuItem = page.getByRole('link', { name: /Customize/ });
			await expect(customizeMenuItem).not.toBeInViewport();

			// This button will select the "Customize" menu item
			const navigateToCustomizeMenuItemButton = page.getByTestId('navigate-to-customize-menu-item');
			await navigateToCustomizeMenuItemButton.click();

			// The "Customize" menu item should now be scrolled into view
			await expect(customizeMenuItem).toBeInViewport();
		});

		test('should scroll the selected menu item into view when the parent expandable goes from collapsed to expanded', async ({
			page,
		}) => {
			await page.setViewportSize(viewportSize);

			await page.visitExample('design-system', 'navigation-system', 'menu-item-scroll-into-view', {
				featureFlag: 'platform_dst_expandable_menu_item_elembefore_label',
			});

			// Collapse the "Teams" expandable menu item
			// We need to click on the collapse chevron icon button (instead of the menu item), so we only toggle the menu item and
			// don't *select* it too.
			const teamsMenuItemContainer = page.getByTestId('teams-menu-item-trigger-container');
			await teamsMenuItemContainer.scrollIntoViewIfNeeded();
			const teamsMenuItemChevronButton = teamsMenuItemContainer.getByTestId(
				'teams-menu-item-trigger--elem-before-button',
			);
			await teamsMenuItemChevronButton.click();

			// Select the "Team 10" menu item (by clicking the button in the Main slot)
			const navigateToTeam10MenuItemButton = page.getByTestId('navigate-to-team-10-menu-item');
			await navigateToTeam10MenuItemButton.click();

			// Expand the "Teams" expandable menu item - using the same button as before
			await teamsMenuItemChevronButton.click();

			// The "Team 10" menu item should be scrolled into view
			const team10MenuItem = page.getByRole('link', { name: /Team 10/ });
			await expect(team10MenuItem).toBeInViewport();
		});
	});

	test.describe('expandable menu item', () => {
		test('should scroll the newly selected menu item into view', async ({ page }) => {
			await page.setViewportSize(viewportSize);

			await page.visitExample('design-system', 'navigation-system', 'menu-item-scroll-into-view');

			// The "Your work" menu item is selected by default, and should be in view
			// We are intentionally starting on "Your work" to avoid flake with initial scroll position
			// because it is at the top, so no scrolling is needed.
			// We previously used "Filters" but the initial scroll position was inconsistent,
			// sometimes it would not be scrolled to.
			// "Your work" is the first menu item and at the top, so the "Teams" expandable menu item should not be in view
			const yourWorkMenuItem = page.getByRole('link', { name: /Your work/ });
			await expect(yourWorkMenuItem).toBeInViewport();

			// The "Teams" menu item should not be scrolled in view yet
			const teamsMenuItem = page.getByRole('link', { name: /Teams/ });
			await expect(teamsMenuItem).not.toBeInViewport();

			// This button will select the "Teams" menu item
			const navigateToTeamsMenuItemButton = page.getByTestId('navigate-to-teams-menu-item');
			await navigateToTeamsMenuItemButton.click();

			// The "Teams" menu item should now be scrolled into view
			await expect(teamsMenuItem).toBeInViewport();
		});
	});
});
