import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";
const selectCheckbox = '.select__control';
const selectCheckboxMenu = '.select__menu';
const selectMenuItem = '.select__option:nth-child(4)';
const singleSelectMenuItem = '.react-select__option:nth-child(4)';
const selectValidation = 'label';

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
    await page.click(selectSelector);

    const image = await takeElementScreenShot(page, selectSelector);
    expect(image).toMatchProdImageSnapshot();

    await page.waitForSelector(singleSelectMenuItem);
    await page.click(singleSelectMenuItem);

    const image2 = await takeElementScreenShot(page, selectSelector);
    expect(image2).toMatchProdImageSnapshot();
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
    await loadPage(page, url);
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
    await loadPage(page, url);
    await page.waitForSelector(selectSelector);
    await page.click(selectSelector);
    await page.waitForSelector(selectMenuSelector);

    const image = await takeElementScreenShot(page, selectMenuSelector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Checkbox Select example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'checkbox-select',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    await page.waitForSelector(selectCheckbox);
    await page.click(selectCheckbox);

    await page.waitForSelector(selectCheckboxMenu);

    // item is selected
    await page.click(selectMenuItem);
    const image1 = await takeElementScreenShot(page, '#examples');
    expect(image1).toMatchProdImageSnapshot();

    // item is un-selected
    await page.click(selectMenuItem);
    const image2 = await takeElementScreenShot(page, '#examples');
    expect(image2).toMatchProdImageSnapshot();
  });

  it('Select validation example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'select',
      'validation',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    await page.waitForSelector(selectValidation);
    await page.click(selectValidation);

    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    const cityDiv = `#examples > form > div:nth-child(1)`;
    const image = await takeElementScreenShot(page, cityDiv);
    expect(image).toMatchProdImageSnapshot();
  });
});
