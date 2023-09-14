import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { initFullPageEditorWithAdf } from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
import * as mediaAdf from './__fixtures__/media-full-width.adf.json';

async function initEditor(page: PuppeteerPage, screenWidth: Device) {
  await initFullPageEditorWithAdf(page, mediaAdf, screenWidth, undefined, {
    media: {
      allowMediaSingle: true,
    },
  });

  await waitForMediaToBeLoaded(page);
}

describe('Full width media', () => {
  let page: PuppeteerPage;

  const devices = [Device.LaptopMDPI, Device.iPhonePlus];

  beforeEach(() => {
    page = global.page;
  });

  describe.each(devices)('in %s', (device) => {
    it('should be wider or equal to the container width', async () => {
      await initEditor(page, device);
      await waitForMediaToBeLoaded(page);

      const mediaWidth = await page.evaluate(
        () =>
          (document.querySelector('.akEditor .rich-media-item') as HTMLElement)
            ?.offsetWidth || 0,
      );

      const containerWidth = await page.evaluate(
        () =>
          (document.querySelector('.akEditor .ProseMirror') as HTMLElement)
            ?.offsetWidth || 0,
      );

      expect(mediaWidth).toBeGreaterThanOrEqual(containerWidth);
    });
  });
});
