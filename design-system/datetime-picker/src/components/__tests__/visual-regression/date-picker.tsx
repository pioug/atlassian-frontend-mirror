import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

const darkModeDatePicker =
  '[data-testid="date-picker-real-dark-mode--container"]';
const emotionJankDatePicker =
  '[data-testid="date-picker-theme-jank--container"]';

async function waitForCalendarPicker(page: PuppeteerPage, testId: string) {
  await page.waitForSelector(`div[data-testid="${testId}--popper--container"]`);
  await page.waitForSelector(
    `div[data-testid="${testId}--calendar--current-month-year"]`,
  );
  await page.waitForSelector(`div[data-testid="${testId}--calendar--month"]`);
  await page.waitForSelector(
    `button[data-testid="${testId}--calendar--selected-day"]`,
  );
}

async function waitForThemedCalendarPicker(page: PuppeteerPage, theme: string) {
  await waitForCalendarPicker(page, `date-picker-${theme}`);
}

describe('date picker snapshots', () => {
  it('should snapshot date picker that has a correct theme provider', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'theme-fix',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(darkModeDatePicker);

    await page.click(darkModeDatePicker);
    await waitForThemedCalendarPicker(page, 'real-dark-mode');

    // We take a picture of the whole page so it gets the border radius inside it.
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should snapshot date picker that has a bad emotion theme provider', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'theme-fix',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(emotionJankDatePicker);

    await page.click(emotionJankDatePicker);
    await waitForThemedCalendarPicker(page, 'theme-jank');

    // We take a picture of the whole page so it gets the border radius inside it.
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should use the correct weekStartDay, when in a DatePicker', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'i18n',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const localizationInputSelector = 'input';
    await page.waitForSelector(localizationInputSelector);
    await page.type(localizationInputSelector, 'brasil');
    await page.keyboard.press('Enter');

    const weekStartDayInputSelector = 'input#week-start-day';
    await page.waitForSelector(weekStartDayInputSelector);
    await page.type(weekStartDayInputSelector, 'tuesday');
    await page.keyboard.press('Enter');

    const datePickerSelector = '[data-testid="date-picker--container"]';
    await page.waitForSelector(datePickerSelector);
    await page.click(datePickerSelector);

    await waitForCalendarPicker(page, 'date-picker');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should use the correct weekStartDay, when in a DateTimePicker', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'i18n',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const localizationInputSelector = 'input';
    await page.waitForSelector(localizationInputSelector);
    await page.type(localizationInputSelector, 'english');
    await page.keyboard.press('Enter');

    const weekStartDayInputSelector = 'input#week-start-day';
    await page.waitForSelector(weekStartDayInputSelector);
    await page.type(weekStartDayInputSelector, 'thursday');
    await page.keyboard.press('Enter');

    const datePickerSelector =
      '[data-testid="datetime-picker--datepicker--container"]';
    await page.waitForSelector(datePickerSelector);
    await page.click(datePickerSelector);

    await waitForCalendarPicker(page, 'datetime-picker--datepicker');

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
