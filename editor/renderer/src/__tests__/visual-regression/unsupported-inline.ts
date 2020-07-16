import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF, Device } from './_utils';
import * as unsupportedInlineAdf from '../__fixtures__/unsupported-inline.adf.json';

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    adf,
  });
};

describe('Snapshot Test: Unsupported Inline', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, 'p');
  });

  test(`should render the text inside an unsupported status-like node`, async () => {
    await initRenderer(page, unsupportedInlineAdf);
    await page.waitForSelector('p');
  });
});
