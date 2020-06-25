import { snapshot, initRendererWithADF } from './_utils';
import * as mixedAdf from '../__fixtures__/document-without-media.adf.json';
import * as mediaAdf from '../__fixtures__/1600px-media.adf.json';
import { Page } from 'puppeteer';

const initRenderer = async (
  page: Page,
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
// TODO: https://product-fabric.atlassian.net/browse/ED-7721
describe.skip('Snapshot Test: Full Width', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  // TODO: Fix flaky test for { width: 2000, height: 2700 }
  // This is potentially because it was the first running test and needed more time
  [/*{ width: 2000, height: 2700 },*/ { width: 1420, height: 2500 }].forEach(
    viewport => {
      it(`should correctly render ${viewport.width}`, async () => {
        await initRenderer(page, viewport, mixedAdf);
        await page.waitFor('.code-block');
      });

      it('should correctly size images', async () => {
        await initRenderer(page, { ...viewport, height: 1100 }, mediaAdf);

        // Wait for media to be rendered. The examples use a broken media ID
        // which means it never gets past the loading state.
        await page.waitForSelector('div[data-testid="media-card-loading"]');
      });
    },
  );
});
