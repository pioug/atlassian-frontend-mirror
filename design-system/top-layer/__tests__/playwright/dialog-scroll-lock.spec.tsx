/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('DialogScrollLock', () => {
	test('should prevent body scrolling when dialog is open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-dialog-scroll-lock.tsx')>(
			'design-system',
			'top-layer',
			'testing-dialog-scroll-lock',
		);

		// Reset body overflow to a known scrollable value so the test does not
		// depend on whatever the example page or a prior test leaked into the
		// document.
		await page.evaluate(() => {
			document.body.style.overflow = '';
		});

		// Body should be scrollable before dialog opens
		const overflowBefore = await page.evaluate(() => document.body.style.overflow);
		expect(overflowBefore).not.toBe('hidden');

		// Open dialog
		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		// Body should NOT be scrollable while dialog is open
		const overflowDuring = await page.evaluate(() => document.body.style.overflow);
		expect(overflowDuring).toBe('hidden');

		// Close dialog via Escape — dialog auto-focuses first focusable element
		const closeBtn = page.locator('dialog button[aria-label="Close"]');
		await expect(closeBtn).toBeFocused();
		await closeBtn.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('dialog-body')).toBeHidden();

		// Body should be scrollable again after dialog closes.
		// `DialogScrollLock` releases the lock synchronously on the dialog's
		// `close` event, so the value is observable immediately after the
		// dialog is hidden.
		const overflowAfter = await page.evaluate(() => document.body.style.overflow);
		expect(overflowAfter).not.toBe('hidden');
	});

	test('should restore original overflow value on close', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-dialog-scroll-lock.tsx')>(
			'design-system',
			'top-layer',
			'testing-dialog-scroll-lock',
		);

		// Set a custom overflow value before opening
		await page.evaluate(() => {
			document.body.style.overflow = 'scroll';
		});

		// Open dialog
		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		// Body overflow should be hidden
		const overflowDuring = await page.evaluate(() => document.body.style.overflow);
		expect(overflowDuring).toBe('hidden');

		// Close dialog — dialog auto-focuses first focusable element
		const closeBtn2 = page.locator('dialog button[aria-label="Close"]');
		await expect(closeBtn2).toBeFocused();
		await closeBtn2.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('dialog-body')).toBeHidden();

		// Should restore original 'scroll' value, not empty string.
		const overflowAfter = await page.evaluate(() => document.body.style.overflow);
		expect(overflowAfter).toBe('scroll');
	});
});
