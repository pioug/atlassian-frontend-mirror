import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import * as stickyHeaderADF from './__fixtures__/sticky-header.adf.json';

async function scrollToPos(
  page: PuppeteerPage,
  nthTable: number,
  offsetY = -90,
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

  it(`should have the header stick for an unresized-table`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 1);
    await animationFrame(page);
    console.log('TOP: ', o, 290 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an unresized-table with numbered column`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 2, -120);
    await animationFrame(page);
    console.log('TOP:', o, 440 - o!); // eslint-disable-line no-console
  });

  it(`should have the header not stick for an unresized-table with no header row`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 3);
    await animationFrame(page);
    console.log('TOP:', o, 690 - o!); // eslint-disable-line no-console
    // await scrollToPos(page, 690);
  });

  it(`should have the header not stick for an table with only header row`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 4);
    await animationFrame(page);
    console.log('TOP:', o, 820 - o!); // eslint-disable-line no-console
  });

  // FIXME: sticky header height diff...
  // `table:not(.pm-table-sticky)
  it(`should have the header not stick for an table with only regular row`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 5);
    await animationFrame(page);
    console.log('TOP:', o, 920 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table with resized columns`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 6);
    await animationFrame(page);
    console.log('TOP:', o, 1000 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for a broken out table with no resized columns`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 7);
    await animationFrame(page);
    console.log('TOP:', o, 1150 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for a broken out table no resized columns`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 8);
    await animationFrame(page);
    console.log('TOP:', o, 1350 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for a broken out table overflow`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 9, -210);
    await animationFrame(page);
    console.log('TOP:', o, 1750 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table with overflow`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 10);
    await animationFrame(page);
    console.log('TOP:', o, 2900 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table with overflow and numbered column`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    // await scrollToPos(page, 3500);
    const o = await scrollToPos(page, 11);
    await animationFrame(page);
    console.log('TOP:', o, 3500 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table within a layout`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 12, -150);
    await animationFrame(page);
    console.log('TOP:', o, 4500 - o!); // eslint-disable-line no-console
  });

  it(`should have the header stick for an table within layout and brokenout`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 13, -230);
    console.log('TOP:', o, 4900 - o!); // eslint-disable-line no-console
  });

  it(`should have both headers stick for an table with multiple headers`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    const o = await scrollToPos(page, 14, -130);
    await animationFrame(page);
    console.log('TOP:', o, 5170 - o!); // eslint-disable-line no-console
  });

  it(`should be able to scroll with mouse wheel even if mouse is hovering the stickied header row`, async () => {
    await initEditor(page, stickyHeaderADF);
    await animationFrame(page);
    await scrollToPos(page, 9, -200);
    await animationFrame(page);

    // wait for header to become sticky
    await page.waitForSelector(
      '.ProseMirror .tableView-content-wrap:nth-child(11) tr[data-header-row=true].sticky',
    );

    const headerRow = await page.$(
      '.ProseMirror .tableView-content-wrap:nth-child(11) tr[data-header-row=true]',
    );
    if (!headerRow) {
      fail('Could not find header row');
    }

    const boundingBox = await headerRow.boundingBox();
    if (!boundingBox) {
      fail('Could not get bounding box of header row');
    }

    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2,
      boundingBox.y + boundingBox.height / 2,
    );

    // scroll up 50 pixels
    await page.mouse.wheel({ deltaY: -50 });

    // wait for scroll to finish
    await page.waitForTimeout(200);

    await animationFrame(page);
  });
});
