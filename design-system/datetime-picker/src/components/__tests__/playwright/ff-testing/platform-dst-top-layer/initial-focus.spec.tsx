import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `DatePicker` and `TimePicker` running on the
 * top-layer path.
 *
 * Both components render a `role="combobox"` input as the trigger, but they
 * differ in the role of the popup they open:
 *
 * - `DatePicker`: opens a `role="dialog"` calendar. The combobox carve-out
 *   in `top-layer/useInitialFocus` is intentionally scoped to `menu` and
 *   `listbox` popups (see `getInitialFocusTarget`), so a `dialog` popup
 *   still receives initial focus on its first focusable element (the
 *   calendar grid).
 *
 * - `TimePicker`: opens a `role="listbox"` of times. The WAI-ARIA APG
 *   Combobox Pattern carve-out applies, so DOM focus stays on the
 *   `role="combobox"` input and listbox navigation is proxied via
 *   `aria-activedescendant`.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(async ({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('DatePicker top-layer — initial focus matrix', () => {
	test('opening the calendar (role="dialog") focuses the first focusable inside the dialog, not the combobox input', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../../examples/10-date-picker-states.tsx')
		>('design-system', 'datetime-picker', 'date-picker-states', {
			featureFlag,
		});

		const container = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await expect(calendar).toBeHidden();
		await container.click();
		await expect(calendar).toBeVisible();

		// DatePicker calendar is role="dialog"; combobox carve-out does not
		// apply. Focus moves into the first focusable element of the dialog
		// (the calendar grid).
		const focused = page.locator(':focus');
		await expect(focused).toBeVisible();
		// The focused element must live inside the dialog rather than the
		// combobox input outside it.
		const focusedIsInsideDialog = await focused.evaluate((node) => {
			const dialog = document.querySelector('[role="dialog"][aria-label="calendar"]');
			return Boolean(dialog && dialog.contains(node));
		});
		expect(focusedIsInsideDialog).toBe(true);
	});
});

test.describe('TimePicker top-layer — initial focus matrix', () => {
	test('opening the listbox keeps focus on the combobox input (APG Combobox Pattern)', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../../examples/30-time-picker-states.tsx')
		>('design-system', 'datetime-picker', 'time-picker-states', {
			featureFlag,
		});

		// Open the first TimePicker on the page via its combobox input.
		const combobox = page.getByRole('combobox').first();
		await combobox.click();

		const listbox = page.locator('[role="listbox"]').first();
		await expect(listbox).toBeVisible();

		// The combobox controls the listbox; per APG, DOM focus must remain
		// on the textbox so type-ahead and navigation can be proxied via
		// aria-activedescendant.
		await expect(combobox).toBeFocused();
	});
});
