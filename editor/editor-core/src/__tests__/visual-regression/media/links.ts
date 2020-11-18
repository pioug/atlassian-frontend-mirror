import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
  initFullPageEditorWithAdf,
} from '../_utils';
import * as linkADf from './__fixtures__/mediasingle-and-media-with-link-mark.json';
import { waitForMediaToBeLoaded } from '../../__helpers/page-objects/_media';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
    });
  });

  describe('Media Linking Toolbar', () => {
    describe('CMD+K menu', () => {
      it('should show dropdown menu', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await page.keyboard.down('Control');
        await page.keyboard.press('KeyK');
        await page.keyboard.up('Control');

        await page.waitForSelector('[data-testid="link-url"]', {
          visible: true,
        });

        await retryUntilStablePosition(
          page,
          () => page.click('[data-testid="link-url"]'),
          '[aria-label="Floating Toolbar"]',
          1000,
        );

        await snapshot(page);
      });

      it('should not trigger search if input is a URL', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await page.keyboard.down('Control');
        await page.keyboard.press('KeyK');
        await page.keyboard.up('Control');

        await page.waitForSelector('[data-testid="link-url"]', {
          visible: true,
        });
        await page.type(
          '[data-testid="link-url"]',
          'https://www.atlassian.com',
        );

        await retryUntilStablePosition(
          page,
          () => page.click('[data-testid="link-url"]'),
          '[aria-label="Floating Toolbar"]',
          1000,
        );

        await snapshot(page);
      });
    });
  });

  describe('MediaSingle and Media with link marks', () => {
    it('renders', async () => {
      const { page } = global;

      await initFullPageEditorWithAdf(page, linkADf);

      await waitForMediaToBeLoaded(page);
      await snapshot(page);
    });
  });
});
