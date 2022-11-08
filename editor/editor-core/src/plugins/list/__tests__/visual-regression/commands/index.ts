import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import textListADF from './__fixtures__/text-and-list.adf.json';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {});
}

describe('Snapshot Test: list commands', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when all text are selected and toggled', () => {
    // FIXME: This test was automatically skipped due to failure on 01/08/2022: https://product-fabric.atlassian.net/browse/ED-15364
    it.skip('should convert all text to list', async () => {
      await initEditor(page, textListADF);

      // select all through keyboard
      await page.focus('div[aria-label="Main content area"]');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');

      await page.click('#editor-toolbar__bulletList');

      await snapshot(page);
    });
  });
});
