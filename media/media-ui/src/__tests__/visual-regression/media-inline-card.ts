import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';

describe('Media Inline Card', () => {
  // FIXME: This test was automatically skipped due to failure on 27/05/2023: https://product-fabric.atlassian.net/browse/MEX-2424
  // FIXME: This test was automatically skipped due to failure on 27/05/2023: https://product-fabric.atlassian.net/browse/MEX-2425
  it.skip.each([
    ['renders text wrap correctly', 'vr-media-inline-card-text-wrap'],
  ])('%s', async (_: string, testName: string) => {
    const url = getURL(testName);
    const page = await setup(url);
    const image = await takeSnapshot(page, 280, 0);

    expect(image).toMatchProdImageSnapshot();
  });

  it('should render inline card with right styling', async () => {
    const url = getExampleUrl(
      'media',
      'media-ui',
      'vr-media-inline-card',
      global.__BASEURL__,
    );
    const page = await setup(url);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
