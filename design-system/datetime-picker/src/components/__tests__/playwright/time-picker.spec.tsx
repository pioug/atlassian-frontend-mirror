import { expect, test } from '@af/integration-testing';

const timePicker = '[data-testid="timePicker--container"]';
const input = 'input#react-select-timepicker-input';
const value = `${timePicker} > div > div > div > div:first-child`;

test('When entering a new time in Timepicker, the time should be updated to the new value', async ({
  page,
}) => {
  await page.visitExample('design-system', 'datetime-picker', 'times');
  await page.locator(timePicker).first().click();
  const previousTime = await page.locator(value).first().textContent();
  await page.locator(input).first().fill('10:15');
  await page.keyboard.press('Enter');
  const currentTime = await page.locator(value).first().textContent();
  expect(currentTime).toBe('10:15 AM');
  expect(currentTime).not.toBe(previousTime);
});

test('Invalid times in TimePicker should be ignored', async ({ page }) => {
  await page.visitExample('design-system', 'datetime-picker', 'times');
  await page.locator(timePicker).first().click();
  await page.webdriverCompatUtils.fillMultiple(input, ['a', 's', 'd']);
  await page.keyboard.press('Tab');
  await expect(page.locator(value).first()).toHaveText('1:00 PM');
});
