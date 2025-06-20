import { expect, test } from '@af/integration-testing';

test.describe('flyout menu item', () => {
	test('should open and close flyout content when trigger is clicked', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'menu-item-integration', {
			'react-18-mode': 'legacy',
		});

		const flyoutMenuItemTrigger = page.getByRole('button', { name: /Recent/ });
		const flyoutMenuItemContent = page.getByRole('button', { name: /View all recent items/ });

		await expect(flyoutMenuItemContent).toBeHidden();

		await flyoutMenuItemTrigger.click();

		await expect(flyoutMenuItemContent).toBeVisible();

		await flyoutMenuItemTrigger.click();

		await expect(flyoutMenuItemContent).toBeHidden();
	});
});
