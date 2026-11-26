import { expect, test } from '@af/integration-testing';

const datePicker = '[data-testid="datepicker-1--container"]';
const tabcheckOuterDatePicker = datePicker;
const tabcheckInnerDatePicker = '[data-testid^="jql-builder-basic-datetime"]';
const calendar = `[aria-label='calendar']`;
const previousYearButton = 'button[data-testid$="previous-year"]';
const previousMonthButton = 'button[data-testid$="previous-month"]';
const nextMonthButton = 'button[data-testid$="next-month"]';
const nextYearButton = 'button[data-testid$="next-year"]';
const date = '[role=gridcell]:nth-child(6)';
const focusedDate = '[data-focused="true"]';
const input = 'input#react-select-datepicker-1-input';
const tabcheckDatePickerInputOutsidePopup = 'input#react-select-custom-input';
const tabcheckDatePickerInputInsidePopup = 'input#react-select-value1-input';
const toggle = 'label[for="toggle"]';

// First one is the value, second one is the calendar button
const value = `${datePicker} > div:first-of-type`;
const tabcheckOuterCalendarButton = `${tabcheckOuterDatePicker} [data-testid$="open-calendar-button"]`;
const tabcheckInnerCalendarButton = `${tabcheckInnerDatePicker} [data-testid$="open-calendar-button"]`;

test(`When DatePicker is focused & backspace pressed, the input should be cleared and defaulted to the place holder date`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/10-date-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-states',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator(datePicker).first().click();
	await page.locator(date).first().click();
	await page.locator(input).first().fill('1/2/2001');
	await page.keyboard.press('Enter');
	await page.keyboard.press('Enter');
	const currentDate = await page.locator(datePicker).first().textContent();
	expect(currentDate?.trim()).toContain('1/2/2001');
	await page.keyboard.press('Backspace');
	const nextDate = await page.locator(datePicker).first().textContent();
	expect(nextDate?.trim()).toContain('2/18/1993');
});

test(`When choosing another day in a Datetime picker focused, the date should be updated to the new value`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/10-date-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-states',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator(datePicker).first().click();
	await page.locator(date).first().click();
	const previousDate = await page.locator(value).first().textContent();
	await page.locator(datePicker).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('Enter');

	await expect(page.locator(value)).not.toHaveText(previousDate!);
});

test(`Clicking a disabled datepicker should not toggle its internal open state, resulting in it being open once enabled`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/999-disable-toggle.tsx')>(
		'design-system',
		'datetime-picker',
		'disable-toggle',
		{
			'react-18-mode': 'modern',
		},
	);

	/* Clicking on the disabled date picker does not open it */
	await page.locator(datePicker).first().click();
	await expect(page.locator(calendar)).toBeHidden();

	/* Un-disabling the date picker after its been clicked does not open it */
	await page.locator(toggle).first().click();
	await expect(page.locator(calendar)).toBeHidden();

	/* After un-disabling the date picker can be opened by clicking */
	await page.locator(datePicker).first().click();
	await expect(page.locator(calendar)).toBeVisible();
});

test(`Should tab through all interactive elements inside datepicker`, async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('input#text1').first().click();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup)).toBeVisible();
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckOuterCalendarButton).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator('input#text2').first()).toBeFocused();
});

test(`Should tab from input component to datepicker to next input in popup`, async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('button#popup-trigger').first().click();
	await page.locator('input#text3').first().click();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputInsidePopup)).toBeVisible();
	await expect(page.locator(tabcheckDatePickerInputInsidePopup).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckInnerCalendarButton).first()).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator(previousYearButton).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(previousMonthButton).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(nextMonthButton).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(nextYearButton).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(focusedDate).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckInnerCalendarButton).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator('input#text4').first()).toBeFocused();
});

test(`When DatePicker is focused & another element is focused outside of DatePicker, the calendar should close`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('input#text1').first().click();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup)).toBeVisible();
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckOuterCalendarButton).first()).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator(calendar)).toBeVisible();
	await page.evaluate("document.querySelector('input#text1').focus()");
	await expect(page.locator(calendar)).toBeHidden();
});

test(`When DatePicker is focused & another element is focused inside of DatePicker, the calendar should not close when calendar button is present`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('input#text1').first().click();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup)).toBeVisible();
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckOuterCalendarButton).first()).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator(calendar)).toBeVisible();
	await page.evaluate(`document.querySelector('${previousMonthButton}').focus()`);
	await expect(page.locator(calendar)).toBeVisible();
});

test(`When DatePicker is opened should set focus to current date on ArrowDown keypress`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/10-date-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-states',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator(datePicker).first().click();
	await page.keyboard.press('ArrowDown');
	await expect(page.locator(calendar)).toBeVisible();
	await expect(page.locator(focusedDate).first()).toBeFocused();
});

test(`When DatePicker is opened should set focus to current date on ArrowUp keypress`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/10-date-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-states',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator(datePicker).first().click();
	await page.keyboard.press('ArrowUp');
	await expect(page.locator(calendar)).toBeVisible();
	await expect(page.locator(focusedDate).first()).toBeFocused();
});

test(`should open calendar when focused via mouse`, async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/10-date-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-states',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator(datePicker).first().click();
	await expect(page.locator(calendar)).toBeVisible();
	await expect(page.locator(input).first()).toBeFocused();
});

test(`When focusing on input via mouse, calendar picker should open`, async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator(tabcheckOuterDatePicker).first().click();
	await expect(page.locator(calendar).first()).toBeVisible();
});

test(`When focusing on input via keyboard, calendar picker should open`, async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('input#text1').focus();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup).first()).toBeFocused();
	await expect(page.locator(calendar)).toBeHidden();
});

test(`When clicking the open calendar button, focus should stay on trigger`, async ({ page }) => {
	// Legacy only: on top layer a click moves focus into the calendar, which
	// ff-testing/platform-dst-top-layer/date-picker-extended.spec.tsx covers.
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			featureFlag: 'platform-dst-top-layer=false',
			'react-18-mode': 'modern',
		},
	);
	await page.locator(tabcheckOuterCalendarButton).click();
	await expect(page.locator(calendar)).toBeVisible();
	await expect(page.locator(tabcheckOuterCalendarButton)).toBeFocused();
});

test(`When activating the open calendar button using the keyboard, focus should move to previous month button`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('input#text1').first().click();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup)).toBeVisible();
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckOuterCalendarButton)).toBeFocused();
	await expect(page.locator(calendar)).toBeHidden();
	// Opens calendar picker
	await page.keyboard.press('Enter');
	await expect(page.locator(tabcheckOuterCalendarButton)).not.toBeFocused();
	await expect(page.locator(previousYearButton)).toBeFocused();
});

test(`When activating the open calendar button using the keyboard and the calendar is closed using escape, focus should move back to trigger`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/14-date-picker-tabcheck.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-tabcheck',
		{
			'react-18-mode': 'modern',
		},
	);
	await page.locator('input#text1').first().click();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup)).toBeVisible();
	await expect(page.locator(tabcheckDatePickerInputOutsidePopup).first()).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.locator(tabcheckOuterCalendarButton)).toBeFocused();
	await expect(page.locator(calendar)).toBeHidden();
	// Opens calendar picker
	await page.keyboard.press('Enter');
	await expect(page.locator(tabcheckOuterCalendarButton)).not.toBeFocused();
	await expect(page.locator(previousYearButton)).toBeFocused();
	// Close calendar picker
	await page.keyboard.press('Escape');
	await expect(page.locator(tabcheckOuterCalendarButton)).toBeFocused();
});
