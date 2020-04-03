import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF } from './_utils';
import * as hardBreakADF from '../__fixtures__/hardBreak.adf.json';

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 500, height: 300 },
    adf,
  });
};

describe('Snapshot Test: hardBreak', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  test(`should render a hardBreak even if it is between two lines of content`, async () => {
    await initRenderer(page, hardBreakADF);
  });
});
