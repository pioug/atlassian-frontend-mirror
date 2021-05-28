// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Status', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'avatar',
      'basicStatus',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 500, height: 400 });
    await loadPage(page, url);
    // Wait for status badges
    await page.waitForSelector('span > svg:not([role="presentation"])');
    // Wait for avatars
    await page.waitForSelector('span > svg[role="presentation"]');
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
