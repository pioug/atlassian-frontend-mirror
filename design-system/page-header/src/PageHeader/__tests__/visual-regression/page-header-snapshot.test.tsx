import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-header',
      'default',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    const image = await takeElementScreenShot(
      page,
      '[data-testid="page-header"]',
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
