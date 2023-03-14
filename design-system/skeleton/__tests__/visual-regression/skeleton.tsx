import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const selector = '[data-testid="skeleton-group"]';

describe('Snapshot Test', () => {
  it('Skeleton example should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl('design-system', 'skeleton', 'all', __BASEURL__);

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('Skeleton example should match production example in dark mode', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'skeleton',
      'all',
      __BASEURL__,
      'dark',
    );

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });
});
