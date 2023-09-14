/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import * as mediaGroup from './__fixtures__/mediaGroup.adf.json';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

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
          },
        },
      );

      const mediaCardSelector = `[data-testid="media-file-card-view"][data-test-status="complete"]`;
      await page.waitForSelector(mediaCardSelector);
      await page.hover(mediaCardSelector);
      await sleep(500);

      await snapshot(page, undefined, mediaCardSelector);
    });
  });
});
