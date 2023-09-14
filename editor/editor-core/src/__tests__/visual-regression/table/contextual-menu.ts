import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/default-table.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  selectTableOption,
  clickCellOptions,
  tableSelectors,
  navigateToTableCell,
  getSelectorForTableCell,
  mergeCells,
  splitCells,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKeyCombo } from '@atlaskit/editor-test-helpers/page-objects/keyboard';

describe('Table contextual menu: fullpage', () => {
  let page: PuppeteerPage;
  const pageInit = async (viewport?: { width: number; height: number }) => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, undefined, viewport);
    await clickFirstCell(page);
  };

  describe('non-numbered column', () => {
    beforeAll(async () => {
      await pageInit();
    });
    it('toggles the context menu correctly', async () => {
      await clickCellOptions(page);
      await retryUntilStablePosition(
        page,
        async () => {
          await page.waitForSelector(tableSelectors.contextualMenu);
        },
        tableSelectors.contextualMenu,
      );
      await snapshot(page);
      await clickCellOptions(page);
      await retryUntilStablePosition(
        page,
        async () => {
          await page.waitForSelector(tableSelectors.contextualMenu, {
            hidden: true,
          });
        },
        tableSelectors.tableWrapper,
      );
      await snapshot(page);
    });

    it('ensures contextual menu button styles are correct', async () => {
      await page.mouse.move(0, 0);
      await snapshot(page, {}, tableSelectors.topLeftCell);
    });
  });
  describe('contextual menu position', () => {
    beforeEach(async () => {
      await pageInit();
    });
    it('update contextual menu button position when number column changes', async () => {
      await selectTableOption(page, 'Numbered column');
      await page.mouse.move(0, 0);
      await snapshot(page);
    });
    it('ensures contextual menu button is positioned correctly after adding column to the right with shortcut key', async () => {
      await navigateToTableCell(page, 1, 2);
      await pressKeyCombo(page, ['Control', 'Alt', 'ArrowRight']);
      await snapshot(page);
    });
    it('ensures contextual menu button is positioned correctly after splitting, merging cells, and undo-ing', async () => {
      const from = getSelectorForTableCell({
        row: 2,
        cell: 1,
      });
      const to = getSelectorForTableCell({ row: 3, cell: 2 });
      await mergeCells(page, from, to);
      await splitCells(page, from);

      // undo to re-merge
      await pressKeyCombo(page, ['Meta', 'KeyZ']);
      await retryUntilStablePosition(
        page,
        async () => {
          await page.waitForSelector(tableSelectors.contextualMenuButton);
        },
        tableSelectors.tableWrapper,
      );
      await snapshot(page);
    });
  });
  describe('contextual menu position in smaller viewport', () => {
    beforeEach(async () => {
      await pageInit({ width: 768, height: 768 });
    });
    // TODO: https://product-fabric.atlassian.net/browse/ED-13527
    it.skip('ensures context menu is positioned correctly when there is not enought space right side of menu button ', async () => {
      await navigateToTableCell(page, 1, 3);
      await clickCellOptions(page);
      await snapshot(page);
    });
  });
});
