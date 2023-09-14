// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import complexTableWithMergedCells from './__fixtures__/complex-table-with-merged-cells.adf.json';
import lastColumnMergedTable from './__fixtures__/last-column-merged-table.adf.json';
import tableWithNumberedColumn from './__fixtures__/table-with-numbered-column.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  selectRow,
  selectColumn,
  selectTable,
  selectNumberedColumnRow,
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  selectors,
  animationFrame,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: Table selection', () => {
  let page: PuppeteerPage;
  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await animationFrame(page);
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
  });

  describe('Rows & Columns', () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(
        page,
        complexTableWithMergedCells,
        Device.LaptopMDPI,
      );
      await animationFrame(page);
      await clickFirstCell(page, true);
      await animationFrame(page);
    });

    // #region Rows
    it('should be able select the first row', async () => {
      await selectRow(1);
    });

    it('should be able select the fourth row', async () => {
      await selectRow(4);
    });

    it('should be able select the fifth row', async () => {
      await selectRow(5);
    });

    it('should be able select the sixth row', async () => {
      await selectRow(6);
    });

    it('should be able select the seventh row', async () => {
      await selectRow(7);
    });

    it('should be able select multiple rows from a text selection', async () => {
      await selectRow(4, true);
    });

    it('should be able select multiple rows from a cell selection', async () => {
      await selectRow(4);
      await animationFrame(page);
      await selectRow(6, true);
    });

    it('should be able select multiple rows after direction change', async () => {
      await selectRow(4);
      await animationFrame(page);
      await selectRow(6, true);
      await animationFrame(page);
      await selectRow(2, true);
    });
    // #endregion

    // #region Columns
    it('should be able select the first column', async () => {
      await selectColumn(0);
    });

    it('should be able select the second column', async () => {
      await selectColumn(1);
      await animationFrame(page);
      await retryUntilStablePosition(
        page,
        () => page.click(tableSelectors.nthColumnControl(1)),
        tableSelectors.nthColumnControl(1),
        1000,
      );
    });

    it('should be able select the third column', async () => {
      await selectColumn(2);
    });

    it('should be able select multiple columns from a text selection', async () => {
      await selectColumn(1, true);
    });

    it('should be able select multiple columns from a cell selection', async () => {
      await selectColumn(1);
      await animationFrame(page);
      await retryUntilStablePosition(
        page,
        () => page.click(tableSelectors.nthColumnControl(1)),
        tableSelectors.nthColumnControl(1),
        1000,
      );
      await selectColumn(2, true);
    });

    it('should be able select multiple columns after direction change', async () => {
      await selectColumn(1);
      await animationFrame(page);
      await selectColumn(2, true);
      await animationFrame(page);
      await selectColumn(0, true);
    });
    // #endregion

    it('should be able select multiple cells going from row to column', async () => {
      await selectRow(1);
      await animationFrame(page);
      await selectColumn(1, true);
    });

    it('should be able select multiple cells going from column to row', async () => {
      await selectColumn(1);
      await animationFrame(page);
      await selectRow(6, true);
    });
  });

  describe('Table', () => {
    beforeEach(async () => {
      // This ADF covers ED-6912
      await initFullPageEditorWithAdf(
        page,
        lastColumnMergedTable,
        Device.LaptopMDPI,
      );
      await animationFrame(page);
      await clickFirstCell(page);
      await animationFrame(page);
    });

    it('should be able select the table', async () => {
      await selectTable(page);
    });
  });

  describe('Current selection is outside Table', () => {
    beforeEach(async () => {
      // This ADF covers ED-6912
      await initFullPageEditorWithAdf(
        page,
        tableWithNumberedColumn,
        Device.LaptopMDPI,
      );
      await animationFrame(page);
    });

    it(`should select the clicked row`, async () => {
      await page.waitForSelector(selectors.lastEditorChildParagraph);
      await page.click(selectors.lastEditorChildParagraph);
      await animationFrame(page);
      await selectNumberedColumnRow(1);
    });

    it(`should select from the clicked row to last row`, async () => {
      await page.waitForSelector(selectors.lastEditorChildParagraph);
      await page.click(selectors.lastEditorChildParagraph);
      await animationFrame(page);
      await selectNumberedColumnRow(1, true);
    });

    it(`should select from the clicked row to last first`, async () => {
      await page.waitForSelector(selectors.firstEditorChildParagraph);
      await page.click(selectors.firstEditorChildParagraph);
      await animationFrame(page);
      await selectNumberedColumnRow(1, true);
    });
  });
});
