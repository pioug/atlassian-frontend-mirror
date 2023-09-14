// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  initFullPageEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  getSelectorForTableCell,
  clickFirstCell,
  mergeCells,
  splitCells,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKeyCombo } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import adf from './__fixtures__/default-table.adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

describe('Table context menu: merge-split cells', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe('with table cell optimization and sticky headers enabled', () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adf, undefined, undefined, {
        allowTables: {
          advanced: true,
          stickyHeaders: true,
        },
      });
      await clickFirstCell(page);
    });

    it('ensures table looks ok after merging cells in first column and undo', async () => {
      const from = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 2, cell: 3 });
      await mergeCells(page, from, to);
      await snapshot(page);
      // undo the merge
      // Meta key doesnt work here
      await pressKeyCombo(page, ['Control', 'KeyZ']);
      await snapshot(page);
    });

    it('ensures table looks ok after merging and splitting cells in second column', async () => {
      const firstCell = getSelectorForTableCell({
        row: 1,
        cell: 2,
      });
      let lastCell = getSelectorForTableCell({ row: 3, cell: 2 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });
  });

  const tableMergeAndSplitCells = async (
    firstCell: string,
    lastCell: string,
  ) => {
    await mergeCells(page, firstCell, lastCell);
    await waitForFloatingControl(page, 'Table floating controls');
    await snapshot(page);
    await splitCells(page, firstCell);
    await waitForFloatingControl(page, 'Table floating controls');
    await snapshot(page);
  };

  describe('should merge and split cell', () => {
    beforeEach(async () => {
      await initEditorWithAdf(page, {
        adf,
        appearance: Appearance.fullPage,
        viewport: { width: 1280, height: 600 },
      });
      await clickFirstCell(page, true);
    });

    // expect first column cells to become table header cells after split
    it(`for first column`, async () => {
      const firstCell = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });
      let lastCell = getSelectorForTableCell({ row: 3, cell: 1 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });

    it(`for second column`, async () => {
      const firstCell = getSelectorForTableCell({
        row: 1,
        cell: 2,
      });
      let lastCell = getSelectorForTableCell({ row: 3, cell: 2 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });

    it(`for row`, async () => {
      const firstCell = getSelectorForTableCell({ row: 2, cell: 1 });
      const lastCell = getSelectorForTableCell({ row: 2, cell: 3 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });

    it(`for row+col`, async () => {
      const firstCell = getSelectorForTableCell({ row: 2, cell: 1 });
      const lastCell = getSelectorForTableCell({ row: 3, cell: 2 });
      await tableMergeAndSplitCells(firstCell, lastCell);
    });
  });
});
