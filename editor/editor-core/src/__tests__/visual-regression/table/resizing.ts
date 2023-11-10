// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adfTableWithMergedCellsOnFirstRow from './__fixtures__/table-with-merged-cells-on-first-row.adf.json';
import adfTableWithManyRows from './__fixtures__/table-with-many-rows.adf.json';
import adfTableWithMergedCells from './__fixtures__/table-with-merged-cells.adf.json';
import adf from '../common/__fixtures__/noData-adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  deleteColumn,
  resizeColumn,
  resizeColumnAndReflow,
  insertTable,
  grabResizeHandle,
  clickFirstCell,
  scrollTable,
  unselectTable,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  animationFrame,
  scrollToBottom,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { TableCssClassName as ClassName } from '@atlaskit/editor-plugin-table/types';
import type { EditorProps } from '../../../types';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';

const waitToolbarThenSnapshot = async (page: PuppeteerPage) => {
  await retryUntilStablePosition(
    page,
    async () => {
      await page.waitForSelector(tableSelectors.floatingToolbar);
    },
    tableSelectors.floatingToolbar,
  );
  await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.01 });
};

const waitTableThenSnapshot = async (page: PuppeteerPage) => {
  await retryUntilStablePosition(
    page,
    async () => {
      await page.waitForSelector(tableSelectors.tableWrapper);
    },
    tableSelectors.tableWrapper,
  );
  await snapshot(page);
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
      await clickFirstCell(page);
      await waitToolbarThenSnapshot(page);
    });

    describe('Overflow Table', () => {
      beforeEach(async () => {
        await initEditorWithTable({
          allowTables: {
            stickyHeaders: true,
            advanced: true,
          },
        });
        // Go to overflow
        await resizeColumn(page, { colIdx: 2, amount: 250, row: 2 });
      });

      test('should overflow table when resizing over the available size', async () => {
        await waitToolbarThenSnapshot(page);
      });

      test('should keep overflow when resizing an table with overflow', async () => {
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
          await page.waitForSelector(`.${ClassName.WITH_CONTROLS}`, {
            hidden: true,
          });
        });

        afterEach(async () => {
          // had to add explicit wait due to unexpected flakes on the pipeline after after awaiting for shadows states
          // table width needed some time to adjust after undelecting table which doesnt happen locally
          // waiting for exact table width or shadows offsets didnt seem to help
          await page.waitForTimeout(100);
          await snapshot(page);
        });

        test('should show overflow in both side when scroll is in the middle', async () => {
          await scrollTable(page, 0.5); // Scroll to the middle of the table
          await page.waitForSelector(
            `.${TableSharedCssClassName.TABLE_LEFT_SHADOW}`,
            { visible: true },
          );
          await page.waitForSelector(
            `.${TableSharedCssClassName.TABLE_RIGHT_SHADOW}`,
            { visible: true },
          );
        });

        test('should show only left overflow when scroll is in the right', async () => {
          await scrollTable(page, 1); // Scroll to the right of the table
          await page.waitForSelector(
            `.${TableSharedCssClassName.TABLE_LEFT_SHADOW}`,
            { visible: true },
          );
          await page.waitForSelector(
            `.${TableSharedCssClassName.TABLE_RIGHT_SHADOW}`,
            { hidden: true },
          );
        });

        test('should show only right overflow when scroll is in the left', async () => {
          await page.waitForSelector(
            `.${TableSharedCssClassName.TABLE_RIGHT_SHADOW}`,
            { visible: true },
          );
          await page.waitForSelector(
            `.${TableSharedCssClassName.TABLE_LEFT_SHADOW}`,
            { hidden: true },
          );
        });
      });
    });

    describe('with sticky headers', () => {
      beforeEach(async () => {
        await initFullPageEditorWithAdf(
          page,
          adfTableWithManyRows,
          undefined,
          undefined,
          {
            allowTables: {
              stickyHeaders: true,
              advanced: true,
            },
          },
        );

        // Go to overflow
        await clickFirstCell(page);
        await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
        await animationFrame(page);
        await unselectTable(page);
      });

      // FIXME: This test was skipped on 09/11/2023 https://product-fabric.atlassian.net/browse/DTR-2011
      it.skip('header shadows are aligned when focusing overflown table', async () => {
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
        await waitTableThenSnapshot(page);
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
    });
    await insertTable(page);
    await clickFirstCell(page);
  });
});

describe('Snapshot Test: table with merged cell on first row', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adfTableWithMergedCellsOnFirstRow);
    await clickFirstCell(page);
  });

  it('should resize the first cell on first row', async () => {
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

describe('Snapshot Test: table resize handle line', () => {
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
      await waitTableThenSnapshot(page);
    },
  );
});
