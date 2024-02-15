import { expect, test } from '@af/integration-testing';

const timePicker = '[data-testid="time-picker--container"]';
const timePickerInput = '.time-picker--select__input';
const timePickerValue = '.time-picker--select__value-container > div';

const dateTimePicker = '[data-testid="datetime-picker--datepicker--container"]';
const dateTimePickerInput = '.date-picker--select__input';
const dateTimePickerValue = '.date-picker--select__single-value';

test('[i18n] When entering a new time in Timepicker Editable, the time should be updated to the new value', async ({
  page,
}) => {
  await page.visitExample('design-system', 'datetime-picker', 'i18n');
  await page.locator(timePicker).first().click();
  const previousTime = await page
    .locator(timePickerValue)
    .first()
    .textContent();
  await page.locator(timePickerInput).first().fill('1:45pm');
  await page.keyboard.press('Enter');
  const currentTime = await page.locator(timePickerValue).first().textContent();
  expect(currentTime).toBe('13:45');
  expect(currentTime).not.toBe(previousTime);
});

test('[i18n] When a user types a year into the date input in DatetimePicker and subsequently hits enter, the value is correctly updated', async ({
  page,
}) => {
  await page.visitExample('design-system', 'datetime-picker', 'i18n');
  await page.locator(dateTimePicker).first().click();
  await page.webdriverCompatUtils.fillMultiple(dateTimePickerInput, [
    '2',
    '0',
    '1',
    '6',
  ]);
  await page.keyboard.press('Enter');
  const newDate = await page.locator(dateTimePickerValue).first().textContent();
  expect(newDate?.trim()).toMatch(/^2016/);
});
