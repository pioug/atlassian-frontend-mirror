import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, Device } from './_utils';
import { selectors } from '../__helpers/page-objects/_decision';
import * as decisionAdf from '../__fixtures__/decision-adf.json';

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    adf,
  });
};

describe('Snapshot Test: Decision', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.decisionItem);
  });

  test(`should not render any hover-specific styles on hover`, async () => {
    await initRenderer(page, decisionAdf);
    await page.waitForSelector(selectors.decisionItem);
    await page.hover(selectors.decisionItem);
  });
});
