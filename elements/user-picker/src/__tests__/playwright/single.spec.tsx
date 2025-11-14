import { expect } from '@af/integration-testing';
import { test } from './user-picker';

const EXAMPLE = 'single';

test.describe('User Picker', () => {
	test('should load single user picker', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await expect(userPicker.placeholder).toBeVisible();
	});

	test('should select an option', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();

		// Fill text into the input to trigger options
		await userPicker.input.fill('team');

		// Wait for options to be visible
		await expect(userPicker.firstOption).toBeVisible();

		// Select the first option
		await userPicker.firstOption.click();

		// Assert that the option is selected
		await expect(userPicker.selectedSingleValue).toContainText('team', { ignoreCase: true });
	});

	test('should handle keyboard navigation in options menu', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();
		await userPicker.input.fill('team');

		// Wait for options to be visible
		await expect(userPicker.firstOption).toBeVisible();

		const secondOptionText = await userPicker.option.nth(1).innerText();

		// Use arrow keys to navigate
		await userPicker.input.press('ArrowDown');

		// Select with Enter key
		await userPicker.input.press('Enter');

		// Verify selection was made - look for selected items
		await expect(userPicker.selectedSingleValue).toContainText(secondOptionText, {
			ignoreCase: true,
		});
	});
});
