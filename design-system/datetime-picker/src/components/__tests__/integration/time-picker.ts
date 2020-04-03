import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const url = getExampleUrl('core', 'datetime-picker', 'times');

const timePicker = '[data-testid="timePicker--container"]';
const menu = '.timepicker-select__menu-list';
const input = 'input#react-select-timepicker-input';
const value = `${timePicker} > div > div > div > div:first-child`;

BrowserTestCase(
  'When entering a new time in Timepicker, the time should be updated to the new value',
  { skip: ['ie'] }, // IE has an issue AK-5570, AK-5492
  async (client: any) => {
    const page = new Page(client);

    await page.goto(url);
    await page.waitForSelector(timePicker);
    await page.click(timePicker);
    await page.waitForSelector(menu);

    const previousTime = await page.getText(value);

    await page.type(input, ['10:15']);
    await page.waitForSelector(menu);
    await page.keys('Enter');
    await page.waitForSelector(value);

    const currentTime = await page.getText(value);

    expect(currentTime).toEqual('10:15 AM');
    expect(currentTime).not.toBe(previousTime);

    await page.checkConsoleErrors();
  },
);

BrowserTestCase(
  'Invalid times in TimePicker should be ignored',
  { skip: ['ie'] }, // IE has an issue AK-5570, AK-5492
  async (client: any) => {
    const page = new Page(client);

    await page.goto(url);
    await page.waitForSelector(timePicker);
    await page.click(timePicker);
    await page.waitForSelector(menu);
    await page.type(input, ['a', 's', 'd']);
    await page.keys('Tab');

    await page.waitForSelector(value);

    expect(await page.getText(value)).toEqual('1:00 PM');
    await page.checkConsoleErrors();
  },
);
