import { initRendererWithADF, snapshot } from './_utils';
import adfAllColors from './__fixtures__/table-with-all-background-colors.adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

const initRenderer = async (page: PuppeteerPage) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1485, height: 1175 },
    adf: adfAllColors,
  });
};

describe('Snapshot Test: Render all Table Cell Background Colors', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  it('should render all table cell background colors correctly', async () => {
    await initRenderer(page);
    await snapshot(page);
  });
});
