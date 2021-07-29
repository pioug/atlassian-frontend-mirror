import {
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, animationFrame } from './_utils';
import * as mixedAdf from '../__fixtures__/document-without-media.adf.json';
import * as mediaAdf from '../__fixtures__/1600px-media.adf.json';

const initRenderer = async (
  page: PuppeteerPage,
  viewport: { width: number; height: number },
  adf: any,
) => {
  await initRendererWithADF(page, {
    appearance: 'full-width',
    viewport,
    rendererProps: { allowDynamicTextSizing: true, disableHeadingIDs: true },
    adf,
  });
};
// TODO: https://product-fabric.atlassian.net/browse/ED-12011
describe.skip('Snapshot Test: Full Width', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  [
    { width: 2000, height: 2700 },
    { width: 1420, height: 2500 },
  ].forEach((viewport) => {
    it(`should correctly render ${viewport.width}`, async () => {
      await initRenderer(page, viewport, mixedAdf);
      await page.waitForSelector('.code-block');
      await animationFrame(page);
    });

    it('should correctly size images', async () => {
      await initRenderer(page, { ...viewport, height: 1100 }, mediaAdf);
      await waitForLoadedImageElements(page, 1000);
      await page.waitForSelector(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      );
    });
  });
});
