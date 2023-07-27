import { scrollToElement } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import stickyHeaderWithHorizontalScroll from './__fixtures__/sticky-header-with-horizontal-scroll.json';

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
    // FIXME: This test was automatically skipped due to failure on 26/07/2023: https://product-fabric.atlassian.net/browse/ED-19223
    it.skip('should align with table cell when active', async () => {
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
