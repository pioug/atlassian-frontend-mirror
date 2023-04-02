import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import defaultTableResizedWithOverflow from './__fixtures__/default-table-resized.adf.json';
import defaultTableResizedWithoutOverflow from './__fixtures__/default-table-resized-no-overflow.adf.json';
import mergedColumnsResized from './__fixtures__/merged-columns-resized.adf.json';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  clickFirstCell,
  distributeColumns,
  distributeAllColumns,
  getSelectorForTableCell,
  insertColumn,
} from '@atlaskit/editor-test-helpers/page-objects/table';

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

    // FIXME: This test was automatically skipped due to failure on 01/04/2023: https://product-fabric.atlassian.net/browse/ED-17366
    it.skip('on a resized merged cells with colwidths', async () => {
      await pageInit(mergedColumnsResized);
      const from = getSelectorForTableCell({
        row: 5,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 5, cell: 2 });
      await distributeColumns(page, from, to);
      await animationFrame(page);
      await snapshot(page);
    });
  });

  describe('all of the columns should distribute and new added column should have uniform width', () => {
    it('on table without overflow', async () => {
      await pageInit(defaultTableResizedWithoutOverflow);
      await distributeAllColumns(page);
      await animationFrame(page);
      await insertColumn(page, 0, 'right', true);
      await animationFrame(page);
      await insertColumn(page, 0, 'right', true);
      await animationFrame(page);
      await insertColumn(page, 0, 'right', true);
      await animationFrame(page);
      await snapshot(page);
    });

    it('on table with overflow', async () => {
      await pageInit(defaultTableResizedWithOverflow);
      await distributeAllColumns(page);
      await animationFrame(page);
      await insertColumn(page, 0, 'right', true);
      await animationFrame(page);
      await insertColumn(page, 0, 'right', true);
      await animationFrame(page);
      await insertColumn(page, 0, 'right', true);
      await animationFrame(page);
      await snapshot(page);
    });
  });
});
