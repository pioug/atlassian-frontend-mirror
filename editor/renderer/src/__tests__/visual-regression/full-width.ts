import { snapshot, initRendererWithADF, animationFrame } from './_utils';
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

describe('Snapshot Test: Full Width', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  [
    { width: 2000, height: 2700 },
    { width: 1420, height: 2500 },
  ].forEach(viewport => {
    it(`should correctly render ${viewport.width}`, async () => {
      await initRenderer(page, viewport, mixedAdf);
      await page.waitFor('.code-block');
      await animationFrame(page);
    });

    it('should correctly size images', async () => {
      await initRenderer(page, { ...viewport, height: 1100 }, mediaAdf);

      // Wait for media to be rendered. The examples use a broken media ID
      // which means it never gets past the loading state.
      await page.waitForSelector('div[data-testid="media-card-loading"]');
    });
  });
});
