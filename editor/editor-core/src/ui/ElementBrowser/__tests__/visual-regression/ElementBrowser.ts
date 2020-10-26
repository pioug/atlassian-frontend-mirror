import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
  waitForLoadedImageElements,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('ElementBrowser', () => {
  it('should match ElementBrowser snapshot', async () => {
    const url = getExampleUrl(
      'editor',
      'editor-core',
      'element-browser',
      global.__BASEURL__,
    );
    const { page } = global;
    const selector = "[data-testid='element-browser']";

    await loadPage(page, url);
    await waitForElementCount(page, selector, 1);
    await waitForLoadedImageElements(page, 6000);

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
