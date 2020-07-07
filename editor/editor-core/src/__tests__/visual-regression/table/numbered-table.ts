import {
  clickFirstCell,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import {
  Device,
  initCommentEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
  editorCommentContentSelector,
} from '../_utils';
import adf from './__fixtures__/numbered-table.adf.json';
import tableWithContentAdf from './__fixtures__/numbered-table-with-content.adf.json';
import multipleTablesAdf from './__fixtures__/numbered-table-multiple.adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Snapshot Test: numbered table', () => {
  let page: Page;

  beforeAll(async () => {
    page = global.page;
  });

  it('looks correct for fullpage', async () => {
    await initFullPageEditorWithAdf(page, multipleTablesAdf, Device.LaptopMDPI);
    await clickFirstCell(page);
    await snapshot(page);
  });

  it('looks correct  for comment', async () => {
    await initCommentEditorWithAdf(page, multipleTablesAdf, Device.LaptopMDPI);
    await clickFirstCell(page);
    await snapshot(page, undefined, editorCommentContentSelector);
  });

  it('should show insert button when mouse is hover numbered button', async () => {
    await initFullPageEditorWithAdf(page, adf);
    await clickFirstCell(page);
    await page.hover(tableSelectors.nthRowControl(2));
    await page.waitFor(tableSelectors.insertRowButton);
    await snapshot(page);
  });

  it('should show numbered column correctly', async () => {
    await initFullPageEditorWithAdf(page, tableWithContentAdf);
    await snapshot(page);
  });
});
