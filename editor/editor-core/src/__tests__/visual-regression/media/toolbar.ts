import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  insertMedia,
  waitForMediaToBeLoaded,
  clickMediaInPosition,
  clickOnToolbarButton,
  MediaToolbarButton,
  waitForActivityItems,
} from '../../__helpers/page-objects/_media';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;
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

  describe('Media Linking Toolbar', () => {
    describe('Media Single', () => {
      beforeEach(async () => {
        // now we can insert media as necessary
        await insertMedia(page);
        await waitForMediaToBeLoaded(page);
        await clickMediaInPosition(page, 0);
      });

      it('should show add link button', async () => {
        await snapshot(page);
      });

      it('should open media linking toolbar', async () => {
        await clickOnToolbarButton(page, MediaToolbarButton.addLink);

        await waitForActivityItems(page, 5);
        await snapshot(page);
      });

      it('should show edit media linking toolbar', async () => {
        await clickOnToolbarButton(page, MediaToolbarButton.addLink);
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await waitForActivityItems(page, 5);

        await pressKey(page, ['ArrowDown', 'Enter']);

        await snapshot(page);
      });

      it('should show edit media linking toolbar after pressing Ctrl+K', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)

        await page.keyboard.down('Control');
        await page.keyboard.press('KeyK');
        await page.keyboard.up('Control');

        const selector = `input[placeholder="Paste link or search recently viewed"]`;
        await page.waitForSelector(selector);
        const input = await page.$(selector);

        expect(input).not.toBeNull();

        await waitForActivityItems(page, 5);

        await snapshot(page);
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
        await snapshot(page);
      });
    });
  });
});
