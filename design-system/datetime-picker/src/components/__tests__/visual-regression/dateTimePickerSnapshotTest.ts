import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

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

    const image = await takeScreenShot(page, url);
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

    await takeScreenShot(page, url);
    await page.waitForSelector(timePickerSelector);
    await page.click(timePickerSelector);
    await page.waitForSelector(timePickerDropdownSelector);

    const image = await takeScreenShot(page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
