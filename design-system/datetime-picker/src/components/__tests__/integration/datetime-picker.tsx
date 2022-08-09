import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlDateTimePicker = getExampleUrl(
  'design-system',
  'datetime-picker',
  'basic',
);

const dateTimePickerDate =
  '[data-testid="dateTimePicker--datepicker--container"]';

const dateTimePickerDateMenu = `${dateTimePickerDate} [aria-label="calendar"]`;

const date = `[role=gridcell]:nth-child(6)`;

const dateTimePickerTime =
  '[data-testid="dateTimePicker--timepicker--container"]';

BrowserTestCase(
  'When DateTimePicker is focused & backspace pressed, the date value should be cleared but the time value should not be affected',
  { skip: ['safari'] }, // Safari driver has issues
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlDateTimePicker);
    await page.click(dateTimePickerDate);
    await page.waitForSelector(dateTimePickerDateMenu);
    await page.click(date);
    await page.waitForSelector(dateTimePickerDate);

    const previousDate = await page.getText(dateTimePickerDate);

    const previousTime = await page.getText(dateTimePickerTime);

    await page.keys('Backspace');
    await page.waitForSelector(dateTimePickerDate);

    const afterDate = await page.getText(dateTimePickerDate);

    const afterTime = await page.getText(dateTimePickerTime);

    expect(afterDate).not.toBe(previousDate);
    expect(previousTime).toBe(afterTime);

    await page.checkConsoleErrors();
  },
);
