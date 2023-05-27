import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';

async function setup(params: string = '') {
  const url =
    getExampleUrl(
      'media',
      'media-card',
      'Test-VR-inline-player',
      global.__BASEURL__,
    ) + params;

  const { page } = global;
  await page.goto(url);
  await page.waitForSelector(pageSelector);

  return { page };
}

describe('Media Inline Player', () => {
  const mediaInlinePlayerSelector = '[data-testid="media-card-inline-player"]';

  // FIXME: This test was automatically skipped due to failure on 27/05/2023: https://product-fabric.atlassian.net/browse/MEX-2422
  it.skip('should not render progress bar if status not "uploading"', async () => {
    const { page } = await setup();
    await page.waitForSelector(mediaInlinePlayerSelector, {
      visible: true,
    });

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME: This test was automatically skipped due to failure on 27/05/2023: https://product-fabric.atlassian.net/browse/MEX-2423
  it.skip('should render progress bar if status is "uploading"', async () => {
    const { page } = await setup('&status=uploading');
    await page.waitForSelector(mediaInlinePlayerSelector, {
      visible: true,
    });

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
