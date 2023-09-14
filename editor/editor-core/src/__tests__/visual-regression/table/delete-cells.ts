// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/full-width-table.adf.json';
import tableWithFirstColumnMerged from './__fixtures__/table-3x3-with-two-cells-merged-on-first-row.adf.json';
import tableWithBottomRightColMerged from './__fixtures__/table-3x3-with-two-cells-merged-bottom-right-column.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  tableSelectors,
  clickFirstCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Delete in table:', () => {
  let page: PuppeteerPage;
  beforeAll(async () => {
    page = global.page;
  });

  const initEditor = async (adf: Object) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1440, height: 400 },
    });
    await clickFirstCell(page, true);
  };

  describe(`Full page`, () => {
    beforeEach(async () => {
      await initEditor(adf);
    });

    afterEach(async () => {
      await snapshot(page);
    });

    it('should show danger when hovers on remove for row', async () => {
      await page.waitForSelector(tableSelectors.firstRowControl);
      await page.click(tableSelectors.firstRowControl);
      await page.waitForSelector(tableSelectors.removeRowButton);
      await page.hover(tableSelectors.removeRowButton);
      await page.waitForSelector(tableSelectors.removeDanger);
    });

    it(`should show danger when hovers on remove for column`, async () => {
      await page.waitForSelector(tableSelectors.firstColumnControl);
      await page.click(tableSelectors.firstColumnControl);
      await page.waitForSelector(tableSelectors.removeColumnButton);
      await page.hover(tableSelectors.removeColumnButton);
      await page.waitForSelector(tableSelectors.removeDanger);
    });

    describe('should show danger when hovers to remove table', () => {
      describe('for 3x3 table with no merged cells', () => {
        it(`should show danger when hovers to remove table`, async () => {
          await page.waitForSelector(tableSelectors.removeTable);
          await page.hover(tableSelectors.removeTable);
          await page.waitForSelector(tableSelectors.removeDanger);
        });
      });

      describe('for 3x3 table with merged cells', () => {
        beforeEach(async () => {
          await initEditor(tableWithBottomRightColMerged);
        });

        it(`should show danger when hovers to remove table`, async () => {
          await page.waitForSelector(tableSelectors.removeTable);
          await page.hover(tableSelectors.removeTable);
          await page.waitForSelector(tableSelectors.removeDanger);
        });
      });
    });

    describe('with cells merged', () => {
      describe('first two row cells merged', () => {
        beforeEach(async () => {
          await initEditor(tableWithFirstColumnMerged);
        });

        it('should show danger when hovers to remove merged column', async () => {
          await page.waitForSelector(tableSelectors.firstColumnControl);
          await page.click(tableSelectors.firstColumnControl);
          await page.waitForSelector(tableSelectors.removeColumnButton);
          await page.hover(tableSelectors.removeColumnButton);
          await page.waitForSelector(tableSelectors.removeDanger);
        });
      });
    });

    describe('middle and bottom right row ', () => {
      beforeEach(async () => {
        await initEditor(tableWithBottomRightColMerged);
      });

      it('should show danger when hovers to remove merged row', async () => {
        // First row index starts at 1
        await page.waitForSelector(tableSelectors.nthRowControl(2));
        await page.click(tableSelectors.nthRowControl(2));
        await page.waitForSelector(tableSelectors.removeRowButton);
        await page.hover(tableSelectors.removeRowButton);
        await page.waitForSelector(tableSelectors.removeDanger);
      });

      it('should show danger when hovers to remove last two cols', async () => {
        // First column index starts at 0
        await page.waitForSelector(tableSelectors.nthColumnControl(1));
        await page.click(tableSelectors.nthColumnControl(1));
        await page.keyboard.down('Shift'); // Select multiple cols
        await page.keyboard.down('ArrowRight');
        await page.waitForSelector(tableSelectors.removeColumnButton);
        await page.hover(tableSelectors.removeColumnButton);
        await page.waitForSelector(tableSelectors.removeDanger);
      });
    });
  });
});
