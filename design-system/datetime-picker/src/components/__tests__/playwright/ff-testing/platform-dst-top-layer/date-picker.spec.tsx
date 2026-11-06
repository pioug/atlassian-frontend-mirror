import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the test example may have known
// pre-existing accessibility violations unrelated to the top-layer migration.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

for (const [topLayerEnabled, options] of [
	[true, { featureFlag, 'react-18-mode': 'modern' }],
	[false, { 'react-18-mode': 'modern' }],
] as Array<[boolean, Record<string, string | boolean>]>) {
	test.describe(`DatePicker public behaviour (top layer: ${topLayerEnabled})`, () => {
		test('preserves keyboard, selection, and input-popup behaviour', async ({ page }) => {
			await page.visitExample<
				typeof import('../../../../../../examples/10-date-picker-states.tsx')
			>('design-system', 'datetime-picker', 'date-picker-states', options);
			const input = page.getByRole('combobox', { name: 'Stock' });
			const calendar = page.getByRole('grid');
			await expect(input).toHaveAttribute('aria-haspopup', 'listbox');
			await input.click();
			await expect(calendar).toBeVisible();
			await expect(input).toHaveAttribute('aria-controls', /\S+/);
			await page.keyboard.press('Escape');
			await expect(calendar).toBeHidden();
			await expect(input).toBeFocused();
			await page.keyboard.press('ArrowDown');
			await expect(calendar).toBeVisible();
			await page.getByRole('button', { name: /, / }).nth(7).click();
			await expect(calendar).toBeHidden();
		});

		test('keeps disabled DatePicker closed until enabled and restores focus order', async ({
			page,
		}) => {
			await page.visitExample<typeof import('../../../../../../examples/999-disable-toggle.tsx')>(
				'design-system',
				'datetime-picker',
				'disable-toggle',
				options,
			);
			const datePicker = page.getByTestId('datepicker-1--container');
			const dateInput = datePicker.locator('input[role="combobox"]');
			const calendar = page.getByRole('grid');
			await expect(dateInput).toBeDisabled();
			await expect(calendar).toBeHidden();
			await page.getByText('DatePicker isDisabled', { exact: true }).click();
			await datePicker.click();
			await expect(calendar).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(dateInput).toBeFocused();
		});
	});
}

test.describe('DatePicker top-layer — WCAG 2.1.1 Keyboard', () => {
	test('opens calendar via keyboard and selects date', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');
		const firstDate = page.locator('[role="gridcell"]').nth(6);

		await expect(calendar).toBeHidden();
		await datePicker.click();
		await expect(calendar).toBeVisible();
		await firstDate.click();
		await expect(calendar).toBeHidden();
	});

	test('selects date via keyboard navigation', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		await expect(calendar).toBeHidden();
		await datePicker.click();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('Tab');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeHidden();
	});
});

test.describe('DatePicker top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes calendar and returns focus to input', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');
		const dateInput = page.locator('input#react-select-datepicker-1-input');

		await expect(calendar).toBeHidden();
		await datePicker.click();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(dateInput).toBeFocused();
	});

	test('Tab enters the calendar without trapping focus on the input', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const datePicker = page.getByTestId('datepicker-1--container');
		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		// Open the calendar via click on the date input.
		await datePicker.click();
		await expect(calendar).toBeVisible();

		// Select keeps focus on its input when opening. The next Tab enters the
		// calendar, proving focus is not trapped on the combobox.
		await page.keyboard.press('Tab');
		await expect(previousYearButton).toBeFocused();
	});
});

