import {
  snapshot,
  initFullPageEditorWithAdf,
  initEditorWithAdf,
  Appearance,
} from '../_utils';
import adfTableWithMergedCellsOnFirstRow from './__fixtures__/table-with-merged-cells-on-first-row.adf.json';
import adfTableWithMergedCells from './__fixtures__/table-with-merged-cells.adf.json';
import adf from '../common/__fixtures__/noData-adf.json';
import {
  deleteColumn,
  resizeColumn,
  resizeColumnAndReflow,
  insertTable,
  grabResizeHandle,
  clickFirstCell,
  toggleBreakout,
  scrollTable,
  unselectTable,
  tableSelectors,
  insertRow,
} from '../../__helpers/page-objects/_table';
import {
  animationFrame,
  scrollToBottom,
} from '../../__helpers/page-objects/_editor';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import { EditorProps } from '../../../types';

const waitToolbarThenSnapshot = async (page: PuppeteerPage) => {
  await page.waitForSelector(tableSelectors.floatingToolbar);
  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.01 });
};

describe('Snapshot Test: table resizing', () => {
  describe('Re-sizing', () => {
    let page: PuppeteerPage;

    beforeAll(() => {
      page = global.page;
    });

    async function initEditorWithTable(editorProps?: EditorProps) {
      await initFullPageEditorWithAdf(
        page,
        adf,
        undefined,
        undefined,
        editorProps,
      );
      await insertTable(page);
    }

    it(`resize a column with content width`, async () => {
      await initEditorWithTable();
      await resizeColumnAndReflow(page, { colIdx: 2, amount: 123, row: 2 });
      await animationFrame(page);
      await animationFrame(page);

      await waitToolbarThenSnapshot(page);
      await resizeColumnAndReflow(page, { colIdx: 2, amount: -100, row: 2 });
      await animationFrame(page);
      await animationFrame(page);

      await waitToolbarThenSnapshot(page);
    });

    it(`snaps back to layout width after column removal`, async () => {
      await initEditorWithTable();
      await deleteColumn(page, 1);

      await waitToolbarThenSnapshot(page);
    });

    // FIXME These tests were flakey in the Puppeteer v10 Upgrade
    describe.each([
      ['without tableOverflowShadowsOptimization', false],
      ['with tableOverflowShadowsOptimization', true],
    ])('Overflow Table %s', (tableOverflowShadowsOptimization) => {
      beforeEach(async () => {
        await initEditorWithTable({
          featureFlags: {
            tableOverflowShadowsOptimization,
          },
        });
        // Go to overflow
        await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
      });
      test.skip('should overflow table when resizing over the available size', async () => {
        await waitToolbarThenSnapshot(page);
      });

      test.skip('should keep overflow when resizing an table with overflow', async () => {
        // Scroll to the end of col we are about to resize
        // Its in overflow.
        await scrollTable(page, 1);
        await resizeColumn(page, { colIdx: 2, amount: -550, row: 2 });
        // Scroll back so we can see the result of our resize.
        await scrollTable(page, 0);

        await waitToolbarThenSnapshot(page);
      });

      describe('unselected', () => {
        beforeEach(async () => {
          await unselectTable(page);
        });

        // TODO: https://product-fabric.atlassian.net/browse/ED-13527
        test.skip('should show overflow in both side when scroll is in the middle', async () => {
          await scrollTable(page, 0.5); // Scroll to the middle of the table
          await animationFrame(page);
          await snapshot(page);
        });
        // FIXME These tests were flakey in the Puppeteer v10 Upgrade
        test.skip('should show only left overflow when scroll is in the right', async () => {
          await scrollTable(page, 1); // Scroll to the right of the table
          await animationFrame(page);
          await snapshot(page);
        });

        // TODO: https://product-fabric.atlassian.net/browse/ED-13540
        test.skip('should show only right overflow when scroll is in the left', async () => {
          await scrollTable(page, 0); // Scroll to the left of the table
          await animationFrame(page);
          // FIXME These tests were flakey in the Puppeteer v10 Upgrade
          await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.01 });
        });
      });
    });

    describe.each([
      ['without stickyHeadersOptimization', false],
      ['with stickyHeadersOptimization', true],
    ])('Overflow Table %s', (stickyHeadersOptimization) => {
      beforeEach(async () => {
        await initEditorWithTable({
          allowTables: {
            stickyHeaders: true,
            advanced: true,
          },
          featureFlags: {
            stickyHeadersOptimization,
          },
        });
        // Go to overflow
        await clickFirstCell(page);
        await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
        await animationFrame(page);
      });

      // TODO: https://product-fabric.atlassian.net/browse/ED-13540
      it.skip('header shadows are aligned when focusing overflown table', async () => {
        //insert multiple rows to make table go off the screen
        for (let i = 0; i < 15; i++) {
          await insertRow(page, 1);
        }
        await animationFrame(page);
        await unselectTable(page);
        // Scroll to the middle of the table horizontally to have shadows on both sides
        await scrollTable(page, 0.5);
        // scroll to bottom to have sticky header
        await scrollToBottom(page);
        await animationFrame(page);

        // verify screenshot when table selected
        const middleBottomCellSelecor =
          'table > tbody > tr:last-child > td:nth-child(2)';
        await page.waitForSelector(middleBottomCellSelecor);
        await page.click(middleBottomCellSelecor);
        await waitToolbarThenSnapshot(page);

        // verify screenshot when table unselected back
        await unselectTable(page);
        await animationFrame(page);
        await snapshot(page);
      });
    });

    it('should preserve the selection after resizing', async () => {
      await initEditorWithTable();
      await clickFirstCell(page);

      const controlSelector = `.${ClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index="0"]`;

      await page.waitForSelector(controlSelector);
      await page.click(controlSelector);
      await page.waitForSelector(tableSelectors.selectedCell);
      await resizeColumnAndReflow(page, { colIdx: 1, amount: -100, row: 2 });
      await animationFrame(page);
      await animationFrame(page);

      await waitToolbarThenSnapshot(page);
    });
  });
});

