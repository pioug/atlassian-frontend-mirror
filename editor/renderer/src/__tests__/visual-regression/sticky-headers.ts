import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF } from './_utils';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import * as stickyHeaderADF from '../__fixtures__/sticky-header.adf.json';
import { emojiSelectors } from '../__helpers/page-objects/_emoji';

async function scrollToPos(page: PuppeteerPage, pos: number) {
  return page.evaluate((pos: number) => {
    if (!window) {
      return;
    }
    window.scrollTo(0, pos);
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
  // TODO: We need to fix this test
  it.skip(`should have the header not stick for an table with only regular row`, async () => {
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
