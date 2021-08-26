import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import defaultTableResizedWithOverflow from './__fixtures__/default-table-resized.adf.json';
import defaultTableResizedWithoutOverflow from './__fixtures__/default-table-resized-no-overflow.adf.json';
import defaultTable from './__fixtures__/default-table.adf.json';
import mergedColumnsResized from './__fixtures__/merged-columns-resized.adf.json';
import {
  clickFirstCell,
  distributeColumns,
  distributeAllColumns,
  getSelectorForTableCell,
  clickCellOptions,
  insertColumn,
} from '../../__helpers/page-objects/_table';
import {
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';

describe('Distribute Columns', () => {
  let page: PuppeteerPage;
  const pageInit = async (adf?: Object) => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      editorProps: {
        allowTables: { advanced: true, allowDistributeColumns: true },
      },
    });
    await clickFirstCell(page);
  };

  describe('columns should distribute correctly', () => {
    it('on a resized normal cells with specified colwidths', async () => {
      await pageInit(defaultTableResizedWithOverflow);
      const from = getSelectorForTableCell({
        row: 2,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 3, cell: 2 });
      await distributeColumns(page, from, to);
      await snapshot(page);
    });

    // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
    it.skip('on a resized merged cells with colwidths', async () => {
      await pageInit(mergedColumnsResized);
      const from = getSelectorForTableCell({
        row: 5,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 5, cell: 2 });
      await distributeColumns(page, from, to);
      await snapshot(page);
    });
  });

  describe('menu should be disabled', () => {
    const showContextMenuSelection = async (
      page: PuppeteerPage,
      from: string,
      to: string,
    ) => {
      await page.click(from);
      await pressKeyDown(page, 'Shift');
      await page.click(to);
      await pressKeyUp(page, 'Shift');
      await clickCellOptions(page);
    };

    // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
    it.skip('if selected cells without colwidths', async () => {
      await pageInit(defaultTable);
      const from = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 2, cell: 2 });
      await showContextMenuSelection(page, from, to);
      await snapshot(page);
    });

    // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
    it.skip('if selection is on a single column', async () => {
      await pageInit(defaultTable);
      const from = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 2, cell: 1 });
      await showContextMenuSelection(page, from, to);
      await snapshot(page);
    });

    // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
    it.skip('if there will not be any change after resizing', async () => {
      await pageInit(mergedColumnsResized);
      const from = getSelectorForTableCell({
        row: 5,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 5, cell: 2 });

      // resized table is first distributed, and then trying to show the context menu on the same selection afterwards
      await distributeColumns(page, from, to);
      await showContextMenuSelection(page, from, to);
      await snapshot(page);
    });
  });

  describe('all of the columns should distribute and new added column should have uniform width', () => {
    // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
    it.skip('on table without overflow', async () => {
      await pageInit(defaultTableResizedWithoutOverflow);
      await distributeAllColumns(page);
      await insertColumn(page, 0, 'right', true);
      await insertColumn(page, 0, 'right', true);
      await insertColumn(page, 0, 'right', true);
      await snapshot(page);
    });

    // re-enable this test: https://product-fabric.atlassian.net/browse/ED-13630
    it.skip('on table with overflow', async () => {
      await pageInit(defaultTableResizedWithOverflow);
      await distributeAllColumns(page);
      await insertColumn(page, 0, 'right', true);
      await insertColumn(page, 0, 'right', true);
      await insertColumn(page, 0, 'right', true);
      await snapshot(page);
    });
  });
});
