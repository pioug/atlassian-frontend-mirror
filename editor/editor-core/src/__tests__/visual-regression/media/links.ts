import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  retryUntilStablePosition,
  triggerHyperLinkToolBar,
} from '../../__helpers/page-objects/_toolbar';
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

        await triggerHyperLinkToolBar(page);

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

        await triggerHyperLinkToolBar(page);
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

      it("shouldn't submit after clicking between inputs", async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await triggerHyperLinkToolBar(page);

        await page.click('[data-testid="link-url"]');
        await page.type(
          '[data-testid="link-url"]',
          'https://www.atlassian.com',
        );

        // test that it doesn't just insert the url after switching to the other input
        await page.click('[data-testid="link-label"]');
        await page.type('[data-testid="link-label"]', 'Hello world!');

        await retryUntilStablePosition(
          page,
          () => page.click('[data-testid="link-url"]'),
          '[aria-label="Floating Toolbar"]',
          1000,
        );

        await snapshot(page);
      });

      // FIXME: This test was automatically skipped due to failure on 9/17/2021: https://product-fabric.atlassian.net/browse/ED-13772
      it.skip('should highlight items with mouse over', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await triggerHyperLinkToolBar(page);

        await retryUntilStablePosition(
          page,
          () => page.hover('[data-testid="link-search-list-item"]'),
          '[aria-label="Floating Toolbar"]',
          1000,
        );

        await snapshot(page);
      });

      it('should not highligh items when mouse move away from result item', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await triggerHyperLinkToolBar(page);

        await retryUntilStablePosition(
          page,
          () => page.hover('[data-testid="link-search-list-item"]'),
          '[aria-label="Floating Toolbar"]',
          1000,
        );
        await page.mouse.move(0, 0);

        await snapshot(page);
      });

      it('should populate Url field with selected item using keyboard', async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await triggerHyperLinkToolBar(page);
        await page.keyboard.press('ArrowDown');

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
