/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Focus - returnFocusRef when trigger is removed', () => {
	// Category 5: Focus Management
	// WCAG 2.4.3 Focus Order: when the trigger element is removed from the DOM
	// after the popup closes, we document the current behavior.

	test('popup and trigger are removed from the DOM after the close action', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/129-testing-focus-return-ref.tsx')>(
			'design-system',
			'top-layer',
			'testing-focus-return-ref',
		);

		// Verify trigger exists initially
		await expect(page.getByTestId('trigger-visible')).toHaveText('yes');
		await expect(page.getByTestId('popup-trigger')).toBeVisible();

		// Open the popup
		await page.getByTestId('popup-trigger').click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Remove trigger (which also unmounts the Popup)
		await page.getByTestId('remove-trigger-button').click();

		// Trigger should be gone
		await expect(page.getByTestId('trigger-visible')).toHaveText('no');

		// Fallback target should still be in the DOM and accessible
		await expect(page.getByTestId('fallback-target')).toBeVisible();
	});
});
