import { expect, test } from '@af/integration-testing';

test.describe('PopupSelect', () => {
  test('Popup Select should open and close when interacted with', async ({
    page,
  }) => {
    await page.visitExample('design-system', 'select', 'popup-select');
    const button = await page.getByTestId('button-for-testing');
    await button.click();
    const select = await page.getByTestId('select-for-testing--menu');
    await expect(select).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(select).toBeHidden();
  });

  test('Popup Select should open with down arrow', async ({ page }) => {
    await page.visitExample('design-system', 'select', 'popup-select');
    const button = await page.getByTestId('button-for-testing');
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    await page.keyboard.press('ArrowDown');
    const select = await page.getByTestId('select-for-testing--menu');
    await expect(select).toBeVisible();
  });
});
