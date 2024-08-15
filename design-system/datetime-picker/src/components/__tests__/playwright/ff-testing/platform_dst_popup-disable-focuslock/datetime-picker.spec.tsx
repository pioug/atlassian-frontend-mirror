// Will be removed in scope of https://product-fabric.atlassian.net/browse/DSP-19675

import { expect, test } from '@af/integration-testing';

const dateTimePickerDate = '[data-testid="dateTimePicker--datepicker--container"]';
const date = `[role=gridcell]:nth-child(6)`;
const dateTimePickerTime = '[data-testid="dateTimePicker--timepicker--container"]';

test('When DateTimePicker is focused & backspace pressed, the date value should be cleared but the time value should not be affected', async ({
	page,
}) => {
	await page.visitExample('design-system', 'datetime-picker', 'basic', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await page.locator(dateTimePickerDate).first().click();
	await page.locator(date).first().click();
	const previousDate = await page.locator(dateTimePickerDate).first().textContent();
	const previousTime = await page.locator(dateTimePickerTime).first().textContent();
	await page.keyboard.press('Backspace');
	const afterDate = await page.locator(dateTimePickerDate).first().textContent();
	const afterTime = await page.locator(dateTimePickerTime).first().textContent();
	expect(afterDate).not.toBe(previousDate);
	expect(previousTime).toBe(afterTime);
});
