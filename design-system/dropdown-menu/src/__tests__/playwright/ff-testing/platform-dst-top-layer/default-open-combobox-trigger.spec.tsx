import { expect, test } from '@af/integration-testing';

/**
 * Regression test for the `AddWorkItemEdit` (capacity planning) pattern:
 * `DropdownMenu` opens via `defaultOpen` on mount, and the trigger renders a
 * `role="combobox"` `<input autoFocus>` that must keep focus so the user can
 * type to filter.
 *
 * Before the combobox carve-out in `top-layer/useInitialFocus`, the menu
 * popover would steal focus from the textbox and place it on the first
 * `DropdownItem` because `role="menu"` opened via the top-layer path always
 * focuses the first focusable item.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(async ({ skipAxeCheck }) => {
	// Same rationale as the sibling top-layer specs: opening the menu puts
	// the trigger button into its selected state, which trips a platform-wide
	// design-token contrast violation that is tracked separately.
	skipAxeCheck();
});

test.describe('DropdownMenu top-layer — combobox trigger keeps focus on defaultOpen', () => {
	test('autoFocus combobox input retains focus when the menu opens via defaultOpen', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/96-testing-default-open-combobox-trigger.tsx')
		>('design-system', 'dropdown-menu', 'testing-default-open-combobox-trigger', {
			featureFlag,
		});

		const input = page.getByTestId('combobox-default-open-input');
		const firstItem = page.getByTestId('combobox-default-open-item-1');
		const openState = page.getByTestId('combobox-default-open-state');

		// Sanity: the menu opened on mount and the first menu item is visible.
		await expect(openState).toHaveText('open');
		await expect(firstItem).toBeVisible();

		// The combobox textbox must hold focus, not the first menu item.
		await expect(input).toBeFocused();
		await expect(firstItem).not.toBeFocused();
	});

	test('typing into the combobox does not snap focus onto a menu item', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/96-testing-default-open-combobox-trigger.tsx')
		>('design-system', 'dropdown-menu', 'testing-default-open-combobox-trigger', {
			featureFlag,
		});

		const input = page.getByTestId('combobox-default-open-input');

		await expect(input).toBeFocused();

		await page.keyboard.type('paid');

		// The textbox should still own focus after typing, and the value
		// should have been written to it (not swallowed by an item that
		// stole focus during the open transition).
		await expect(input).toBeFocused();
		await expect(input).toHaveValue('paid');
	});
});
