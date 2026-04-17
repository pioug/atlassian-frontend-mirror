/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Stacking - hint popover does not close auto popover', () => {
	// Category 3: Stacking and Nesting
	// Verifies that a tooltip (mode="hint") does NOT close an open popup (mode="auto").
	// This catches the bug where popover="hint" falls back to "auto" and causes
	// unwanted mutual exclusivity closes.

	test('mode="hint" popover does not close mode="auto" popover', async ({ page, browserName }) => {
		// popover="hint" is not yet supported in all browsers.
		// In browsers that don't support it, the fallback behavior may differ.
		// This test validates the behavior in browsers that support it.
		test.fixme(
			browserName === 'webkit',
			'popover="hint" is not supported in webkit — fallback behavior differs',
		);

		await page.visitExample<typeof import('../../examples/131-testing-hint-no-close-auto.tsx')>(
			'design-system',
			'top-layer',
			'testing-hint-no-close-auto',
		);

		// Open the auto popover
		await page.getByTestId('auto-trigger').click();
		await expect(page.getByTestId('auto-popover')).toBeVisible();

		// Click the hint trigger inside the auto popover to open the hint
		await page.getByTestId('hint-trigger').click();

		// Wait for hint to appear
		await expect(page.getByTestId('hint-popover')).toBeVisible();

		// The auto popover should STILL be open — hint must not close it
		await expect(page.getByTestId('auto-popover')).toBeVisible();
	});

	test('hint popover closes without affecting auto popover', async ({ page, browserName }) => {
		test.fixme(
			browserName === 'webkit',
			'popover="hint" is not supported in webkit — fallback behavior differs',
		);

		await page.visitExample<typeof import('../../examples/131-testing-hint-no-close-auto.tsx')>(
			'design-system',
			'top-layer',
			'testing-hint-no-close-auto',
		);

		// Open the auto popover
		await page.getByTestId('auto-trigger').click();
		await expect(page.getByTestId('auto-popover')).toBeVisible();

		// Open the hint popover
		await page.getByTestId('hint-trigger').click();
		await expect(page.getByTestId('hint-popover')).toBeVisible();

		// Press Escape — hint-popover is visible; trial click on visible hint content
		// (hint-trigger was clicked to open but focus behaviour varies after hint opens)
		await page.getByTestId('hint-popover').click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('hint-popover')).toBeHidden();

		// The auto popover should still be open
		await expect(page.getByTestId('auto-popover')).toBeVisible();
	});
});
