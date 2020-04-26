import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF } from './_utils';
import * as stickyHeaderADF from '../__fixtures__/sticky-header.adf.json';

async function scrollToPos(page: Page, pos: number) {
  return page.evaluate((pos: number) => {
    if (!window) {
      return;
    }
    window.scrollTo(0, pos);
  }, pos);
}

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 1280, height: 868 },
    adf,
    rendererProps: {
      stickyHeaders: {
        showStickyHeaders: true,
      },
    },
  });
};

describe('Snapshot Test: sticky-headers', () => {
  let page: Page;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it(`should have the header stick for an unresized-table`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 160);
  });

  it(`should have the header stick for an unresized-table with numbered column`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 312);
  });

  it(`should have the header not stick for an unresized-table with no header row`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 555);
  });

  it(`should have the header not stick for an table with only header row`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 650);
  });

  it(`should have the header not stick for an table with only regular row`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 750);
  });

  it(`should have the header not stick for an table with resized columns`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 840);
  });

  it(`should have the header stick for a broken out table with no resized columns`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 933);
  });

  it(`should have the header stick for a broken out table no resized columns`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 1125);
  });

  it(`should have the header stick for a broken out table overflow`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 1155);
  });

  it(`should have the header stick for an table with overflow`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 2395);
  });

  it(`should have the header stick for an table with overflow and numbered column`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 3457);
  });

  it(`should have the header stick for an table within a layout`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 4353);
  });

  it(`should have the header stick for an table within layout and brokenout`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 4690);
  });

  it(`should have both headers stick for an table with multiple headers`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 5170);
  });

  it(`should have both headers stick for an table with multiple headers`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 5263);
  });

  it(`should have the headers not stick for an table with merged cells`, async () => {
    await initRenderer(page, stickyHeaderADF);
    await scrollToPos(page, 5563);
  });
});
