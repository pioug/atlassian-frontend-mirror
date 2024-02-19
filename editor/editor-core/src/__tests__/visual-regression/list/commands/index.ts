/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  emulateSelectAll,
  initFullPageEditorWithAdf,
  pmSelector,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import textListADF from './__fixtures__/text-and-list.adf.json';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {});
}

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: list commands', () => {
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
