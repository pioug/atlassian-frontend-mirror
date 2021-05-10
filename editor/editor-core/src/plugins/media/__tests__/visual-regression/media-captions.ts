import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import { waitForMediaToBeLoaded } from '../../../../__tests__/__helpers/page-objects/_media';
import * as mediaAdf from './__fixtures__/media.adf.json';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

async function initEditor(page: PuppeteerPage) {
  await initFullPageEditorWithAdf(
    page,
    mediaAdf,
    Device.LaptopMDPI,
    undefined,
    {
      media: {
        allowMediaSingle: true,
        featureFlags: {
          captions: true,
        },
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
