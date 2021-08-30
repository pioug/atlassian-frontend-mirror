import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import * as stickyHeaderADF from './__fixtures__/sticky-header.adf.json';

async function scrollToPos(
  page: PuppeteerPage,
  nthTable: number,
  offsetY = -80,
) {
  return page.evaluate(
    (nth: number, offset: number) => {
      const scrollParent = document.querySelector(
        '.fabric-editor-popup-scroll-parent',
      );
      if (!scrollParent) {
        return;
      }
      const table = document.querySelectorAll<HTMLElement>(
        `.ProseMirror .tableView-content-wrap`,
      )[nth];
      if (!table) {
        return;
      }

      const findRoot = (element: HTMLElement): HTMLElement => {
        const parent = element.parentElement;
        if (parent && parent.classList.contains('ProseMirror')) {
          return element;
        }
        return findRoot(parent!);
      };

      const scrollOffset = findRoot(table).offsetTop + offset;
      scrollParent.scrollTo(0, scrollOffset);
      return scrollOffset;
    },
    nthTable,
    offsetY,
  );
}

const initEditor = async (page: PuppeteerPage, adf: any) => {
  await initEditorWithAdf(page, {
    appearance: Appearance.fullPage,
    adf,
    viewport: { width: 1280, height: 868 },
    editorProps: {
      allowTables: {
        stickyHeaders: true,
      },
    },
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

  // FIXME: This test was automatically skipped due to failure on 8/24/2021: https://product-fabric.atlassian.net/browse/ED-13660
  it.skip(`should have the header stick for an unresized-table`, async () => {
    await initEditor(page, stickyHeaderADF);
    const o = await scrollToPos(page, 1);
    console.log('TOP: ', o, 290 - o!); // eslint-disable-line no-console
    // await scrollToPos(page, 290);
  });

  it(`should have the header stick for an unresized-table with numbered column`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 440);
    const o = await scrollToPos(page, 2);
    console.log('TOP:', o, 440 - o!); // eslint-disable-line no-console
  });

  it(`should have the header not stick for an unresized-table with no header row`, async () => {
    await initEditor(page, stickyHeaderADF);
    const o = await scrollToPos(page, 3);
    console.log('TOP:', o, 690 - o!); // eslint-disable-line no-console
    // await scrollToPos(page, 690);
  });

  it(`should have the header not stick for an table with only header row`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 820);
    const o = await scrollToPos(page, 4);
    console.log('TOP:', o, 820 - o!); // eslint-disable-line no-console
  });

  // FIXME: sticky header height diff...
  // `table:not(.pm-table-sticky)
  it(`should have the header not stick for an table with only regular row`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 920);
    const o = await scrollToPos(page, 5);
    console.log('TOP:', o, 920 - o!); // eslint-disable-line no-console
  });

  it(`should have the header not stick for an table with resized columns`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 1000);
    const o = await scrollToPos(page, 6);
    console.log('TOP:', o, 1000 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for a broken out table with no resized columns`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 1150);
    const o = await scrollToPos(page, 7);
    console.log('TOP:', o, 1150 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for a broken out table no resized columns`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 1350);
    const o = await scrollToPos(page, 8);
    console.log('TOP:', o, 1350 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for a broken out table overflow`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 1750);
    const o = await scrollToPos(page, 9);
    console.log('TOP:', o, 1750 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table with overflow`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 2900);
    const o = await scrollToPos(page, 10);
    console.log('TOP:', o, 2900 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table with overflow and numbered column`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 3500);
    const o = await scrollToPos(page, 11);
    console.log('TOP:', o, 3500 - o!); // eslint-disable-line no-console
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip(`should have the header stick for an table within a layout`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 4500);
    const o = await scrollToPos(page, 12);
    console.log('TOP:', o, 4500 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table within layout and brokenout`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 4900);
    const o = await scrollToPos(page, 13);
    console.log('TOP:', o, 4900 - o!); // eslint-disable-line no-console
  });

  it(`should have both headers stick for an table with multiple headers`, async () => {
    await initEditor(page, stickyHeaderADF);
    // await scrollToPos(page, 5170);
    const o = await scrollToPos(page, 14);
    console.log('TOP:', o, 5170 - o!); // eslint-disable-line no-console
  });
});
