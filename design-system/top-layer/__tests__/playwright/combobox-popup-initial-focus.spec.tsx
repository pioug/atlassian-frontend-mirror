import { expect, test } from '@af/integration-testing';

/**
 * WAI-ARIA APG Combobox Pattern initial focus tests.
 *
 * When a `[role="combobox"]` controls a popup (via `aria-controls`), DOM
 * focus must remain on the textbox when the popup opens. Navigation through
 * the popup items is proxied via the combobox (typically using
 * `aria-activedescendant`), never via DOM focus movement.
 *
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
test.describe('Popover - combobox-controlled popup initial focus', () => {
	test('role="menu" controlled by a combobox: focus stays on the textbox', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		const input = page.getByTestId('combobox-menu-input');
		await input.focus();

		await expect(input).toBeFocused();
		await expect(page.getByTestId('combobox-menu-item-1')).toBeVisible();
		// Combobox pattern: focus must remain on the textbox even though
		// the menu popup is open and contains focusable menu items.
		await expect(input).toBeFocused();
	});

	test('role="listbox" controlled by a combobox: focus stays on the textbox', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		const input = page.getByTestId('combobox-listbox-input');
		await input.focus();

		await expect(input).toBeFocused();
		await expect(page.getByTestId('combobox-listbox-option-2')).toBeVisible();
		// Combobox pattern: focus must remain on the textbox even though the
		// listbox contains an aria-selected="true" option that would otherwise
		// receive initial focus.
		await expect(input).toBeFocused();
	});

	test('role="menu" opened by a plain button still receives initial focus on first item', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		const trigger = page.getByTestId('plain-menu-trigger');
		await trigger.click();

		// Non-combobox triggers continue to follow the menu APG initial-focus
		// behavior: first menu item receives focus on open.
		await expect(page.getByTestId('plain-menu-item-1')).toBeFocused();
	});

	test('role="dialog" controlled by a combobox outside it: focus stays on the combobox', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		const input = page.getByTestId('combobox-dialog-trigger');
		await input.focus();

		await expect(page.getByTestId('combobox-dialog-first-button')).toBeVisible();
		await expect(input).toBeFocused();
	});

	test('role="alertdialog" controlled by a combobox outside it: focus stays on the combobox', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		const input = page.getByTestId('combobox-alertdialog-trigger');
		await input.focus();

		await expect(page.getByTestId('combobox-alertdialog-first-button')).toBeVisible();
		await expect(input).toBeFocused();
	});

	test('role="dialog" controlled by a plain text input outside it: focus stays on the input', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		const input = page.getByTestId('text-input-dialog-trigger');
		await input.focus();

		await expect(page.getByTestId('text-input-dialog-first-button')).toBeVisible();
		await expect(input).toBeFocused();
	});

	test('role="dialog" controlled by a checkbox: focus moves into the dialog', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		await page.getByTestId('checkbox-dialog-trigger').focus();

		// A checkbox is not text-like, so `aria-controls` does not keep focus on it.
		await expect(page.getByTestId('checkbox-dialog-first-button')).toBeFocused();
	});

	test('role="dialog" opened by a plain button: focus moves into the dialog', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		await page.getByTestId('button-dialog-trigger').click();

		await expect(page.getByTestId('button-dialog-first-button')).toBeFocused();
	});

	test('role="dialog" that contains its own combobox: focus moves into the dialog', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-combobox-popup-initial-focus.tsx')
		>('design-system', 'top-layer', 'testing-combobox-popup-initial-focus');

		await page.getByTestId('dialog-own-combobox-trigger').click();

		// The inner combobox focuses itself on mount, but it controls its own
		// listbox, not the dialog. The dialog still moves focus to its first
		// focusable element.
		await expect(page.getByTestId('dialog-own-combobox-first-button')).toBeFocused();
	});
});
