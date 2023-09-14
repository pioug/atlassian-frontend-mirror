import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import fullWidthExtensionADF from './__fixtures__/full-width-extension-inside-bodied-extension.adf.json';
import extensionsWithFragmentMarks from './__fixtures__/extensions-with-fragment-marks.adf.json';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {
    allowFragmentMark: true,
    allowTables: true,
  });
}

describe('Snapshot Test: Full-Width Extension', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when full-width extension inserted into bodied extension', () => {
    afterEach(async () => {
      await snapshot(page);
    });

    it('should not overflow', async () => {
      await initEditor(page, fullWidthExtensionADF);
    });

    it('should have margins', async () => {
      await initEditor(page, extensionsWithFragmentMarks);
    });
  });
});
