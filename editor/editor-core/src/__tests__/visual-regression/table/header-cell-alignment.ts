import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/table-with-header-content.adf.json';
import {
  clickFirstCell,
  getSelectorForTableCell,
} from '../../__helpers/page-objects/_table';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '../../__helpers/page-objects/_toolbar';

let page: PuppeteerPage;
const initEditor = async (adf: Object) => {
  await initEditorWithAdf(page, {
    appearance: Appearance.fullPage,
    adf,
    viewport: { width: 1040, height: 500 },
    editorProps: {
      allowTables: {
        allowHeaderRow: true,
        allowBackgroundColor: true,
        advanced: true,
      },
    },
  });
  await clickFirstCell(page, true);
};

describe('Snapshot Test: table header cell alignment', () => {
  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(adf);
    const headerCell = getSelectorForTableCell({
      row: 1,
      cell: 1,
    });

    await page.click(headerCell);

    await clickToolbarMenu(page, ToolbarMenuItem.alignment);
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
  });

  afterEach(async () => {
    await animationFrame(page);
    await animationFrame(page);
    await snapshot(page, {}, tableSelectors.tableWrapper);
  });

  // FIXME: This test was automatically skipped due to failure on 9/17/2021: https://product-fabric.atlassian.net/browse/ED-13774
  it.skip('should be able to apply left alignment to header cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentLeft);
  });

  it('should be able to apply center alignment to header cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentCenter);
  });

  it('should be able to apply right alignment to header cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentRight);
  });
});
