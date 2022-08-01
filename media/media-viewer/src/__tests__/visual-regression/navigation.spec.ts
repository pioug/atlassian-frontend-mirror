import {
  getExampleUrl,
  pageSelector,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import { sleep } from '@atlaskit/media-test-helpers';

describe('Media Viewer Navigation', () => {
  let page: PuppeteerPage;
  const url = getExampleUrl(
    'media',
    'media-viewer',
    'vr-mocked-viewer',
    global.__BASEURL__,
  );

  beforeEach(async () => {
    ({ page } = global);

    await page.goto(url);
    await page.waitForSelector(pageSelector);
    await page.waitForSelector('img');
  });

  it('renders a file and nav button given multiple files', async () => {
    // This test relies on side effects (CSS transitons)
    await page.waitForFunction(
      `window.areControlsRendered() && window.areControlsVisible()`,
    );
    // Move mouse over the image to ensure the controls stay visible and don't fade out
    await page.mouse.move(100, 100);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('hides nav for multiple files after a timeout', async () => {
    // This test relies on side effects (CSS transitons)
    await page.goto(url);
    // Move mouse over off screen to ensure the controls stay hidden
    await page.mouse.move(-30, -30);
    await page.waitForSelector(pageSelector);
    await page.waitForSelector('img');
    await page.waitForFunction(
      `window.areControlsRendered() && window.areControlsHidden()`,
    );
    await sleep(500);

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME: This test was automatically skipped due to failure on 31/07/2022: https://product-fabric.atlassian.net/browse/MEX-1831
  it.skip('should show sidebar with attachment details', async () => {
    await page.click('span[aria-label="sidebar"]');
    await sleep(100);

    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
