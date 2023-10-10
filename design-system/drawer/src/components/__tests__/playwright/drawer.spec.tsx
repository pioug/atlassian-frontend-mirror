import { expect, test } from '@af/integration-testing';

test.describe('Drawer', () => {
  test('should render fixed dropdown-menu correctly', async ({ page }) => {
    await page.visitExample(
      'design-system',
      'drawer',
      'drawer-with-fixed-contents',
    );
    await page.getByTestId('dropdown--trigger').click();
    const dropDownMenu = page.getByTestId('dropdown--content');
    const dropDownMenuBox = await dropDownMenu.boundingBox();
    expect(dropDownMenuBox?.x).toBeGreaterThanOrEqual(100);
    expect(dropDownMenuBox?.y).toBeGreaterThanOrEqual(200);
  });
});

test.describe('Drawer', () => {
  test('should have focus on first element when opened', async ({ page }) => {
    await page.visitExample('design-system', 'drawer', 'drawer-default');
    await page.getByTestId('drawer-trigger').click();
    const drawerCloseButton = page.getByTestId(
      'DrawerPrimitiveSidebarCloseButton',
    );
    await expect(drawerCloseButton).toBeFocused();
  });
});