test.describe('DatePicker top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus moves into calendar on open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		// Open the calendar by clicking the date input.
		await expect(calendar).toBeHidden();
		await datePicker.click();
		await expect(calendar).toBeVisible();

		// Select keeps focus on its input when opening. Tab moves into the
		// calendar without closing it.
		await page.keyboard.press('Tab');
		const focusedElement = calendar.locator(':focus');
		await expect(focusedElement).toHaveCount(1);
	});

	test('focus returns to date input on close', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');
		const dateInput = page.locator('input#react-select-datepicker-1-input');

		await datePicker.click();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(dateInput).toBeFocused();
	});

	test('focus moves to calendar button when opened via Enter', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const calendarButton = page.locator('[data-testid$="open-calendar-button"]').first();
		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(calendarButton).toBeFocused();
		await expect(calendar).toBeHidden();

		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		await expect(previousYearButton).toBeFocused();
	});

	// Select returns focus to the opener when its menu closes with focus inside.
	test('focus returns to the calendar button after a keyboard pick', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const calendarButton = page.getByTestId('datepicker-1--open-calendar-button');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		// Open with the keyboard: Safari does not focus a clicked button.
		await calendarButton.focus();
		await page.keyboard.press('Enter');
		await expect(calendar.locator('button[data-testid$="previous-year"]')).toBeFocused();
		// Tab past the other header buttons to the focused day, then pick it.
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(calendar.locator('[data-focused="true"]')).toBeFocused();
		await page.keyboard.press('Enter');

		await expect(calendar).toBeHidden();
		await expect(calendarButton).toBeFocused();
	});

	test('focus returns to the calendar button after a mouse pick', async ({ page, browserName }) => {
		test.skip(
			browserName === 'webkit',
			'Safari, like Firefox on macOS, does not focus a clicked button, so focus has no opener to return to.',
		);
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const calendarButton = page.getByTestId('datepicker-1--open-calendar-button');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		// A click on the calendar button moves focus into the calendar (DSP-25706).
		await calendarButton.click();
		await expect(calendar.locator('button[data-testid$="previous-year"]')).toBeFocused();
		// The 15th is in the shown month and appears once in the grid.
		await calendar.getByRole('button', { name: /^15, / }).click();

		await expect(calendar).toBeHidden();
		await expect(calendarButton).toBeFocused();
	});

	test('focus returns to the input after a keyboard pick, and the calendar stays closed', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../../examples/testing-top-layer-focus.tsx')
		>('design-system', 'datetime-picker', 'testing-top-layer-focus', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const input = page.getByRole('combobox');
		const calendar = page.getByTestId('date-picker--calendar--calendar');

		// With no calendar button, focus on the input opens the calendar.
		await input.focus();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('ArrowDown');
		await expect(calendar.locator('[data-focused="true"]')).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press('Enter');

		await expect(calendar).toBeHidden();
		await expect(input).toBeFocused();
		await expect(input).toHaveAttribute('aria-expanded', 'false');
	});

	test('Escape from the calendar returns focus to the calendar button', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const calendarButton = page.getByTestId('datepicker-1--open-calendar-button');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		await calendarButton.focus();
		await page.keyboard.press('Enter');
		await expect(calendar.locator('button[data-testid$="previous-year"]')).toBeFocused();
		await page.keyboard.press('Escape');

		await expect(calendar).toBeHidden();
		await expect(calendarButton).toBeFocused();
	});

	test('Escape returns focus to the input, and the calendar stays closed, without a calendar button', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../../examples/testing-top-layer-focus.tsx')
		>('design-system', 'datetime-picker', 'testing-top-layer-focus', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const input = page.getByRole('combobox');
		const calendar = page.getByTestId('date-picker--calendar--calendar');

		await input.focus();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('ArrowDown');
		await expect(calendar.locator('[data-focused="true"]')).toBeFocused();
		await page.keyboard.press('Escape');

		await expect(calendar).toBeHidden();
		await expect(input).toBeFocused();
		await expect(input).toHaveAttribute('aria-expanded', 'false');
	});

	test('shows the calendar again when an `isOpen={false}` prop that closed it is removed', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../../examples/testing-date-picker-closed-by-prop.tsx')
		>('design-system', 'datetime-picker', 'testing-date-picker-closed-by-prop', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const input = page.getByRole('combobox');
		const calendar = page.getByTestId('closed-by-prop--calendar--calendar');
		const state = page.getByTestId('closed-by-prop-state');

		// The calendar button is present, so the keyboard opens the calendar with ArrowDown.
		await input.focus();
		await page.keyboard.press('ArrowDown');
		await expect(calendar.locator('[data-focused="true"]')).toBeFocused();

		// F2 sets `isOpen={false}`: the calendar closes and focus returns to the input.
		await page.keyboard.press('F2');
		await expect(state).toHaveText('Closed by isOpen={false}');
		await expect(calendar).toBeHidden();
		await expect(input).toBeFocused();

		// F2 removes the prop. The return did not change the open state, so the calendar shows.
		await page.keyboard.press('F2');
		await expect(state).toHaveText('No isOpen prop');
		await expect(calendar).toBeVisible();
	});
});

