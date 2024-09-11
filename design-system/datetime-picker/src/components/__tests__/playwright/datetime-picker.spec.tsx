import { expect, test } from '@af/integration-testing';

const dateTimePickerDate = '[data-testid="dateTimePicker--datepicker--container"]';
const date = `[role=gridcell]:nth-child(6)`;
const dateTimePickerTime = '[data-testid="dateTimePicker--timepicker--container"]';

test('When DateTimePicker is focused & backspace pressed, the date value should be cleared but the time value should not be affected', async ({
	page,
}) => {
	await page.visitExample('design-system', 'datetime-picker', 'basic');
	await page.locator(dateTimePickerDate).first().click();
	await page.locator(date).first().click();
	const previousDate = await page.locator(dateTimePickerDate).first().textContent();
	const previousTime = page.locator(dateTimePickerTime).first();
	await page.keyboard.press('Backspace');
	const afterDate = page.locator(dateTimePickerDate).first();
	const afterTime = await page.locator(dateTimePickerTime).first().textContent();
	await expect(afterDate).not.toHaveText(previousDate!);
	await expect(previousTime).toHaveText(afterTime!);
});
