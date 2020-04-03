import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlI18nDateTimePicker = getExampleUrl('core', 'datetime-picker', 'i18n');

const timePicker = '[data-testid="timePicker--container"]';
const timePickerInput = 'input#react-select-timepicker-4-input';
const timePickerMenu = '.timepicker-select__menu-list';
const timePickerValue = `${timePicker} > div > div > div > div:first-child`;

const calendarMenu = '[aria-label="calendar"]';
const dateTimePicker = '[data-testid="dateTimePicker--datepicker--container"]';
const dateTimePickerInput = 'input#react-select-datetimepicker-1-input';
const dateTimePickerValue = `${dateTimePicker} > div > div > div > div`;

BrowserTestCase(
  '[i18n] When entering a new time in Timepicker Editable, the time should be updated to the new value',
  { skip: ['ie'] }, // IE has an issue AK-5570, AK-5492
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlI18nDateTimePicker);
    await page.waitForSelector(timePicker);
    await page.click(timePicker);
    await page.waitForSelector(timePickerMenu);

    const previousTime = await page.getText(timePickerValue);

    await page.type(timePickerInput, ['1:45pm']);
    await page.waitForSelector(timePickerMenu);
    await page.keys('Enter');
    await page.waitForSelector(timePickerValue);

    const currentTime = await page.getText(timePickerValue);

    expect(currentTime).not.toBe(previousTime);
    expect(currentTime).toEqual('13:45');

    await page.checkConsoleErrors();
  },
);

BrowserTestCase(
  '[i18n] When a user types a year into the date input in DatetimePicker and subsequently hits enter, the value is correctly updated',
  { skip: ['safari', 'ie'] }, // Safari and IE drivers have issues - AK-5570, AK-5492
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlI18nDateTimePicker);
    await page.click(dateTimePicker);
    await page.waitForSelector(calendarMenu);
    await page.type(dateTimePickerInput, ['2', '0', '1', '6']);
    await page.keys('Enter');
    await page.waitForSelector(dateTimePickerValue);

    const newDate = await page.getText(dateTimePickerValue);

    expect(newDate.trim()).toMatch(/^2016/);
    await page.checkConsoleErrors();
  },
);
