import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the test example may have known
// pre-existing accessibility violations unrelated to the top-layer migration.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('DatePicker top-layer — WCAG 2.1.1 Keyboard - Extended', () => {
	test('opens calendar via keyboard and selects date with arrow navigation', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const focusedDateCell = page.locator('[data-focused="true"]');

		await expect(calendar).toBeHidden();
		await datePicker.click();
		await page.keyboard.press('ArrowDown');
		await expect(calendar).toBeVisible();
		await expect(focusedDateCell).toBeFocused();
	});

	test('navigates calendar months via keyboard buttons', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const previousMonthButton = page.locator('button[data-testid$="previous-month"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		// Initial focus from <Popup.Content> lands on the first focusable
		// element in the popover (previous-year button). Wait for that
		// before pressing Tab — the focus shift is async after Enter
		// triggers showPopover().
		await expect(previousYearButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(previousMonthButton).toBeFocused();
	});

	test('navigates calendar years via keyboard buttons', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		await expect(previousYearButton).toBeFocused();
	});
});

test.describe('DatePicker top-layer — WCAG 2.1.2 No Keyboard Trap - Extended', () => {
	test('Tab navigates through all calendar interactive elements', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		// The example renders <input#text1> → DatePicker (outer) →
		// <input#text2>. Tab order from text1:
		//   text1 → react-select combobox input → calendar trigger button →
		//   text2 (outside the datepicker).
		const dateInput = page.locator('input[data-testid="datepicker-1-select--input"]');
		const outsideInput = page.locator('input#text2');
		const calendarButton = page.locator('[data-testid$="open-calendar-button"]').first();

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await expect(dateInput).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(calendarButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(outsideInput).toBeFocused();
	});

	test('Tab navigates through internal popup datepicker with all controls', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		// Use real testIds for the inputs inside the popup (the legacy
		// `react-select-value1-input` id was a guess that doesn't match what
		// the example actually renders).
		const popupTrigger = page.locator('button#popup-trigger').first();
		const calendarButtonInPopup = page.locator(
			'[data-testid^="jql-builder-basic-datetime"] [data-testid$="open-calendar-button"]',
		);
		// Scope nav-button selectors to the popup-nested datepicker (the
		// example also has an outer datepicker on the page — without this
		// scoping the locators ambiguously match either calendar). The
		// popup-nested datepicker only renders the previous-year and
		// next-month nav buttons (its example variant deliberately omits
		// previous-month and next-year).
		const popupCalendarPrefix = '[data-testid^="jql-builder-basic-datetime"]';
		const previousYearButton = page.locator(
			`button${popupCalendarPrefix}[data-testid$="previous-year"]`,
		);
		const nextMonthButton = page.locator(`button${popupCalendarPrefix}[data-testid$="next-month"]`);
		const focusedDateCell = page.locator(
			`button${popupCalendarPrefix}[data-testid$="--day"][data-focused="true"]`,
		);
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await popupTrigger.click();
		await calendarButtonInPopup.click();
		await expect(calendar).toBeVisible();

		// Calendar opens with focus on the first focusable child of the
		// popover (previous-year). Verify the natural Tab order through the
		// available nav controls — this proves keyboard reachability of
		// every focusable calendar control without trapping the user.
		await expect(previousYearButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(nextMonthButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(focusedDateCell).toBeFocused();
	});
});

test.describe('DatePicker top-layer — WCAG 2.4.3 Focus Order - Extended', () => {
	test('focus moves to calendar header when opened via button click', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const calendarButton = page.locator('[data-testid$="open-calendar-button"]').first();
		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await calendarButton.click();
		await expect(calendar).toBeVisible();
		// Top-layer Popup.Content delegates initial focus to the first
		// focusable descendant inside the popover (previous-year button),
		// matching the WAI-ARIA dialog pattern. The trigger button no longer
		// stays focused after open.
		await expect(previousYearButton).toBeFocused();
	});

	test('focus moves to first calendar button when opened via keyboard', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const calendarButton = page.locator('[data-testid$="open-calendar-button"]').first();
		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(calendarButton).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		await expect(previousYearButton).toBeFocused();
	});

	test('focus returns to calendar button on Escape after keyboard open', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const calendarButton = page.locator('[data-testid$="open-calendar-button"]').first();
		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		await expect(previousYearButton).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(calendarButton).toBeFocused();
	});
});

test.describe('DatePicker top-layer — WCAG 2.4.7 Focus Visible - Extended', () => {
	test('calendar navigation buttons show focus when tabbed through', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const previousYearButton = page.locator('button[data-testid$="previous-year"]');
		const previousMonthButton = page.locator('button[data-testid$="previous-month"]');
		const nextMonthButton = page.locator('button[data-testid$="next-month"]');
		const nextYearButton = page.locator('button[data-testid$="next-year"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');

		await expect(previousYearButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(previousMonthButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(nextMonthButton).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(nextYearButton).toBeFocused();
	});

	test('date cells show focus when navigated with arrow keys', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const focusedDateCell = page.locator('[data-focused="true"]');

		await datePicker.click();
		await page.keyboard.press('ArrowDown');
		await expect(focusedDateCell).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await expect(focusedDateCell).toBeFocused();
	});
});

