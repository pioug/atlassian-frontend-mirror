import { expect, test } from '@af/integration-testing';

test.describe('expandable menu item', () => {
	test('should expand and collapse content when trigger is clicked', async ({ page }) => {
		await page.visitExample('design-system', 'navigation-system', 'menu-item-integration');

		const expandableMenuItemTrigger = page.getByRole('button', { name: /Projects/ });
		const expandableMenuItemContent = page.getByRole('button', { name: /DST - Claret/ });

		await expect(expandableMenuItemContent).toBeHidden();

		await expandableMenuItemTrigger.click();

		await expect(expandableMenuItemContent).toBeVisible();

		await expandableMenuItemTrigger.click();

		await expect(expandableMenuItemContent).toBeHidden();
	});
});
