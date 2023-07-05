import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import stickyHeaderWithHorizontalScroll from './__fixtures__/sticky-header-with-horizontal-scroll.json';
import { scrollToElement } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';

const initEditor = async (page: PuppeteerPage, adf: any) => {
  await initEditorWithAdf(
    page,
    {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1280, height: 868 },
      editorProps: {
        allowTables: {
          stickyHeaders: true,
          allowColumnResizing: true,
        },
      },
    },
    {
      group: 'editor',
      packageName: 'editor-plugin-table',
      exampleName: 'testing',
    },
  );
};

describe('Snapshot Test: Table', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  describe('sticky header', () => {
    it('should align with table cell when active', async () => {
      await initEditor(page, stickyHeaderWithHorizontalScroll);

      await clickFirstCell(page, true);
      // Mouse was inside the table and would cause the column resizer to trigger occasionally
      await page.mouse.move(0, 0);

      // scroll to bottom center to see scroll shadows
      await scrollToElement(page, 'ol > li');
      await snapshot(page);

      // scroll to bottom right
      await scrollToElement(page, 'ul > li');
      await snapshot(page);
    });
  });
});
