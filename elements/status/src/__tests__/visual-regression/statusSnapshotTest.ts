import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  let page: PuppeteerPage;
  beforeEach(() => {
    page = global.page;
  });
  it('simple status', async () => {
    const url = getExampleUrl(
      'elements',
      'status',
      'simple-status',
      global.__BASEURL__,
    );
    await loadPage(page, url);
    const image = await takeElementScreenShot(page, '#container');

    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME: This test was automatically skipped due to failure on 03/06/2023: https://product-fabric.atlassian.net/browse/ED-18196
  it.skip('status picker', async () => {
    const url = getExampleUrl(
      'elements',
      'status',
      'status-picker',
      global.__BASEURL__,
    );

    await loadPage(page, url);

    const buttons = await page.$$('button');
    for (const button of buttons) {
      await button.click();
      const image = await takeElementScreenShot(page, '#container');
      expect(image).toMatchProdImageSnapshot();
    }
  });
});
