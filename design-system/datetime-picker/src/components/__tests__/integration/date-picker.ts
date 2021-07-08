import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlDateTimePicker = getExampleUrl(
  'design-system',
  'datetime-picker',
  'date-picker-states',
);
/* Css used for the test */
const datePicker = '[data-testid="datePicker--container"]';
const menu = `[aria-label="calendar"]`;
const date = '[role=gridcell]:nth-child(6)';
const input = 'input#react-select-datepicker-input';
const toggle = 'label[for="toggle"]';

const value = `${datePicker} > div`;

BrowserTestCase(
  'When DatePicker is focused & backspace pressed, the input should be cleared and defaulted to the place holder date',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlDateTimePicker);
    await page.click(datePicker);

    await page.waitForSelector(menu);
    await page.click(date);

    await page.waitForSelector(input);
    await page.type(input, ['1/2/2001']);

    await page.waitForSelector(input);
    // As Safari, FF and IE may have some issues with Enter keys, I replaced by the uni code.
    // Enter is pressed twice to avoid inconsitent tests results while browser loading.
    await page.keys('\uE007');

    await page.keys('\uE007');

    await page.waitForSelector(datePicker);

    const currentDate = await page.getText(datePicker);
    // There is small issue in IE11, Safari where there is a blob of text added.
    expect(currentDate.trim()).toContain('1/2/2001');

    await page.keys(['\uE003']);

    await page.waitForSelector(input);

    const nextDate = await page.getText(datePicker);
    // There is small issue in IE11, Safari where there is a blob of text added.
    expect(nextDate.trim()).toContain('2/18/1993');

    await page.checkConsoleErrors();
  },
);

BrowserTestCase(
  'When choosing another day in a Datetime picker focused, the date should be updated to the new value',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlDateTimePicker);
    await page.click(datePicker);
    await page.waitForSelector(menu);
    await page.click(date);

    const previousDate = await page.getText(value);

    await page.click(datePicker);
    await page.keys(['ArrowLeft']);
    await page.keys(['ArrowLeft']);
    await page.keys(['Enter']);

    expect(await page.getText(value)).not.toBe(previousDate);
    await page.checkConsoleErrors();
  },
);

BrowserTestCase(
  'Clicking a disabled datepicker should not toggle its internal open state, resulting in it being open once enabled',
  {},
  async (client: any) => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'disable-toggle',
    );

    const page = new Page(client);

    await page.goto(url);

    /* Clicking on the disabled date picker does not open it */
    await page.click(datePicker);
    expect(await page.waitForSelector(menu, {}, true)).toBe(true);

    /* Un-disabling the date picker after its been clicked does not open it */
    await page.click(toggle);
    expect(await page.waitForSelector(menu, {}, true)).toBe(true);

    /* After un-disabling the date picker can be opened by clicking */
    await page.click(datePicker);
    expect(await page.waitForSelector(menu)).toBe(true);
  },
);
