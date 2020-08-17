import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, Device } from './_utils';
import { selectors } from '../__helpers/page-objects/_unsupported-nodes';
import * as unsupportedBlockPanelAdf from '../__fixtures__/unsupported-block.adf.json';

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    adf,
  });
};

describe('Snapshot Test: Unsupported Block', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.unsupportedBlock);
  });

  test(`should render the text inside an unsupported panel-like node`, async () => {
    await initRenderer(page, unsupportedBlockPanelAdf);
    await page.waitForSelector(selectors.unsupportedBlock);
  });
});
