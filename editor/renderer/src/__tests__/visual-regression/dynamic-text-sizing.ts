import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF } from './_utils';
import * as document from '../__fixtures__/document-without-media.adf.json';

const initRenderer = async (
  page: PuppeteerPage,
  viewport: { width: number; height: number },
) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport,
    rendererProps: { allowDynamicTextSizing: true, disableHeadingIDs: true },
    adf: document,
  });
};
// TODO: https://product-fabric.atlassian.net/browse/ED-7721
describe.skip('Snapshot Test: Dynamic Text Sizing', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForTimeout(100); // wait for dynamic text sizing to occur
    await snapshot(page);
  });

  [
    { width: 1440, height: 3200 },
    { width: 1120, height: 3000 },
    { width: 1000, height: 3000 },
  ].forEach((viewport) => {
    it(`should correctly render ${viewport.width}`, async () => {
      await initRenderer(page, viewport);
    });
  });
});
