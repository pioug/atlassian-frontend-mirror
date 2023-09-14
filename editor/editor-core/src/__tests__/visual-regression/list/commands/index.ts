import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  snapshot,
  initFullPageEditorWithAdf,
  emulateSelectAll,
  pmSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import textListADF from './__fixtures__/text-and-list.adf.json';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {});
}

describe('Snapshot Test: list commands', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when all text are selected and toggled', () => {
    it('should convert all text to list', async () => {
      await initEditor(page, textListADF);

      await page.waitForSelector(pmSelector);

      // select all through keyboard
      await page.focus(pmSelector);
      await emulateSelectAll(page);

      await page.click('#editor-toolbar__bulletList');

      await snapshot(page);
    });
  });
});
