// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';

describe('Skeleton', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await page.setViewport({ width: 500, height: 850 });
  });

  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'skeleton',
      global.__BASEURL__,
    );

    await loadPage(page, url);
    // Wait for 5 example groups
    await waitForElementCount(page, '[data-testid="example-block"]', 5);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
