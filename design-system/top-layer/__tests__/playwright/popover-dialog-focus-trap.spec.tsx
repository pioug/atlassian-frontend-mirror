/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Popover dialog focus trap — Tab wrapping', () => {
	// WCAG 2.4.3 Focus Order: Tab should cycle within role="dialog" popovers.
	test('Tab wraps forward from last to first focusable element', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();

		// Focus should move into the dialog (via onOpenChange + getFirstFocusable)
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('dialog-button-b')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('dialog-button-c')).toBeFocused();

		// After the last focusable element, Tab should wrap back to the first.
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order: Shift+Tab should cycle backward within role="dialog" popovers.
	test('Shift+Tab wraps backward from first to last focusable element', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();

		// Focus starts on Button A (first focusable)
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();

		// Shift+Tab from first should wrap to last
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('dialog-button-c')).toBeFocused();

		// Continue backward
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('dialog-button-b')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order: Focus must not escape to background content.
	test('Tab does not escape the dialog popover to background content', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();

		// Tab through all elements multiple times to verify no escape
		for (let i = 0; i < 9; i++) {
			await page.keyboard.press('Tab');
		}

		// Focus should still be inside the dialog
		const focusedInDialog = await page.evaluate(() => {
			const dialog = document.querySelector('[role="dialog"]');
			return dialog?.contains(document.activeElement) ?? false;
		});
		expect(focusedInDialog).toBe(true);

		// Background buttons should never have received focus
		const outsideBeforeFocused = await page.evaluate(() => {
			const el = document.querySelector('[data-testid="outside-before"]');
			return document.activeElement === el;
		});
		expect(outsideBeforeFocused).toBe(false);

		const outsideAfterFocused = await page.evaluate(() => {
			const el = document.querySelector('[data-testid="outside-after"]');
			return document.activeElement === el;
		});
		expect(outsideAfterFocused).toBe(false);
	});
});

test.describe('Popover dialog focus trap — dismiss behavior preserved', () => {
	// WCAG 2.1.2 No Keyboard Trap: Escape should always dismiss the popover.
	test('Escape closes the dialog popover', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();

		await page.keyboard.press('Escape');

		// Popover should be dismissed
		const dialogVisible = await page.evaluate(() => {
			const dialog = document.querySelector('[role="dialog"]');
			return dialog?.matches(':popover-open') ?? false;
		});
		expect(dialogVisible).toBe(false);
	});

	// Light dismiss: clicking outside closes the popover.
	test('clicking outside closes the dialog popover', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();

		// Click on an element outside the popover
		await page.getByTestId('outside-before').click();

		const dialogVisible = await page.evaluate(() => {
			const dialog = document.querySelector('[role="dialog"]');
			return dialog?.matches(':popover-open') ?? false;
		});
		expect(dialogVisible).toBe(false);
	});

	// Focus should return to trigger after dismiss.
	test('focus returns to trigger after Escape', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		const trigger = page.getByTestId('dialog-trigger');
		await trigger.click();
		await expect(page.getByTestId('dialog-button-a')).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(trigger).toBeFocused();
	});
});

test.describe('Popover non-dialog role — no focus trap', () => {
	// WCAG 2.1.2 No Keyboard Trap: non-dialog roles should NOT trap Tab.
	test('Tab moves focus out of a non-dialog popover (role="note")', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/121-testing-popover-dialog-focus-trap.tsx')
		>('design-system', 'top-layer', 'testing-popover-dialog-focus-trap');

		const trigger = page.getByTestId('note-trigger');
		await trigger.click();

		// Tab into the popover content
		await page.keyboard.press('Tab');

		// Tab should eventually move past the popover content
		// (non-dialog roles do not trap focus)
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Focus should have moved beyond the note popover's buttons
		const focusedInNote = await page.evaluate(() => {
			// Find the note popover (the one without role="dialog")
			const noteButtons = [
				document.querySelector('[data-testid="note-button-a"]'),
				document.querySelector('[data-testid="note-button-b"]'),
			];
			return noteButtons.includes(document.activeElement);
		});
		expect(focusedInNote).toBe(false);
	});
});