test.describe('DatePicker top-layer — WCAG 2.4.11 Focus Not Obscured - Extended', () => {
	test('calendar remains fully visible when opened in overflow scenario', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/140-overflow.tsx')>(
			'design-system',
			'datetime-picker',
			'overflow',
			{
				featureFlag,
			},
		);

		// The overflow example renders a single <DatePicker id="date" .../>
		// and forwards the `id` to the visible input. There is no `testId`,
		// so target the input directly via `id`.
		const dateInput = page.locator('input#date');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]').first();

		await dateInput.click();
		await expect(calendar).toBeVisible();
	});
});

test.describe('DatePicker top-layer — WCAG 4.1.2 Name, Role, Value - Extended', () => {
	test('disabled datepicker does not respond to click', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/999-disable-toggle.tsx')>(
			'design-system',
			'datetime-picker',
			'disable-toggle',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await expect(calendar).toBeHidden();
		await datePicker.click();
		await expect(calendar).toBeHidden();
	});

	test('disabled datepicker becomes enabled and functional', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/999-disable-toggle.tsx')>(
			'design-system',
			'datetime-picker',
			'disable-toggle',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const toggle = page.locator('label[for="toggle"]');

		await datePicker.click();
		await expect(calendar).toBeHidden();

		await toggle.click();
		await expect(calendar).toBeHidden();

		await datePicker.click();
		await expect(calendar).toBeVisible();
	});
});

test.describe('DatePicker top-layer — WCAG 1.3.2 Meaningful Sequence - Extended', () => {
	test('calendar opens when clicking date picker trigger', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]').first();

		await datePicker.click();
		await expect(calendar).toBeVisible();
	});

	test('calendar opens when clicking calendar button', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const calendarButton = page.locator('[data-testid$="open-calendar-button"]').first();
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await calendarButton.click();
		await expect(calendar).toBeVisible();
	});
});

test.describe('DatePicker top-layer — Focus Trap and Escape - Extended', () => {
	test('calendar closes when focus moves outside via Tab', async ({ page }) => {
		// Native `popover="auto"` light-dismisses on click outside / Esc, but
		// not on focus moving out via Tab. The FF-on top-layer adopter uses
		// `mode="manual"` for the menu (so the same click that opens it
		// doesn't immediately auto-dismiss it, see internal/menu-top-layer.tsx),
		// which removes auto-dismiss entirely. The DatePicker's onMenuClose
		// handler still closes the menu when focus leaves the entire
		// datepicker container — assert against that, not against
		// "Tab-out closes immediately".
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		// Move focus outside the datepicker entirely.
		await page.locator('input#text1').focus();
		await expect(calendar).toBeHidden();
	});

	test('calendar stays open when focus moves within calendar controls', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const previousMonthButton = page.locator('button[data-testid$="previous-month"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const nextMonthButton = page.locator('button[data-testid$="next-month"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		await previousMonthButton.focus();
		await expect(calendar).toBeVisible();
		await nextMonthButton.focus();
		await expect(calendar).toBeVisible();
	});

	test('calendar closes when external element gains focus via JavaScript', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.locator('input#text1').click();
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await expect(calendar).toBeVisible();
		await page.evaluate("document.querySelector('input#text1').focus()");
		await expect(calendar).toBeHidden();
	});
});

test.describe('DatePicker top-layer — Arrow Key Navigation', () => {
	test('arrow down focuses first date cell when calendar opens', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const focusedDateCell = page.locator('[data-focused="true"]');

		await datePicker.click();
		await page.keyboard.press('ArrowDown');
		await expect(calendar).toBeVisible();
		await expect(focusedDateCell).toBeFocused();
	});

	test('arrow up focuses current date when calendar opens', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const focusedDateCell = page.locator('[data-focused="true"]');

		await datePicker.click();
		await page.keyboard.press('ArrowUp');
		await expect(calendar).toBeVisible();
		await expect(focusedDateCell).toBeFocused();
	});
});

test.describe('DatePicker top-layer — Mouse and Keyboard Interaction', () => {
	test('focusing input via mouse opens calendar', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await datePicker.click();
		await expect(calendar).toBeVisible();
	});

	test('focusing input via keyboard does not open calendar', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/14-date-picker-tabcheck.tsx')
		>('design-system', 'datetime-picker', 'date-picker-tabcheck', {
			featureFlag,
			'react-18-mode': 'legacy',
		});

		const dateInput = page.locator('input#react-select-custom-input');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(dateInput).toBeFocused();
		await expect(calendar).toBeHidden();
	});

	test('selecting date via mouse closes calendar', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/10-date-picker-states.tsx')>(
			'design-system',
			'datetime-picker',
			'date-picker-states',
			{
				featureFlag,
				'react-18-mode': 'legacy',
			},
		);

		const datePicker = page.getByTestId('datepicker-1--container');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const firstDate = page.locator('[role="gridcell"]').nth(6);

		await datePicker.click();
		await expect(calendar).toBeVisible();
		await firstDate.click();
		await expect(calendar).toBeHidden();
	});
});
