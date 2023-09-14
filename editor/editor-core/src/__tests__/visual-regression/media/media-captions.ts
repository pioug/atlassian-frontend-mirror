import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
import * as mediaAdf from './__fixtures__/media.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

async function initEditor(page: PuppeteerPage) {
  await initFullPageEditorWithAdf(
    page,
    mediaAdf,
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        allowMediaSingle: true,
        allowCaptions: true,
      },
    },
  );

  await waitForMediaToBeLoaded(page);
}

describe('Snapshot Test: selected media with caption', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('when captions feature flag is enabled', () => {
    afterEach(async () => {
      await snapshot(page);
    });

    it('should show the placeholder when media is selected', async () => {
      await initEditor(page);
      await waitForMediaToBeLoaded(page);
      await retryUntilStablePosition(
        page,
        async () => await page.click('[data-testid="media-file-card-view"]'),
        '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"]',
        2000,
      );
    });
  });
});
