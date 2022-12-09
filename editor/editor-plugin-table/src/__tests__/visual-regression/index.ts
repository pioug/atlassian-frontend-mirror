import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import tableWith100ListItemsADF from './__fixtures__/table-with-100-numbered-list-items.json';
import {
  scrollToBottom,
  scrollToElement,
} from '@atlaskit/editor-test-helpers/page-objects/editor';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(
    page,
    adf,
    Device.LaptopMDPI,
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
}

describe('Snapshot Test: Table', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe('numbered list', () => {
    it('should not overflow table cell, when there are more than 100 ordered list items', async () => {
      await initEditor(page, tableWith100ListItemsADF);

      // initial elements
      await snapshot(page);

      // 100th elements
      await scrollToElement(page, 'ol > li:nth-of-type(120)');
      await snapshot(page);

      // 1000th elements
      await scrollToBottom(page);
      await snapshot(page);
    });
  });
});
