import {
  initEditorWithAdf,
  Appearance,
  Device,
  initFullPageEditorWithAdf,
  snapshot,
} from '../_utils';
import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  selectCellOption,
  getSelectorForTableCell,
  hoverCellOption,
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import {
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';
import { EditorProps } from '../../../types';
import adfWithMergedRows from './__fixtures__/table-with-merged-rows.adf.json';
import adfWithMedia from './__fixtures__/table-with-media.adf.json';

describe('Table sorting', () => {
  let page: PuppeteerPage;
  const editorProps: EditorProps = {
    allowTables: {
      allowColumnSorting: true,
    },
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe('when there is big cells', () => {
    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: adfWithMedia,
        viewport: { width: 800, height: 600 },
        editorProps,
      });

      await clickFirstCell(page, false);
    });

    it('should update rows controls', async () => {
      const firstCell = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });

      await page.click(firstCell);
      await selectCellOption(page, tableSelectors.sortColumnDESC);
      await animationFrame(page);
      await animationFrame(page);
      await snapshot(
        page,
        { tolerance: 0, useUnsafeThreshold: true },
        `.${tableSelectors.rowControls}`,
      );
    });

    describe('when an undo happens', () => {
      it('should update rows controls', async () => {
        const firstCell = getSelectorForTableCell({
          row: 1,
          cell: 1,
        });

        await page.click(firstCell);
        await selectCellOption(page, tableSelectors.sortColumnDESC);

        await animationFrame(page);
        await animationFrame(page);

        await pressKeyDown(page, 'Control');
        await pressKeyDown(page, 'KeyZ');
        await pressKeyUp(page, 'KeyZ');
        await pressKeyUp(page, 'Control');
        await animationFrame(page);
        await animationFrame(page);
        await snapshot(
          page,
          { tolerance: 0, useUnsafeThreshold: true },
          `.${tableSelectors.rowControls}`,
        );
      });
    });
  });

  describe('when there is merged cells', () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(
        page,
        adfWithMergedRows,
        Device.LaptopHiDPI,
        undefined,
        editorProps,
      );
      await clickFirstCell(page);
    });

    it('should hovered the merged cells', async () => {
      const firstCell = getSelectorForTableCell({
        row: 1,
        cell: 1,
      });

      await page.click(firstCell);
      await hoverCellOption(page, tableSelectors.sortColumnASC);
      await waitForTooltip(page);
      await snapshot(page, {}, tableSelectors.tableWrapper);
    });
  });
});
