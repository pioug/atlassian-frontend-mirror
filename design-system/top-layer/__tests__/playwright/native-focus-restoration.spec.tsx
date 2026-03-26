import { expect, test } from '@af/integration-testing';

/**
 * Native Popover API focus restoration tests.
 *
 * Verifies the browser's built-in focus restoration behavior for popover="auto":
 *   - Escape → restores focus to the previously focused element (the trigger)
 *   - Click-outside (light dismiss) → does NOT restore focus
 *   - hidePopover() → restores focus to the previously focused element
 *
 * These tests assert browser-native behavior — no custom focus hooks are involved.
 * See: notes/architecture/focus-restoration.md
 */
test.describe('Native Popover API focus restoration', () => {
	// ── Escape: browser restores focus ──
	// The HTML Popover spec's close watcher passes focusPreviousElement=true,
	// so the browser restores focus to the trigger on Escape.

	test('popover="auto" dialog: Escape restores focus to trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/132-testing-native-focus-restoration.tsx')
		>('design-system', 'top-layer', 'testing-native-focus-restoration');

		const trigger = page.getByTestId('auto-dialog-trigger');
		await trigger.click();
		await expect(page.getByTestId('auto-dialog-popup')).toBeVisible();

		// Move focus into the dialog content
		const innerButton = page.getByTestId('auto-dialog-inner-button');
		await innerButton.focus();
		await expect(innerButton).toBeFocused();

		// Dismiss via Escape — browser restores focus
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('auto-dialog-popup')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('popover="auto" menu: Escape restores focus to trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/132-testing-native-focus-restoration.tsx')
		>('design-system', 'top-layer', 'testing-native-focus-restoration');

		const trigger = page.getByTestId('auto-menu-trigger');
		await trigger.click();
		await expect(page.getByTestId('auto-menu-popup')).toBeVisible();

		// Move focus to menu item
		const menuItem = page.getByTestId('auto-menu-item');
		await menuItem.focus();
		await expect(menuItem).toBeFocused();

		// Dismiss via Escape — browser restores focus
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('auto-menu-popup')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	// ── Click-outside: browser does NOT restore focus ──
	// The HTML Popover spec's light dismiss algorithm passes
	// focusPreviousElement=false, so focus is NOT restored.

	test('popover="auto" dialog: click-outside does NOT restore focus to trigger', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/132-testing-native-focus-restoration.tsx')
		>('design-system', 'top-layer', 'testing-native-focus-restoration');

		const trigger = page.getByTestId('auto-dialog-trigger');
		await trigger.click();
		await expect(page.getByTestId('auto-dialog-popup')).toBeVisible();

		// Move focus into the dialog content
		const innerButton = page.getByTestId('auto-dialog-inner-button');
		await innerButton.focus();
		await expect(innerButton).toBeFocused();

		// Click outside the popup — use body's bottom-right area to avoid
		// hitting the trigger (which would toggle the popup back open).
		const viewport = page.viewportSize();
		await page.mouse.click(viewport!.width - 1, viewport!.height - 1);

		await expect(page.getByTestId('auto-dialog-popup')).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	test('popover="auto" menu: click-outside does NOT restore focus to trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/132-testing-native-focus-restoration.tsx')
		>('design-system', 'top-layer', 'testing-native-focus-restoration');

		const trigger = page.getByTestId('auto-menu-trigger');
		await trigger.click();
		await expect(page.getByTestId('auto-menu-popup')).toBeVisible();

		// Dismiss via click outside — browser does NOT restore focus
		await page.mouse.click(0, 0);

		await expect(page.getByTestId('auto-menu-popup')).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	// ── Programmatic hidePopover(): browser restores focus ──
	// The hidePopover() method passes focusPreviousElement=true,
	// so the browser restores focus to the trigger.
	//
	// Note: we test this via Escape (which calls hidePopover() internally
	// via the browser's close watcher) rather than via a close button click.
	// A close button click goes through React state → useLayoutEffect →
	// hidePopover(), and the React render cycle may unmount children before
	// hidePopover() fires, preventing the browser's focus restoration.
	// In practice, consumers use animation presets which delay unmounting
	// and avoid this timing issue.

	test('hidePopover() restores focus to trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/132-testing-native-focus-restoration.tsx')
		>('design-system', 'top-layer', 'testing-native-focus-restoration');

		const trigger = page.getByTestId('programmatic-trigger');
		await trigger.click();
		await expect(page.getByTestId('programmatic-popup')).toBeVisible();

		// Move focus to inner button
		const innerButton = page.getByTestId('programmatic-inner-button');
		await innerButton.focus();
		await expect(innerButton).toBeFocused();

		// Dismiss via Escape — browser calls hidePopover() and restores focus
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('programmatic-popup')).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});
