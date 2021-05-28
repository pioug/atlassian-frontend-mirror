// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';

describe('Avatar', () => {
  let page: PuppeteerPage;
  let url: string;

  beforeAll(() => {
    url = getExampleUrl(
      'design-system',
      'avatar',
      'basicAvatar',
      global.__BASEURL__,
    );
  });

  beforeEach(async () => {
    page = global.page;
    await page.setViewport({ width: 500, height: 400 });
  });

  it('should match production example', async () => {
    await loadPage(page, url);
    await page.waitForSelector(
      'div[data-testid="avatar"] span[role="img"] svg',
      { visible: true },
    );
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should render a tooltip on hover', async () => {
    await loadPage(page, url);
    await page.hover('[data-testid="avatar"]');
    await waitForTooltip(page);

    const image = await page.screenshot({
      clip: {
        width: 140,
        height: 200,
        x: 0,
        y: 0,
      },
    });

    expect(image).toMatchProdImageSnapshot();
  });
});
