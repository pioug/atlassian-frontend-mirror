import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `Popup` running on the top-layer path.
 *
 * `top-layer/useInitialFocus` is responsible for moving DOM focus into the
 * popup the moment it becomes visible, based on the popup's ARIA role and
 * the WAI-ARIA APG Combobox Pattern. This file exercises every branch of
 * that policy through the public `Popup` API so that any regression in
 * top-layer is caught at the adopter level.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(async ({ skipAxeCheck }) => {
	// The example renders multiple popup permutations on a single page for
	// test convenience; some permutations trip pre-existing axe rules that
	// are unrelated to focus behavior.
	skipAxeCheck();
});

test.describe('Popup top-layer — initial focus matrix', () => {
	test('role="dialog" popup focuses the first focusable element inside the popup', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/97-testing-initial-focus-matrix.tsx')
		>('design-system', 'popup', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('dialog-popup-trigger').click();

		await expect(page.getByTestId('dialog-popup-content')).toBeVisible();
		await expect(page.getByTestId('dialog-popup-first-button')).toBeFocused();
	});

	test('popup with no `role` keeps focus on the trigger', async ({ page }) => {
		/**
		 * Restores the legacy `Popup` contract on the top-layer adapter:
		 * when a consumer omits `role`, the popup is left role-less and
		 * no role-based initial focus is applied. Focus stays on the
		 * trigger, which keeps parity with the legacy `Popup`
		 * implementation that real consumers (gate off) experience.
		 */
		await page.visitExample<
			typeof import('../../../../../examples/97-testing-initial-focus-matrix.tsx')
		>('design-system', 'popup', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		const trigger = page.getByTestId('no-role-popup-trigger');
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(page.getByTestId('no-role-popup-content')).toBeVisible();
		await expect(trigger).toBeFocused();
	});

	test('combobox trigger that controls the popup retains focus on the textbox', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/97-testing-initial-focus-matrix.tsx')
		>('design-system', 'popup', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		const input = page.getByTestId('combobox-controls-input');
		await input.focus();

		await expect(page.getByTestId('combobox-controls-popup-content')).toBeVisible();

		// Focus must remain on the combobox; navigation through the listbox
		// is the consumer's responsibility via aria-activedescendant.
		await expect(input).toBeFocused();
		await expect(page.getByTestId('combobox-controls-option-1')).not.toBeFocused();
	});

	test('unrelated combobox elsewhere does not block focus from moving into the listbox popup', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/97-testing-initial-focus-matrix.tsx')
		>('design-system', 'popup', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		// Focus an unrelated combobox first (its aria-controls points at a
		// different element), then open the listbox popup via a button. The
		// combobox carve-out must not apply.
		await page.getByTestId('unrelated-combobox-input').focus();
		await page.getByTestId('unrelated-combobox-popup-trigger').click();

		await expect(page.getByTestId('unrelated-combobox-popup-content')).toBeVisible();
		await expect(page.getByTestId('unrelated-combobox-option-1')).toBeFocused();
	});

	test('external combobox (react-select pattern) controlling the popup retains focus on the textbox', async ({
		page,
	}) => {
		// Regression: when a combobox `<input>` is rendered OUTSIDE the
		// popup element (as in `react-select`-style menus) but its
		// `aria-controls` references the popup id, initial focus must
		// stay on the textbox. Moving focus into the listbox would blur
		// the textbox and cause libraries like react-select to close the
		// menu on the same interaction that opened it.
		await page.visitExample<
			typeof import('../../../../../examples/97-testing-initial-focus-matrix.tsx')
		>('design-system', 'popup', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		const input = page.getByTestId('external-combobox-input');
		await input.focus();

		await expect(page.getByTestId('external-combobox-popup-content')).toBeVisible();

		await expect(input).toBeFocused();
		await expect(page.getByTestId('external-combobox-option-1')).not.toBeFocused();
	});
});
