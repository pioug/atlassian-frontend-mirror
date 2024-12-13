import { expect, test } from '@af/integration-testing';

test('Dropdown menu should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'dropdown-menu', 'default-dropdown-menu');
	const dropdownTrigger = page.getByTestId('dropdown--trigger');
	const dropdownMenu = page.getByTestId('dropdown--menu-wrapper--menu-group');
	await dropdownTrigger.click();
	await expect(dropdownMenu).toBeVisible();
});
