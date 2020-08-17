import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/full-width-table.adf.json';
import tableWithFirstColumnMerged from './__fixtures__/table-3x3-with-two-cells-merged-on-first-row.adf.json';
import {
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

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

    it(`should show danger when hovers to remove table`, async () => {
      await page.waitForSelector(tableSelectors.removeTable);
      await page.hover(tableSelectors.removeTable);
      await waitForTooltip(page);
      await page.waitForSelector(tableSelectors.removeDanger);
    });

    describe('with cell merged', () => {
      beforeEach(async () => {
        await initEditor(tableWithFirstColumnMerged);
      });

      it('should show danger when hovers to remove column', async () => {
        await page.waitForSelector(tableSelectors.firstColumnControl);
        await page.click(tableSelectors.firstColumnControl);
        await page.waitForSelector(tableSelectors.removeColumnButton);
        await page.hover(tableSelectors.removeColumnButton);
        await page.waitForSelector(tableSelectors.removeDanger);
      });
    });
  });
});
