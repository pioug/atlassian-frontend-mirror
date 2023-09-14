import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForEmojisToLoad } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickMediaInPosition,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import captionWithDate from './__fixtures__/caption-with-date.adf.json';
import captionWithEmoji from './__fixtures__/caption-with-emoji.adf.json';
import captionWithLongText from './__fixtures__/caption-with-long-text.adf.json';
import captionWithMention from './__fixtures__/caption-with-mention.adf.json';
import captionWithStatus from './__fixtures__/caption-with-status.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

async function initEditor(page: PuppeteerPage, adf: object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {
    media: {
      allowMediaSingle: true,
      allowCaptions: true,
    },
  });

  await waitForMediaToBeLoaded(page);

  await retryUntilStablePosition(
    page,
    () => clickMediaInPosition(page, 0), // this is the operation you want to perform, which also makes the floating toolbar visible. Usually a page.click()
    '[aria-label*="Media floating controls"]', // this is the toolbar (or any other) selector whose position you want settled before continuing
    1000, // this is the duration between the periodic positioning checks - I recommend trying with 1000ms first.
  );
}

describe('Snapshot Test: Caption with media', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('content', () => {
    afterEach(async () => {
      await snapshot(page);
    });

    it('should show the caption with a date', async () => {
      await initEditor(page, captionWithDate);
    });

    it('should show the caption with an emoji', async () => {
      await initEditor(page, captionWithEmoji);
      await waitForEmojisToLoad(page);
    });

    it('should show the caption with a long text', async () => {
      await initEditor(page, captionWithLongText);
    });

    it('should show the caption with a mention', async () => {
      await initEditor(page, captionWithMention);
    });

    it('should show the caption with a status', async () => {
      await initEditor(page, captionWithStatus);
    });
  });
});
