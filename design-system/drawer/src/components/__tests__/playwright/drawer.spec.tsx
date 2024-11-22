import { expect, test } from '@af/integration-testing';

test.describe('Drawer with Fixed Contents', () => {
	test('should render fixed dropdown-menu correctly', async ({ page, skipAxeCheck }) => {
		await page.visitExample('design-system', 'drawer', 'drawer-with-fixed-contents');
		await page.getByTestId('dropdown--trigger').click();
		const dropDownMenu = page.getByTestId('dropdown--content');
		const dropDownMenuBox = await dropDownMenu.boundingBox();
		expect(dropDownMenuBox?.x).toBeGreaterThanOrEqual(100);
		expect(dropDownMenuBox?.y).toBeGreaterThanOrEqual(200);

		// failing due to the trigger button, which is dependent on the button component
		// https://product-fabric.atlassian.net/browse/DSP-19090
		skipAxeCheck();
	});
});

test.describe('Default Drawer', () => {
	test('should have focus on first element when opened', async ({ page }) => {
		await page.visitExample('design-system', 'drawer', 'drawer-default');
		await page.getByTestId('drawer-trigger').click();
		const drawerCloseButton = page.getByTestId('DrawerPrimitiveSidebarCloseButton');
		await expect(drawerCloseButton).toBeFocused();
	});
	test('should return focus to trigger element when closed', async ({ page }) => {
		await page.visitExample('design-system', 'drawer', 'drawer-default');
		const drawerTrigger = page.getByTestId('drawer-trigger');
		await drawerTrigger.click();
		const drawerCloseButton = page.getByTestId('DrawerPrimitiveSidebarCloseButton');
		await drawerCloseButton.click();
		await expect(drawerTrigger).toBeFocused();
	});
	test('focus should not go beyond drawer container', async ({ page }) => {
		await page.visitExample('design-system', 'drawer', 'drawer-default');
		const drawerTrigger = page.getByTestId('drawer-trigger');
		await drawerTrigger.click();
		await drawerTrigger.focus();
		await expect(drawerTrigger).not.toBeFocused();
	});
});

test.describe('Scrollable Drawer', () => {
	test('should be focusable', async ({ page }) => {
		await page.visitExample('design-system', 'drawer', 'scroll');
		await page.setViewportSize({ width: 600, height: 150 });
		await page.getByTestId('open-drawer').click();

		const drawerContainer = page.getByTestId('drawer-contents');
		await expect(drawerContainer).toHaveAttribute('tabindex', '0');
	});

	test('should have a role="region"', async ({ page }) => {
		await page.visitExample('design-system', 'drawer', 'scroll');
		await page.setViewportSize({ width: 600, height: 150 });
		await page.getByTestId('open-drawer').click();

		const drawerContainer = page.getByTestId('drawer-contents');
		expect(page.getByRole('region')).toBeDefined();
		await expect(drawerContainer).toHaveAttribute('aria-label', 'Scrollable drawer');
	});
});
