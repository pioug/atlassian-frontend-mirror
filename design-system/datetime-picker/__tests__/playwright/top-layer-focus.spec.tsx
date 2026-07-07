import { expect, test } from '@af/integration-testing';

/**
 * Date picker: focus contract on the top-layer code path.
 *
 * `DatePicker` opens a `role="dialog"` calendar popover anchored to a
 * react-select combobox `<input>`. Because the popover uses the dialog role
 * (not `menu` / `listbox`), the combobox carve-out documented in
 * `top-layer/notes/architecture/focus.md` does NOT apply: dialogs always
 * move focus into the popover (to the first focusable, here the
 * previous-year navigation button).
 *
 * The focus contract is therefore:
 *
 * 1. Open: focus moves to the first focusable inside the calendar dialog
 *    (the previous-year navigation button).
 * 2. Escape: the popover closes and focus is restored to the combobox input.
 * 3. Tab inside the open dialog: focus cycles through dialog focusables.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Date picker: top-layer focus contract', () => {
	test('initial focus: focus moves to the first focusable in the calendar dialog on open', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await page.getByTestId('date-picker--container').click();

		const calendar = page.getByRole('dialog', { name: 'calendar' });
		await expect(calendar).toBeVisible();

		const previousYearButton = page.getByTestId('date-picker--calendar--previous-year');
		await expect(previousYearButton).toBeFocused();
	});

	test('focus restoration: Escape closes the popover and focus returns to the combobox input', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox');
		await page.getByTestId('date-picker--container').click();

		const calendar = page.getByRole('dialog', { name: 'calendar' });
		await expect(calendar).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(combobox).toBeFocused();
	});

	test('focus movement: Tab moves focus and keeps it inside the calendar dialog', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await page.getByTestId('date-picker--container').click();

		const calendar = page.getByRole('dialog', { name: 'calendar' });
		await expect(calendar).toBeVisible();

		const previousYearButton = page.getByTestId('date-picker--calendar--previous-year');
		await expect(previousYearButton).toBeFocused();

		// `useFocusWrap` keeps Tab inside the dialog for role="dialog" popovers.
		await page.keyboard.press('Tab');
		await expect(previousYearButton).not.toBeFocused();

		// Focus must stay within the calendar dialog: for a role="dialog" popover
		// `useFocusWrap` intercepts Tab so focus never escapes to page content
		// behind the popover.
		const focusWithinCalendar = await calendar.evaluate(
			(calendarElement) =>
				document.activeElement !== null && calendarElement.contains(document.activeElement),
		);
		expect(focusWithinCalendar).toBe(true);
	});
});
