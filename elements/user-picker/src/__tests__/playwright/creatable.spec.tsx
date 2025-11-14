import { expect } from '@af/integration-testing';
import { test } from './user-picker';

const EXAMPLE = 'creatable-with-locale';

test.describe('Creatable User Picker with Locale', () => {
	test('should load user picker with allowEmail enabled and default locale', async ({
		userPicker,
	}) => {
		await userPicker.init(EXAMPLE);

		// Check that the user picker is loaded
		await expect(userPicker.placeholder).toBeVisible();

		// Click input to open dropdown
		await userPicker.input.nth(1).click();

		// Verify that options are displayed
		await expect(userPicker.firstOption).toBeVisible();
	});

	test('should create new email option when typing valid email', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Click input and type a valid email address
		await userPicker.input.nth(1).click();
		await userPicker.input.nth(1).fill('integration_test@example.com');

		// Wait for any options to appear
		await expect(userPicker.firstOption).toBeVisible();

		// The create option should contain the email address
		await expect(userPicker.firstOption).toContainText('integration_test@example.com');

		// Select the created email option
		await userPicker.firstOption.click();

		// Verify the email is added as a selected value
		await expect(userPicker.selectedMultiValue).toContainText('integration_test@example.com');
	});

	test('should handle multiple email creations', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Add first email
		await userPicker.input.nth(1).click();
		await userPicker.input.nth(1).fill('integration_test_1@example.com');
		await expect(userPicker.firstOption).toBeVisible();
		await userPicker.firstOption.click();

		// Add second email
		await userPicker.input.nth(1).fill('integration_test_2@example.com');
		await expect(userPicker.firstOption).toBeVisible();
		await userPicker.firstOption.click();

		// Verify both emails are selected
		await expect(userPicker.selectedMultiValue).toHaveCount(2);
		await expect(userPicker.selectedMultiValue.first()).toContainText(
			'integration_test_1@example.com',
		);
		await expect(userPicker.selectedMultiValue.nth(1)).toContainText(
			'integration_test_2@example.com',
		);
	});

	test('should not create option for invalid email format', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Type an invalid email address
		await userPicker.input.nth(1).click();
		await userPicker.input.nth(1).fill('integration_test_invalid@');

		// Verify no create option appears for invalid email
		await expect(userPicker.firstOption).toBeVisible();
		await expect(userPicker.firstOption).toContainText('integration_test_invalid@');
		await expect(userPicker.firstOption).toHaveAttribute('aria-disabled', 'true');
	});

	test('should remove created email option', async ({ userPicker }) => {
		await userPicker.init(EXAMPLE);

		// Create and add an email
		await userPicker.input.nth(1).click();
		await userPicker.input.nth(1).fill('remove@test.com');

		await expect(userPicker.firstOption).toBeVisible();
		await userPicker.firstOption.click();

		// Verify email is added
		await expect(userPicker.selectedMultiValue).toHaveCount(1);

		// Remove the email using the clear button
		const removeButton = userPicker.multiValueClearButton.first();
		await removeButton.click();

		// Verify email is removed
		await expect(userPicker.selectedMultiValue).toHaveCount(0);
	});
});
