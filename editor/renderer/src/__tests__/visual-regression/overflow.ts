import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF } from './_utils';
import * as document from '../../../examples/helper/overflow.adf.json';

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1280, height: 900 },
    adf,
  });
};

describe('Snapshot Test: Overflow shadows', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render right shadows', async () => {
    await initRenderer(page, document);
    await page.waitForSelector('.code-block');
  });
});
