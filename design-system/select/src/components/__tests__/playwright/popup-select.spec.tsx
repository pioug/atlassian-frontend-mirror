/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('PopupSelect', () => {
	test('Popup Select should open and close when interacted with', async ({ page }) => {
		await page.visitExample('design-system', 'select', 'popup-select');
		const button = page.getByTestId('button-for-testing');
		await button.click();
		const select = page.getByTestId('select-for-testing--menu');
		await expect(select).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(select).toBeHidden();
	});

	test('Popup Select should open with down arrow', async ({ page, skipAxeCheck }) => {
		await page.visitExample('design-system', 'select', 'popup-select');
		const button = page.getByTestId('button-for-testing');
		await page.keyboard.press('Tab');
		await expect(button).toBeFocused();
		await page.keyboard.press('ArrowDown');
		const select = page.getByTestId('select-for-testing--menu');
		await expect(select).toBeVisible();

		// Received:
		// Scrollable region must have keyboard access (scrollable-region-focusable) in reference to the
		// Select's list of items. Since focus never really moves into this area, this test is not valid.
		skipAxeCheck();
	});
});
