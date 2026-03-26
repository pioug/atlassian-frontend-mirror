/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Focus - Tab through form fields in popup', () => {
	// Category 5: Focus Management
	// Verifies that Tab moves through form fields inside a popup correctly.
	// This catches focus trap being too aggressive and stealing focus from form elements.

	// WCAG 2.1.1 Keyboard - all form fields inside popup reachable via Tab
	test('Tab navigates through all form fields in order', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/130-testing-form-in-popup.tsx')>(
			'design-system',
			'top-layer',
			'testing-form-in-popup',
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Dialog auto-focuses the first focusable element (form-input-1)
		await expect(page.getByTestId('form-input-1')).toBeFocused();

		// Tab through the remaining form fields — they should all be reachable
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('form-select')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('form-input-2')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('form-submit')).toBeFocused();
	});

	// WCAG 2.1.1 Keyboard - form fields are operable (can type in inputs)
	test('form fields inside popup are operable via keyboard', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/130-testing-form-in-popup.tsx')>(
			'design-system',
			'top-layer',
			'testing-form-in-popup',
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Dialog auto-focuses the first focusable element (form-input-1)
		await expect(page.getByTestId('form-input-1')).toBeFocused();
		await page.keyboard.type('Test name');

		await expect(page.getByTestId('form-input-1')).toHaveValue('Test name');
	});

	// WCAG 2.1.1 Keyboard - form can be submitted via keyboard
	test('form inside popup can be submitted via keyboard (Enter on submit button)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/130-testing-form-in-popup.tsx')>(
			'design-system',
			'top-layer',
			'testing-form-in-popup',
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Navigate to submit button and press Enter
		const submitButton = page.getByTestId('form-submit');
		await submitButton.focus();
		await page.keyboard.press('Enter');

		await expect(page.getByTestId('submitted')).toHaveText('yes');
	});

	// WCAG 2.1.2 No Keyboard Trap - Escape still works inside form fields
	test('Escape closes popup even when focus is on a form field', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/130-testing-form-in-popup.tsx')>(
			'design-system',
			'top-layer',
			'testing-form-in-popup',
		);

		const trigger = page.getByTestId('popup-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Dialog auto-focuses the first focusable element (form-input-1)
		await expect(page.getByTestId('form-input-1')).toBeFocused();

		// Escape should still close the popup
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
	});
});
