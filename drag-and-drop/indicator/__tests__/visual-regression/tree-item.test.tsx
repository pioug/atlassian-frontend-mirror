import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('drop indicator with a terminal', () => {
  test('appearances', async () => {
    const { page } = global;
    const url = getExampleUrl(
      'drag-and-drop',
      'indicator',
      'experimental-tree-item',
      global.__BASEURL__,
      'light',
    );
    const selector = `[data-testid="layout--appearance"]`;

    await loadPage(page, url);

    await page.waitForSelector(selector);
    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