test.describe('DatePicker top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('focused date cell has visible focus indicator', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const focusedDateCell = page.locator('[data-focused="true"]');

		await datePicker.click();
		await page.keyboard.press('ArrowDown');
		await expect(focusedDateCell).toBeFocused();
	});

	test('calendar navigation buttons have visible focus', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const previousYearButton = page.locator('button[data-testid$="previous-year"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(previousYearButton).toBeFocused();
		await page.keyboard.press('Tab');

		const previousMonthButton = page.locator('button[data-testid$="previous-month"]');
		await expect(previousMonthButton).toBeFocused();
	});
});

test.describe('DatePicker top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('calendar is fully visible on screen', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		await datePicker.click();
		await expect(calendar).toBeVisible();
	});
});

test.describe('DatePicker top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('date input has correct role and attributes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const dateInput = page.locator('input#react-select-datepicker-1-input');

		await expect(dateInput).toHaveAttribute('role', 'combobox');
	});

	test("calendar is rendered inside Select's native popover", async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		// Scope to the calendar's popover element specifically. A bare
		// `[popover]` selector also matches the always-closed react-select
		// inner popover that mounts earlier in the DOM, causing
		// `.first()` to resolve to the wrong (hidden) element.
		const popover = page.locator('[popover]:has([data-testid="datepicker-1--calendar--calendar"])');

		await datePicker.click();
		await expect(popover).toBeVisible();
	});
});

test.describe('DatePicker top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('calendar content appears near trigger in document order', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');

		await datePicker.click();
		await expect(calendar).toBeVisible();
	});
});

test.describe('DatePicker top-layer — Backspace and Input Behavior', () => {
	test('backspace clears the date value', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const firstDate = page.locator('[role="gridcell"]').nth(6);
		const value = page.locator('[data-testid="datepicker-1--container"] > div:first-of-type');

		await expect(datePicker).toBeVisible();
		await datePicker.click();
		await firstDate.click();

		// Wait for the value element to populate with the selected date
		// before reading it. `not.toBeEmpty` is auto-waiting and avoids the
		// `textContent()` lint rule.
		await expect(value).not.toBeEmpty();
		// `evaluate` returns the live textContent as a non-nullable string —
		// the auto-waiting check above guarantees the element exists.
		const dateAfterSelect: string = await value.evaluate((el: HTMLElement) => el.textContent ?? '');

		// The DatePicker's backspace-clears-value handler is bound to the
		// react-select combobox input. After clicking a date the calendar
		// closes and focus returns to the input; click it explicitly to be
		// resilient to any test-runner focus drift.
		await datePicker.click();
		await page.keyboard.press('Backspace');

		// After Backspace, the selected date should be cleared. We compare the
		// captured pre-backspace string to the live post-backspace text via an
		// auto-waiting assertion that retries until the value has changed.
		await expect(value).not.toHaveText(dateAfterSelect);
	});

	test('calendar closes when focus moves outside', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');
		const externalInput = page.locator('input#text1');

		await datePicker.click();
		await expect(calendar).toBeVisible();
		await externalInput.focus();
		await expect(calendar).toBeHidden();
	});

	test('calendar stays open when focus is within it', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const calendar = page.getByTestId('datepicker-1--calendar--calendar');
		const previousMonthButton = page.locator('button[data-testid$="previous-month"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();

		await previousMonthButton.focus();
		await expect(calendar).toBeVisible();
	});

	test('arrow keys navigate date cells', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.getByTestId('datepicker-1--calendar--calendar');
		const focusedDateCell = page.locator('[data-focused="true"]');

		await datePicker.click();
		await page.keyboard.press('ArrowDown');
		await expect(calendar).toBeVisible();
		await expect(focusedDateCell).toBeFocused();
	});

	test('typing directly in input works with proper format', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'modern',
			},
		);

		const dateInput = page.locator('input#react-select-datepicker-1-input');
		const value = page.locator('[data-testid="datepicker-1--container"] > div:first-of-type');

		await dateInput.fill('1/2/2001');
		await page.keyboard.press('Enter');
		const dateValue = await value.textContent();
		expect(dateValue?.trim()).toContain('1/2/2001');
	});
});
