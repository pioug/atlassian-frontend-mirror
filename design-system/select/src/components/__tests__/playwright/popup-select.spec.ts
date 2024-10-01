import { expect, test } from '@af/integration-testing';

test.describe('PopupSelect', () => {
	test('Popup Select should open and close when interacted with, FF off', async ({ page }) => {
		await page.visitExample('design-system', 'select', 'popup-select');
		const button = page.getByTestId('button-for-testing');
		await button.click();
		const select = page.getByTestId('select-for-testing--menu');
		await expect(select).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(select).toBeHidden();
	});

	test('Popup Select should open and close when interacted with, FF on', async ({ page }) => {
		await page.visitExample('design-system', 'select', 'popup-select', {
			featureFlag: 'platform_dst_select-bump-react-focus-lock',
		});
		const button = page.getByTestId('button-for-testing');
		await button.click();
		const select = page.getByTestId('select-for-testing--menu');
		await expect(select).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(select).toBeHidden();
	});

	test('Popup Select should open with down arrow, FF off', async ({ page, skipAxeCheck }) => {
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

	test('Popup Select should open with down arrow, FF on', async ({ page, skipAxeCheck }) => {
		await page.visitExample('design-system', 'select', 'popup-select', {
			featureFlag: 'platform_dst_select-bump-react-focus-lock',
		});
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
