import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Default select example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'single-select',
      global.__BASEURL__,
    );
    const { page } = global;

    const selectSelector = '.single-select';
    await loadPage(page, url);
    await page.waitForSelector(selectSelector);

    const image = await takeElementScreenShot(page, selectSelector);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Select in a modal dialog example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'select-in-modal-dialog',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);

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
      '.react-select-single-disabled-options__value-container';
    const selectMenuSelector = '.react-select-single-disabled-options__menu';
    await loadPage(page, url, true);
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
      '.react-select-multi-disabled-options__value-container';
    const selectMenuSelector = '.react-select-multi-disabled-options__menu';
    await loadPage(page, url, true);
    await page.waitForSelector(selectSelector);
    await page.click(selectSelector);
    await page.waitForSelector(selectMenuSelector);

    const image = await takeElementScreenShot(page, selectMenuSelector);
    expect(image).toMatchProdImageSnapshot();
  });
});
