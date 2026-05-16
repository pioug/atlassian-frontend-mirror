// Will be removed in scope of https://product-fabric.atlassian.net/browse/DSP-19675

import { expect, test } from '@af/integration-testing';

const timePicker = '[data-testid="time-picker--container"]';
const timePickerInput = '#react-select-timepicker-1--input';
const timePickerValue = '[data-testid="time-picker--input"]';

const dateTimePicker = '[data-testid="datetime-picker--datepicker--container"]';
const dateTimePickerInput = '#datetimepicker-1';
const dateTimePickerValue = '[data-testid="datetime-picker--datepicker--input"]';

test('[i18n] When entering a new time in Timepicker Editable, the time should be updated to the new value', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../../../examples/01-i18n.tsx')>(
		'design-system',
		'datetime-picker',
		'i18n',
		{
			featureFlag: 'platform_dst_popup-disable-focuslock',
		},
	);
	await page.locator(timePicker).first().click();
	const previousTime = await page.locator(timePickerValue).first().inputValue();
	await page.locator(timePickerInput).first().fill('1:45pm');
	await page.keyboard.press('Enter');
	const currentTime = page.locator(timePickerValue).first();
	await expect(currentTime).toHaveValue('13:45');
	expect(currentTime).not.toBe(previousTime);
});

test.fixme('[i18n] When a user types a year into the date input in DatetimePicker and subsequently hits enter, the value is correctly updated', async ({
	page,
}) => {
	// Skipped: this test exercises the interim
	// `platform_dst_popup-disable-focuslock` FF, not the
	// `platform-dst-top-layer` migration FF. The interim FF and its
	// underlying fixed-layer code path are scheduled to be removed in
	// scope of DSP-19675 (see file header), so we do not invest in
	// fixing it. The equivalent behaviour is covered by the
	// `platform-dst-top-layer` `time-picker.spec.tsx` and
	// `datetime-picker.spec.tsx` suites, which are fully green.
	await page.visitExample<typeof import('../../../../../../examples/01-i18n.tsx')>(
		'design-system',
		'datetime-picker',
		'i18n',
		{
			featureFlag: 'platform_dst_popup-disable-focuslock',
		},
	);
	await page.locator(dateTimePicker).first().click();
	await page.webdriverCompatUtils.fillMultiple(dateTimePickerInput, ['2', '0', '1', '6']);
	await page.keyboard.press('Enter');
	const newDate = await page.locator(dateTimePickerValue).first().inputValue();
	expect(newDate?.trim()).toMatch(/^2016/);
});
