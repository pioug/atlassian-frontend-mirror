import {
  getExampleUrl,
  pageSelector,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import { sleep } from '@atlaskit/media-test-helpers';

describe('Archive sidebar', () => {
  let page: PuppeteerPage;
  const url = getExampleUrl(
    'media',
    'media-viewer',
    'vr-archive-side-bar',
    global.__BASEURL__,
  );

  beforeEach(async () => {
    ({ page } = global);
    await page.goto(url);
    await page.waitForSelector(pageSelector);
    await page.click('div[data-testid="media-file-card-view"]');
    await page.waitForSelector('span[aria-label="Folder"]');
  });

  it('should have side bar for archive file', async () => {
    await page.hover('div[data-testid="media-viewer-popup"]');
    await sleep(300);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('should show navigation back button on opening the folder', async () => {
    await page.click('span[aria-label="Folder"]');
    await sleep(2000);

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
