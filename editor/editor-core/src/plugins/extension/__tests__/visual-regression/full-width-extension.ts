import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import fullWidthExtensionADF from './__fixtures__/full-width-extension-inside-bodied-extension.adf.json';

async function initEditor(page: PuppeteerPage, adf: Object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {});
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
  });
});
