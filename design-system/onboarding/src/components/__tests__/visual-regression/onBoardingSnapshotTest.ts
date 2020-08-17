import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Modal Basic example should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'modal-basic',
      __BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    await waitForLoadedImageElements(page, 5000);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Modal Basic example with primary button on right should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'modal-basic',
      __BASEURL__,
    );
    const toggle = '#togglePrimaryButtonPosition';

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(toggle);
    await page.click(openModalBtn);
    await waitForLoadedImageElements(page, 5000);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Modal Wide Button Text example should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'onboarding',
      'modal-wide-button-text',
      __BASEURL__,
    );

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    await waitForLoadedImageElements(page, 5000);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });
});
