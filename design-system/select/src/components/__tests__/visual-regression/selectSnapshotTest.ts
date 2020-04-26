import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Select in a modal dialog example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'select-in-modal-dialog',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Single Select with disabled options example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'disabled',
      global.__BASEURL__,
    );
    const { page } = global;

    const selectSelector =
      '[data-test-id="vr-007"] .single-select .react-select__value-container';
    const selectMenuSelector = '.react-select__menu';
    await page.goto(url);
    await page.waitForSelector(selectSelector);
    await page.click(selectSelector);
    await page.waitForSelector(selectMenuSelector);

    const image = await takeElementScreenShot(page, selectMenuSelector);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Multi Select with disabled options example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'disabled',
      global.__BASEURL__,
    );
    const { page } = global;

    const selectSelector =
      '[data-test-id="vr-007"] .multi-select .react-select__value-container';
    const selectMenuSelector = '.react-select__menu';
    await page.goto(url);
    await page.waitForSelector(selectSelector);
    await page.click(selectSelector);
    await page.waitForSelector(selectMenuSelector);

    const image = await takeElementScreenShot(page, selectMenuSelector);
    expect(image).toMatchProdImageSnapshot();
  });
});
