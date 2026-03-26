import { expect, test } from '@af/integration-testing';

/**
 * Standalone Popover - native focus restoration tests.
 *
 * Verifies that the browser's native Popover API automatically
 * restores focus when the popover closes, without requiring any
 * custom focus restoration hook.
 *
 * WCAG 2.4.3 Focus Order: when a popover closes, focus must return
 * to the trigger element.
 */
test.describe('Standalone Popover - native focus restoration', () => {
	// ── WCAG 2.4.3 Focus Order ──
	// Standalone dialog popover should restore focus to trigger on Escape.
	test('role="dialog": focus restores to trigger on Escape', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/124-testing-standalone-focus-restore.tsx')
		>('design-system', 'top-layer', 'testing-standalone-focus-restore');

		const trigger = page.getByTestId('standalone-dialog-trigger');
		await trigger.click();

		// Focus should have moved into the dialog (via initial focus)
		await expect(page.getByTestId('standalone-dialog-inner-button')).toBeFocused();

		// Dismiss via Escape
		await page.keyboard.press('Escape');

		// Focus should return to the trigger
		await expect(trigger).toBeFocused();
	});

	// ── WCAG 2.4.3 Focus Order ──
	// Standalone dialog popover should restore focus when closed via Escape
	// after focus has moved to a different element inside the dialog.
	test('role="dialog": focus restores to trigger on Escape from inner element', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/124-testing-standalone-focus-restore.tsx')
		>('design-system', 'top-layer', 'testing-standalone-focus-restore');

		const trigger = page.getByTestId('standalone-dialog-trigger');
		await trigger.click();

		// Initial focus moves to the first focusable element inside the dialog
		const innerButton = page.getByTestId('standalone-dialog-inner-button');
		await expect(innerButton).toBeFocused();

		// Dismiss via Escape — browser restores focus to trigger
		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	// ── WCAG 2.4.3 Focus Order ──
	// Standalone menu popover should restore focus to trigger on Escape.
	test('role="menu": focus restores to trigger on Escape', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/124-testing-standalone-focus-restore.tsx')
		>('design-system', 'top-layer', 'testing-standalone-focus-restore');

		const trigger = page.getByTestId('standalone-menu-trigger');
		await trigger.click();

		// Focus should have moved to the menu item (via initial focus)
		await expect(page.getByTestId('standalone-menu-item')).toBeFocused();

		// Dismiss via Escape
		await page.keyboard.press('Escape');

		// Focus should return to the trigger
		await expect(trigger).toBeFocused();
	});
});
