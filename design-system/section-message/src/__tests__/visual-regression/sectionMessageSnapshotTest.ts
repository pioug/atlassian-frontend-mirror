import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'basic-example',

      global.__BASEURL__,
    );
    const { page } = global;
    const selector = '[data-testid="section-message"]';

    await loadPage(page, url);
    await page.waitForSelector(selector);

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Appearance variations should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'appearance-variations',

      global.__BASEURL__,
    );
    const { page } = global;
    const selector = '#appearance-example';

    await loadPage(page, url);
    await page.waitForSelector(selector);

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });
});
