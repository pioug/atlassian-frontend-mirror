import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, animationFrame } from './_utils';
import {
  getExampleUrl,
  navigateToUrl,
  disableAllSideEffects,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: WidthProvider', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page);
  });

  it('should resize the table breakout', async () => {
    const url = getExampleUrl(
      'editor',
      'renderer',
      'list-of-comments',
      global.__BASEURL__,
    );

    await navigateToUrl(page, url);
    await page.waitForSelector('#RendererOutput');
    await page.setViewport({ width: 1200, height: 1500 });
    await disableAllSideEffects(page);
  });
});
