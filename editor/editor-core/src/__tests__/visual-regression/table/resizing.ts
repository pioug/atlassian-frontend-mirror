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
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';

const waitToolbarThenSnapshot = async (page: PuppeteerPage) => {
  await page.waitForSelector(tableSelectors.floatingToolbar);
  await snapshot(page);
};

describe('Snapshot Test: table resizing', () => {
  describe('Re-sizing', () => {
    let page: PuppeteerPage;

    beforeAll(() => {
      page = global.page;
    });

    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adf);
      await insertTable(page);
    });

    it(`resize a column with content width`, async () => {
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
      await deleteColumn(page, 1);

      await waitToolbarThenSnapshot(page);
    });

    describe('Overflow Table', () => {
      beforeEach(async () => {
        // Go to overflow
        await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
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
        });

        test('should show overflow in both side when scroll is in the middle', async () => {
          await scrollTable(page, 0.5); // Scroll to the middle of the table
          await snapshot(page);
        });

        test('should show only left overflow when scroll is in the right', async () => {
          await scrollTable(page, 1); // Scroll to the right of the table
          await snapshot(page);
        });

        test('should show only right overflow when scroll is in the left', async () => {
          await scrollTable(page, 0); // Scroll to the left of the table
          await snapshot(page);
        });
      });
    });

    it('should preserve the selection after resizing', async () => {
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

  it(`should not overflow the table with dynamic text sizing enabled`, async () => {
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
    async row => {
      await grabResizeHandle(page, { colIdx: 1, row });
      await animationFrame(page);
      await waitToolbarThenSnapshot(page);
    },
  );
});
