import { snapshot, Device, initFullPageEditorWithAdf } from '../_utils';
import * as mediaGroup from './__fixtures__/mediaGroup.adf.json';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Snapshot Test: Media group download', () => {
  describe('full page editor', () => {
    it('should display download button', async () => {
      const { page } = global;

      await initFullPageEditorWithAdf(
        page,
        mediaGroup,
        Device.Default,
        { width: 1000, height: 400 },
        {
          media: {
            enableDownloadButton: true,
            featureFlags: {
              newCardExperience: true,
            },
          },
        },
      );

      const mediaCardSelector = `[data-testid="media-file-card-view"][data-test-status="complete"]`;
      await page.waitForSelector(mediaCardSelector);
      await page.hover(mediaCardSelector);
      await sleep(500);

      await snapshot(page);
    });
  });
});