describe('Snapshot Test: table resize handle', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    await insertTable(page);
  });

  describe('when table has merged cells', () => {
    it(`should render resize handle spanning all rows`, async () => {
      await grabResizeHandle(page, { colIdx: 2, row: 2 });
      await waitToolbarThenSnapshot(page);
    });
  });
});

describe('Snapshot Test: table scale', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1280, height: 500 },
      editorProps: {
        allowDynamicTextSizing: true,
      },
    });
    await insertTable(page);
    await clickFirstCell(page);
  });
  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip(`should not overflow the table with dynamic text sizing enabled`, async () => {
    await toggleBreakout(page, 1);
    await waitToolbarThenSnapshot(page);
  });
});

describe('Snapshot Test: table with merged cell on first row', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adfTableWithMergedCellsOnFirstRow);
    await clickFirstCell(page);
  });

  it.skip('should resize the first cell on first row', async () => {
    await resizeColumnAndReflow(page, { colIdx: 1, row: 1, amount: 100 });
    await animationFrame(page);
    await waitToolbarThenSnapshot(page);
  });

  it('should resize the first cell on second row', async () => {
    await resizeColumnAndReflow(page, { colIdx: 1, row: 2, amount: 100 });
    await animationFrame(page);
    await waitToolbarThenSnapshot(page);
  });

  it('should resize the first cell on third row', async () => {
    await resizeColumnAndReflow(page, { colIdx: 1, row: 3, amount: 100 });
    await animationFrame(page);
    await waitToolbarThenSnapshot(page);
  });
});

// FIXME These tests were flakey in the Puppeteer v10 Upgrade
describe.skip('Snapshot Test: table resize handle line', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adfTableWithMergedCells);
    await clickFirstCell(page);
  });

  it.each([1, 2, 3, 4, 5, 6])(
    'should display the resize handle line row %d',
    async (row) => {
      await grabResizeHandle(page, { colIdx: 1, row });
      await animationFrame(page);
      await waitToolbarThenSnapshot(page);
    },
  );
});
