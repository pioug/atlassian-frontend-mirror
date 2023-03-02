import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const selector = '[data-testid="image"]';

describe('Snapshot Test', () => {
  it('Image basic example should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl('design-system', 'image', 'basic', __BASEURL__);

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('Image basic example should match production example in light mode', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'image',
      'basic',
      __BASEURL__,
      'light',
    );

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('Image basic example should match production example in dark mode', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'image',
      'basic',
      __BASEURL__,
      'dark',
    );

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('Image themed example should match production example', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl('design-system', 'image', 'themed', __BASEURL__);

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('Image themed example should match production example in light mode', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'image',
      'themed',
      __BASEURL__,
      'light',
    );

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME: This test was automatically skipped due to failure on 01/03/2023: https://product-fabric.atlassian.net/browse/DSP-9039
  it.skip('Image themed example should match production example in dark mode', async () => {
    const { __BASEURL__, page } = global;
    const url = getExampleUrl(
      'design-system',
      'image',
      'themed',
      __BASEURL__,
      'dark',
    );

    await loadPage(page, url);
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });
});
