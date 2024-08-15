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
	await page.visitExample('design-system', 'datetime-picker', 'i18n', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await page.locator(timePicker).first().click();
	const previousTime = await page.locator(timePickerValue).first().inputValue();
	await page.locator(timePickerInput).first().fill('1:45pm');
	await page.keyboard.press('Enter');
	const currentTime = await page.locator(timePickerValue).first().inputValue();
	expect(currentTime).toBe('13:45');
	expect(currentTime).not.toBe(previousTime);
});

test('[i18n] When a user types a year into the date input in DatetimePicker and subsequently hits enter, the value is correctly updated', async ({
	page,
}) => {
	await page.visitExample('design-system', 'datetime-picker', 'i18n', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await page.locator(dateTimePicker).first().click();
	await page.webdriverCompatUtils.fillMultiple(dateTimePickerInput, ['2', '0', '1', '6']);
	await page.keyboard.press('Enter');
	const newDate = await page.locator(dateTimePickerValue).first().inputValue();
	expect(newDate?.trim()).toMatch(/^2016/);
});
