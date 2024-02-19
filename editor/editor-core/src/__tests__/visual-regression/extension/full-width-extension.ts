// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import extensionsWithFragmentMarks from './__fixtures__/extensions-with-fragment-marks.adf.json';
import fullWidthExtensionADF from './__fixtures__/full-width-extension-inside-bodied-extension.adf.json';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {
    allowFragmentMark: true,
    allowTables: true,
  });
}

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Full-Width Extension', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when full-width extension inserted into bodied extension', () => {
    afterEach(async () => {
      await snapshot(page);
    });

    it.skip('should not overflow', async () => {
      await initEditor(page, fullWidthExtensionADF);
    });

    it.skip('should have margins', async () => {
      await initEditor(page, extensionsWithFragmentMarks);
    });
  });
});
