// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import {
  getExampleUrl,
  loadPage,
  waitForElementCount,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const item = 'span[role="button"][aria-disabled=false]'; // disabled item doesn't have hover/focus state

describe('Item', () => {
  it('should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'item',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await page.setViewport({ width: 500, height: 400 });
    await loadPage(page, url);
    // Wait for items
    await waitForElementCount(page, 'span[role="button"]', 7);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('Basic item should render correctly under all interactions', async () => {
    const url = getExampleUrl(
      'design-system',
      'item',
      'basic',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(item);

    const standard = await takeElementScreenShot(page, item);
    expect(standard).toMatchProdImageSnapshot();

    await page.focus(item);
    const focused = await takeElementScreenShot(page, item);
    expect(focused).toMatchProdImageSnapshot();

    await page.click(item);
    const selected = await takeElementScreenShot(page, item);
    expect(selected).toMatchProdImageSnapshot();
  });
});
