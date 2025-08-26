import { expect, test } from '@af/integration-testing';

test.describe('menu item - actions on hover', () => {
	test.describe('when platform_dst_nav4_actionsonhover_focus_fix flag is enabled', () => {
		test('should return focus to dropdown trigger inside actions on hover', async ({ page }) => {
			await page.visitExample('design-system', 'navigation-system', 'menu-item-actions-on-hover', {
				featureFlag: 'platform_dst_nav4_actionsonhover_focus_fix',
			});

			const buttonMenuItemWithHoverActions = page.getByTestId(
				'button-menu-item-with-hover-actions',
			);
			await buttonMenuItemWithHoverActions.focus();

			// Press tab to focus on the actions on hover
			await page.keyboard.press('Tab');

			const dropdownTrigger = page.getByTestId('button-menu-item-with-hover-actions--more-action');
			await expect(dropdownTrigger).toBeFocused();

			// Press enter to open the dropdown
			await page.keyboard.press('Enter');

			const firstItemInDropdown = page.getByRole('menuitem', { name: 'Manage starred' });
			await expect(firstItemInDropdown).toBeFocused();

			// Press escape to close the dropdown
			await page.keyboard.press('Escape');

			// Focus should be returned to the dropdown trigger
			await expect(dropdownTrigger).toBeFocused();
		});

		test('should return focus to popup trigger inside actions on hover', async ({ page }) => {
			await page.visitExample('design-system', 'navigation-system', 'menu-item-actions-on-hover', {
				featureFlag: 'platform_dst_nav4_actionsonhover_focus_fix',
			});

			const buttonMenuItemWithPopup = page.getByTestId('button-menu-item-with-popup');
			await buttonMenuItemWithPopup.focus();

			// Press tab to focus on the actions on hover
			await page.keyboard.press('Tab');

			const popupTrigger = page.getByTestId('button-menu-item-with-popup--add-action');
			await expect(popupTrigger).toBeFocused();

			// Press enter to open the popup
			await page.keyboard.press('Enter');

			const firstItemInPopup = page.getByRole('button', { name: 'Menu item 1' });
			await expect(firstItemInPopup).toBeFocused();

			// Press escape to close the popup
			await page.keyboard.press('Escape');

			// Focus should be returned to the popup trigger
			await expect(popupTrigger).toBeFocused();
		});

		test('should focus on interactive elements inside actions on hover when tabbing backwards', async ({
			page,
		}) => {
			await page.visitExample('design-system', 'navigation-system', 'menu-item-actions-on-hover', {
				featureFlag: 'platform_dst_nav4_actionsonhover_focus_fix',
			});

			// Focus on the last menu item
			const lastMenuItem = page.getByTestId('button-menu-item-with-popup-portalled-popup');
			await lastMenuItem.focus();

			// Press shift+tab to tab backwards, to the menu item above
			await page.keyboard.press('Shift+Tab');

			// The interactive element inside the menu item above `lastMenuItem` should now be focused
			const secondLastMenuItemActionsOnHover = page.getByTestId(
				'button-menu-item-with-popup--add-action',
			);
			await expect(secondLastMenuItemActionsOnHover).toBeFocused();
		});
	});
});
