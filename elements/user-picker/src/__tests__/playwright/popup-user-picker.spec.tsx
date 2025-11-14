import { expect } from '@af/integration-testing';
import { test } from './user-picker';

const EXAMPLE = 'modal';

test.describe('User Picker Modal', () => {
	test('should load modal example with table structure', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Verify the table headers are present
		await expect(userPicker.page.getByText('Issue')).toBeVisible();
		await expect(userPicker.page.getByText('Assign')).toBeVisible();

		// Verify first few popup buttons are rendered
		await expect(userPicker.page.getByTestId('popup-button-0')).toBeVisible();
		await expect(userPicker.page.getByTestId('popup-button-1')).toBeVisible();
		await expect(userPicker.page.getByTestId('popup-button-2')).toBeVisible();
	});

	test('should open popup when target button is clicked', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Click the first popup button
		await userPicker.page.getByTestId('popup-button-0').click();

		// Verify the popup title is visible (use more specific selector)
		await expect(userPicker.page.getByText('Assignee').first()).toBeVisible();

		// Verify the input field is visible in the popup
		await expect(userPicker.input).toBeVisible();
	});

	test('should allow searching and selecting users in popup', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Click the first popup button to open the popup
		await userPicker.page.getByTestId('popup-button-0').click();

		// Wait for popup to be visible
		await expect(userPicker.page.getByText('Assignee').first()).toBeVisible();

		// Fill text into the input to trigger options
		await userPicker.input.fill('team');

		// Wait for options to be visible
		await expect(userPicker.firstOption).toBeVisible();

		// Select the first option
		await userPicker.firstOption.click();

		// Verify the popup closes after selection (input should not be visible anymore)
		await expect(userPicker.input).toBeHidden();
	});

	test('should close popup with Escape key', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Click popup button to open
		await userPicker.page.getByTestId('popup-button-0').click();
		await expect(userPicker.page.getByText('Assignee').first()).toBeVisible();

		// Press Escape to close
		await userPicker.page.keyboard.press('Escape');

		// Verify popup is closed
		await expect(userPicker.input).toBeHidden();
		await expect(userPicker.page.getByText('Assignee').first()).toBeHidden();
	});

	test('should handle keyboard navigation in popup', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Open popup
		await userPicker.page.getByTestId('popup-button-0').click();
		await expect(userPicker.page.getByText('Assignee').first()).toBeVisible();

		// Fill text to show options
		await userPicker.input.fill('team');
		await expect(userPicker.firstOption).toBeVisible();

		// Navigate with arrow keys
		await userPicker.input.press('ArrowDown');

		// Select with Enter
		await userPicker.input.press('Enter');

		// Verify popup closes after selection
		await expect(userPicker.input).toBeHidden();
	});
});
