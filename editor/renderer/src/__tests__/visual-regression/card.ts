import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF } from './_utils';
import * as cardXSSADF from '../__fixtures__/card-xss.adf.json';

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 500, height: 200 },
    adf,
  });
};

describe('Snapshot Test: Cards', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  // TODO: https://product-fabric.atlassian.net/browse/ED-7721
  it.skip('should render unknown content for cards with invalid urls', async () => {
    await initRenderer(page, cardXSSADF);
  });
});
