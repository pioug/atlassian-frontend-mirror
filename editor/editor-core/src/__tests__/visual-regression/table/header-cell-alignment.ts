import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-with-header-content.adf.json';
import {
  clickFirstCell,
  getSelectorForTableCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { tableSelectors } from '@atlaskit/editor-test-helpers/page-objects/table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

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

  it('should be able to apply left alignment to header cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentLeft);
  });

  it('should be able to apply center alignment to header cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentCenter);
  });

  it('should be able to apply right alignment to header cell', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentRight);
  });
});
