import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `DatePicker` and `TimePicker` running on the
 * top-layer path.
 *
 * Both components render a `role="combobox"` input as the trigger, but they
 * differ in the content of the popup they open:
 *
 * - `DatePicker`: renders its calendar grid in the Select menu.
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
	test('opening the calendar from the input keeps focus on the combobox', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const container = page.getByTestId('datepicker-1--container');
		const combobox = container.getByRole('combobox');
		const calendar = page.getByRole('grid');

		await expect(calendar).toBeHidden();
		await combobox.click();
		await expect(calendar).toBeVisible();
		await expect(combobox).toBeFocused();
	});
});

test.describe('TimePicker top-layer — initial focus matrix', () => {
	test('opening the listbox keeps focus on the combobox input (APG Combobox Pattern)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../../examples/30-time-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'time-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

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
