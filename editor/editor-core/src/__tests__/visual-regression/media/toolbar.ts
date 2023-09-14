// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickMediaInPosition,
  mediaImageSelector,
  waitForActivityItems,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import mediaSingleVideoAlignmentAdf from './__fixtures__/mediaSingle-video-alignment.adf.json';
import mediaSingleVideoWrapAdf from './__fixtures__/mediaSingle-video-wrap.adf.json';
import videoInsideExpandAdf from './__fixtures__/video-inside-expand-toolbar.adf.json';
import mediaSingleAdf from './__fixtures__/mediaSingle-image.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { scrollToBottom } from '@atlaskit/editor-test-helpers/page-objects/editor';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;

  const makeSnapshot = async (page: PuppeteerPage) => {
    await snapshot(page, undefined, undefined, {
      captureBeyondViewport: false,
    });
  };

  describe('Media Linking Toolbar', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: mediaSingleAdf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
      });
      await waitForMediaToBeLoaded(page);
      await page.click(mediaImageSelector);
    });

    // TODO: Unskip flaky tests (ED-15254)
    describe.skip('Media Single', () => {
      it('should show add link button', async () => {
        await makeSnapshot(page);
      });

      it('should open media linking toolbar', async () => {
        await page.waitForSelector('[aria-label="Add link"]');
        await page.click('[aria-label="Add link"]');
        await waitForActivityItems(page, 5);
        await page.mouse.move(0, 0);

        await makeSnapshot(page);
      });

      it('should show edit media linking toolbar', async () => {
        await page.waitForSelector('[aria-label="Add link"]');
        await page.click('[aria-label="Add link"]');
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await waitForActivityItems(page, 5);
        await pressKey(page, ['ArrowDown', 'Enter']);
        await retryUntilStablePosition(
          page,
          async () => await clickMediaInPosition(page, 0),
          '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"] [aria-label="Edit link"]',
          1000,
        );
        await scrollToBottom(page);

        await makeSnapshot(page);
      });

      it('should show edit media linking toolbar after pressing Ctrl+K', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyK');
        await page.keyboard.up('Control');
        const selector = `input[placeholder="Paste or search for link"]`;
        await page.waitForSelector(selector);
        const input = await page.$(selector);
        await waitForActivityItems(page, 5);

        expect(input).not.toBeNull();
        await makeSnapshot(page);
      });

      // TODO: Unskip flaky tests (ED-15254)
      it.skip('should show error message when entering invalid link', async () => {
        await page.waitForSelector('[aria-label="Add link"]');
        await page.click('[aria-label="Add link"]');
        await waitForActivityItems(page, 5);
        await page.waitForSelector('[data-testid="media-link-input"]', {
          visible: true,
        });
        await page.keyboard.type('invalid link');
        await pressKey(page, ['Enter']);
        const error = await page.waitForSelector('[aria-label="error"]', {
          visible: true,
        });
        await scrollToBottom(page);
        await page.mouse.move(0, 0);

        expect(error).toBeTruthy();
        await makeSnapshot(page);
      });
    });
  });

  describe('MediaSingle video file', () => {
    beforeEach(async () => {
      page = global.page;
    });

    it('should show floating toolbar center relatively to the file with wrap-left layout', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: mediaSingleVideoWrapAdf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
        },
      });

      await waitForMediaToBeLoaded(page);
      await page.click('[data-testid="media-card-inline-player"]');
      await makeSnapshot(page);
    });

    it('should show floating toolbar center relatively to the file with align-start layout', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: mediaSingleVideoAlignmentAdf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
        },
      });

      await waitForMediaToBeLoaded(page);
      await page.click('[data-testid="media-card-inline-player"]');
      await makeSnapshot(page);
    });

    it('should render seperators correctly when placed inside an expand', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: videoInsideExpandAdf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
            allowAltTextOnImages: true,
          },
          allowExpand: true,
        },
      });
      await waitForMediaToBeLoaded(page);
      await makeSnapshot(page);
    });
  });
});
