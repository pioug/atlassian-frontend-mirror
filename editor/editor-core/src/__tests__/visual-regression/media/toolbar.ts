import { Appearance, initEditorWithAdf, snapshot } from '../_utils';
import {
  clickMediaInPosition,
  clickOnToolbarButton,
  insertMedia,
  MediaToolbarButton,
  waitForActivityItems,
  waitForMediaToBeLoaded,
} from '../../__helpers/page-objects/_media';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import mediaSingleVideoAligmentAdf from './__fixtures__/mediaSingle-video-alignment.adf.json';
import mediaSingleVideoWrapAdf from './__fixtures__/mediaSingle-video-wrap.adf.json';
import videoInsideExpandAdf from './__fixtures__/video-inside-expand-toolbar.adf.json';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';

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
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
      });
    });

    describe('Media Single', () => {
      beforeEach(async () => {
        // now we can insert media as necessary
        await insertMedia(page);
        await waitForMediaToBeLoaded(page);
        await clickMediaInPosition(page, 0);
      });

      it('should show add link button', async () => {
        await makeSnapshot(page);
      });

      it('should open media linking toolbar', async () => {
        await clickOnToolbarButton(page, MediaToolbarButton.addLink);

        await waitForActivityItems(page, 5);
        await makeSnapshot(page);
      });

      it('should show edit media linking toolbar', async () => {
        await clickOnToolbarButton(page, MediaToolbarButton.addLink);
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await waitForActivityItems(page, 5);

        await pressKey(page, ['ArrowDown', 'Enter']);

        await retryUntilStablePosition(
          page,
          async () => await clickMediaInPosition(page, 0),
          '[aria-label="Media floating controls"] [aria-label="Floating Toolbar"] [aria-label="Edit link"]',
          1000,
        );

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

        expect(input).not.toBeNull();

        await waitForActivityItems(page, 5);

        await makeSnapshot(page);
      });

      it('should show error message when entering invalid link', async () => {
        await clickOnToolbarButton(page, MediaToolbarButton.addLink);

        await waitForActivityItems(page, 5);
        await page.waitForSelector('[data-testid="media-link-input"]', {
          visible: true,
        });
        await page.keyboard.type('invalid link');
        await pressKey(page, ['Enter']);

        const error = await page.waitForSelector('[aria-label="error"]', {
          visible: true,
        });
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
      await page.click('[data-testid="media-file-card-view"]');
      await page.waitForSelector('[data-testid="media-card-inline-player"]');
      await page.click('[data-testid="media-card-inline-player"]');
      await makeSnapshot(page);
    });

    it('should show floating toolbar center relatively to the file with align-start layout', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: mediaSingleVideoAligmentAdf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
        },
      });

      await waitForMediaToBeLoaded(page);
      await page.click('[data-testid="media-file-card-view"]');
      await page.waitForSelector('[data-testid="media-card-inline-player"]');
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
