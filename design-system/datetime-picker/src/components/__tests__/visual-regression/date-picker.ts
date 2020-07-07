import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

declare var global: any;

const darkModeDatePicker =
  '[data-testid="date-picker-real-dark-mode--container"]';
const emotionJankDatePicker =
  '[data-testid="date-picker-theme-jank--container"]';

async function waitForCalendarPicker(page: any, theme: string) {
  await page.waitForSelector(
    `div[data-testid="date-picker-${theme}--popper--container"]`,
  );
  await page.waitForSelector(
    `div[data-testid="date-picker-${theme}--current-month-year"]`,
  );
  await page.waitForSelector(
    `tbody[data-testid="date-picker-${theme}--month"]`,
  );
  await page.waitForSelector(
    `td[data-testid="date-picker-${theme}--selected-day"]`,
  );
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
    await waitForCalendarPicker(page, 'real-dark-mode');

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
    await waitForCalendarPicker(page, 'theme-jank');

    // We take a picture of the whole page so it gets the border radius inside it.
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
