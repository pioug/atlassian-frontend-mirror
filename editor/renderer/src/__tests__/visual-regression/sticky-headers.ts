import { shadowClassNames } from '@atlaskit/editor-common/ui';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  waitForElementCount,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import * as stickyHeaderADF from '../__fixtures__/sticky-header.adf.json';
import { emojiSelectors } from '../__helpers/page-objects/_emoji';
import { selectors } from '../__helpers/page-objects/_renderer';
import { initRendererWithADF, snapshot } from './_utils';

async function scrollToPos(page: PuppeteerPage, pos: number) {
  return page.evaluate((pos: number) => {
    if (!window) {
      return;
    }
    window.scrollTo(0, pos);
    // wait for the scroll animation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 50);
    });
  }, pos);
}

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1280, height: 868 },
    adf,
    rendererProps: {
      stickyHeaders: {
        offsetTop: 0,
      },
    },
  });
  // Wait for loaded emoji image (contained within ADF)
  await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
  // wait for all shadows to render (no need for them to be visible)
  await waitForElementCount(page, `.${shadowClassNames.RIGHT_SHADOW}`, 6, {
    timeout: 3000,
  });
};

describe('Snapshot Test: sticky-headers', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it(`should have the header stick for an unresized-table`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 130);
  });

  it(`should have the header stick for an unresized-table with numbered column`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 345);
  });

  it(`should have the header not stick for an unresized-table with no header row`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 610);
  });

  it(`should have the header not stick for an table with only header row`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 705);
  });

  it(`should have the header not stick for an table with only regular row`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 840);
  });

  it(`should have the header not stick for an table with resized columns`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 908);
  });

  it(`should have the header stick for a broken out table with no resized columns`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 1000);
  });

  it(`should have the header stick for a broken out table no resized columns`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 1208);
  });

  it(`should have the header stick for a broken out table overflow`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 1243);
  });

  it(`should have the header stick for an table with overflow`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 2685);
  });

  it(`should have the header stick for an table with overflow and numbered column`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 3757);
  });

  it(`should have the header stick for an table within a layout`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 4803);
  });

  it(`should have the header stick for an table within layout and brokenout`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 5160);
  });

  it(`should have both headers stick for an table with multiple headers`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 5689);
  });

  it(`should have both headers stick for an table with multiple headers`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 5783);
  });

  it(`should have the headers not stick for an table with merged cells`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 6033);
  });
});

describe('when the viewport width changes', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForSelector(selectors.table);
    await page.waitForSelector(selectors.stickyHeader);
    const table = await page.$$(selectors.table);
    const stickyHeader = await page.$$(selectors.stickyHeader);

    // We scroll to the second table in the list
    const tableBoundingBox = await table[1].boundingBox();
    const stickyHeaderBoundingBox = await stickyHeader[1].boundingBox();

    expect(tableBoundingBox?.width).toBe(stickyHeaderBoundingBox?.width);
  });

  beforeEach(async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 345);
  });

  it('should be the same after increasing in size', async () => {
    await page.setViewport({ width: 1600, height: 868 });
  });

  it('should be the same after decreasing in size', async () => {
    await page.setViewport({ width: 600, height: 868 });
  });

  it('should be the same after increasing then decreasing in size', async () => {
    await page.setViewport({ width: 1600, height: 868 });
    await page.setViewport({ width: 600, height: 868 });
  });

  it('should be the same after decreasing then increasing in size', async () => {
    await page.setViewport({ width: 600, height: 868 });
    await page.setViewport({ width: 1600, height: 868 });
  });
});
