import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import {
  emojiSelectors,
  waitForEmojis,
} from '../../../../__tests__/__helpers/page-objects/_emoji';
import {
  clickMediaInPosition,
  waitForMediaToBeLoaded,
} from '../../../../__tests__/__helpers/page-objects/_media';
import captionWithDate from './__fixtures__/caption-with-date.adf.json';
import captionWithEmoji from './__fixtures__/caption-with-emoji.adf.json';
import captionWithLongText from './__fixtures__/caption-with-long-text.adf.json';
import captionWithMention from './__fixtures__/caption-with-mention.adf.json';
import captionWithStatus from './__fixtures__/caption-with-status.adf.json';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';

async function initEditor(page: PuppeteerPage, adf: object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {
    media: {
      allowMediaSingle: true,
      featureFlags: {
        captions: true,
      },
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
    describe('when caption feature flag is enabled', () => {
      afterEach(async () => {
        await snapshot(page);
      });

      it('should show the caption with a date', async () => {
        await initEditor(page, captionWithDate);
      });

      it('should show the caption with an emoji', async () => {
        await initEditor(page, captionWithEmoji);
        await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
        await page.waitForSelector(
          '.emoji-common-node[aria-label=":slight_smile:"]',
        );
        await waitForEmojis(page);
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
});
