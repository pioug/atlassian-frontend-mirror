import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { retryUntilStablePosition } from '../../__helpers/page-objects/_toolbar';
import { Appearance, initEditorWithAdf, snapshot } from '../_utils';

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
    });
  });
});
