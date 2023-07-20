import { insertTable } from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

const firstCellSelector = 'table tbody th p';
const cellOptionsSelector = '[aria-label="Cell options"]';
const deleteColumnCellOptionSelector = '[aria-label="Delete column"]';
const deleteRowCellOptionSelector = '[aria-label="Delete row"]';

const emptyDocAdf = {
  version: 1,
  type: 'doc',
  content: [],
};

describe('Table cell options menu', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(
      page,
      emptyDocAdf,
      undefined,
      undefined,
      {},
      undefined,
      undefined,
      true,
      false,
      undefined,
      {
        group: 'editor',
        packageName: 'editor-plugin-table',
        exampleName: 'testing',
      },
    );
    await insertTable(page);
    page.waitForSelector(firstCellSelector);

    // move the focus to the first table cell
    await page.type(firstCellSelector, 'focus table cell');
  });

  describe('delete column menu item', () => {
    it('visual hints should be added to the table column on hover', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // hover over the table cell options Delete column entry
      await page.waitForSelector(deleteColumnCellOptionSelector);
      await page.hover(deleteColumnCellOptionSelector);

      await snapshot(page);
    });

    it('should remove the table column on click', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // click the table cell options Delete column entry
      await page.waitForSelector(deleteColumnCellOptionSelector);
      await page.click(deleteColumnCellOptionSelector);

      await snapshot(page);
    });
  });

  describe('delete row menu item', () => {
    it('visual hints should be added to the table row on hover', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // hover over the table cell options Delete row entry
      await page.waitForSelector(deleteRowCellOptionSelector);
      await page.hover(deleteRowCellOptionSelector);

      await snapshot(page);
    });

    it('should remove the table row on click', async () => {
      // open the table cell options menu
      await page.waitForSelector(cellOptionsSelector);
      await page.click(cellOptionsSelector);

      // click the table cell options Delete row entry
      await page.waitForSelector(deleteColumnCellOptionSelector);
      await page.click(deleteRowCellOptionSelector);

      await snapshot(page);
    });
  });
});
