import {
  getExampleUrl,
  loadPage,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

const darkModeDatePicker =
  '[data-testid="date-picker-real-dark-mode--container"]';
const emotionJankDatePicker =
  '[data-testid="date-picker-theme-jank--container"]';

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

    // We take a picture of the whole page so it gets the border radius inside it.
    const image = await takeScreenShot(page, page);
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

    // We take a picture of the whole page so it gets the border radius inside it.
    const image = await takeScreenShot(page, page);
    expect(image).toMatchProdImageSnapshot();
  });
});
