import { expect } from '@af/integration-testing';
import { test } from './user-picker';

const EXAMPLE = 'multi';

test.describe('Multi User Picker', () => {
	test('should load multi user picker with placeholder text', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await expect(userPicker.placeholder).toBeVisible();
	});

	test('should display options when clicking on input', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();

		// Wait for options to be visible
		await expect(userPicker.firstOption).toBeVisible();

		// Select the first option
		await userPicker.firstOption.click();

		// Assert that the selected multi value is visible
		await expect(userPicker.selectedMultiValue).toHaveCount(1);

		// Select another option
		await userPicker.firstOption.click();

		// Assert that two multi values are selected
		await expect(userPicker.selectedMultiValue).toHaveCount(2);
	});

	test('should filter options when typing in input', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();

		// Type search text to filter options
		await userPicker.input.fill('team');

		// Wait for filtered options to appear
		await expect(userPicker.firstOption).toBeVisible();

		// Check that filtered results contain the search term
		await expect(userPicker.firstOption).toContainText('team', { ignoreCase: true });
	});

	test('should remove selected option when clicking remove button', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();

		// Fill and select an option
		await expect(userPicker.firstOption).toBeVisible();

		// Select two options
		await userPicker.firstOption.click();
		await userPicker.firstOption.click();

		// Assert that the selected multi value are visible
		await expect(userPicker.selectedMultiValue).toHaveCount(2);

		// Click the one clear button
		const removeButton = userPicker.multiValueClearButton.first();
		await removeButton.click();

		// Assert that one selection is removed
		await expect(userPicker.selectedMultiValue).toHaveCount(1);
	});

	test('should clear input after selecting an option', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();

		// Fill text and select option
		await userPicker.input.fill('team');
		await expect(userPicker.firstOption).toBeVisible();
		await userPicker.firstOption.click();

		// Verify input is cleared after selection
		await expect(userPicker.input).toHaveValue('');
	});

	test('should maintain focus on input after making selections', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);
		await userPicker.input.click();

		// Make a selection
		await userPicker.input.fill('team');
		await expect(userPicker.firstOption).toBeVisible();
		await userPicker.firstOption.click();

		// Verify input maintains focus for additional selections
		await expect(userPicker.input).toBeFocused();

		// Should be able to type immediately for next selection
		await userPicker.input.fill('user');
		await expect(userPicker.firstOption).toBeVisible();
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
		await expect(userPicker.selectedMultiValue).toContainText(secondOptionText, {
			ignoreCase: true,
		});
	});
});
