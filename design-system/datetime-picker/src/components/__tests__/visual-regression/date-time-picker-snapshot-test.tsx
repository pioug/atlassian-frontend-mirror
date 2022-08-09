import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

const datePickerSelector = '#react-select-datepicker-1-input';
const timePickerSelector = '[data-testid="timepicker-1--container"]';
const timePickerDropdownSelector =
  '[data-testid="timepicker-1--popper--container"]';

describe('Snapshot Test', () => {
  it('Appearance example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.setViewport({ width: 800, height: 1100 });

    await loadPage(page, url);
    await page.waitForSelector(datePickerSelector);
    await page.waitForSelector(timePickerSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Appearance example should match production example - single opened time picker', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'time-picker-states',
      global.__BASEURL__,
    );

    const { page } = global;

    await page.setViewport({ width: 800, height: 800 });

    await loadPage(page, url);
    await page.waitForSelector(timePickerSelector);
    await page.click(timePickerSelector);
    await page.waitForSelector(timePickerDropdownSelector);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Appearance example should match production example - with and without values + isDisabled', async () => {
    const url = getExampleUrl(
      'design-system',
      'datetime-picker',
      'datetime-picker-states',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.setViewport({ width: 800, height: 1100 });

    await loadPage(page, url);
    await waitForElementCount(page, 'label', 6);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
