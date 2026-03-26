import { expect, test } from '@af/integration-testing';

/**
 * Role-based initial focus tests.
 *
 * Verifies WCAG 2.4.3 Focus Order: when a popover opens, focus should
 * automatically move to the appropriate element based on the content's
 * ARIA role.
 */
test.describe('Popover - role-based initial focus', () => {
	// ── WCAG 2.4.3 Focus Order ──
	// Dialog popovers should auto-focus the first focusable element on open.
	test('role="dialog": auto-focuses first focusable element on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/123-testing-popover-initial-focus.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-initial-focus',
		);

		const trigger = page.getByTestId('dialog-trigger');
		await trigger.click();

		// First focusable element inside the dialog should receive focus
		await expect(page.getByTestId('dialog-first-button')).toBeFocused();
	});

	// ── WCAG 2.4.3 Focus Order ──
	// When autofocus attribute is present, it should be respected over
	// the default first-focusable behavior.
	test('role="dialog": autofocus attribute is respected when present', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/123-testing-popover-initial-focus.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-initial-focus',
		);

		const trigger = page.getByTestId('autofocus-trigger');
		await trigger.click();

		// The element with autofocus should receive focus, not the first button
		await expect(page.getByTestId('autofocus-target')).toBeFocused();
	});

	// ── WCAG 2.4.3 Focus Order ──
	// Menu popovers should auto-focus the first menu item on open.
	test('role="menu": auto-focuses first menu item on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/123-testing-popover-initial-focus.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-initial-focus',
		);

		const trigger = page.getByTestId('menu-trigger');
		await trigger.click();

		// First menu item should receive focus
		await expect(page.getByTestId('menu-first-item')).toBeFocused();
	});

	// ── WCAG 2.4.3 Focus Order ──
	// Tooltip popovers should NOT move focus — they are informational overlays.
	test('role="tooltip": does NOT move focus', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/123-testing-popover-initial-focus.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-initial-focus',
		);

		// Focus the external input first
		const externalInput = page.getByTestId('external-input');
		await externalInput.focus();
		await expect(externalInput).toBeFocused();

		// Hover the tooltip trigger to open the tooltip
		const trigger = page.getByTestId('tooltip-trigger');
		await trigger.hover();

		// Wait for tooltip to appear
		await expect(page.getByTestId('tooltip-popup')).toBeVisible();

		// Focus should NOT have moved — tooltip never moves focus
		// Focus should still be on the external input
		await expect(externalInput).toBeFocused();
	});
});
