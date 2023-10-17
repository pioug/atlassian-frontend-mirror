import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  retryUntilStablePosition,
  triggerHyperLinkToolBar,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import * as linkADf from './__fixtures__/mediasingle-and-media-with-link-mark.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mediaResizeSelectors,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';

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

      // FIXME: This test was automatically skipped due to failure on 14/10/2023: https://product-fabric.atlassian.net/browse/ED-20477
      it.skip('should not trigger search if input is a URL', async () => {
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

      // FIXME: Skipped due to failure on https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1792434/steps/%7B30ecc0ff-13da-401b-b1b5-e827876743fa%7D/test-report
      it.skip("shouldn't submit after clicking between inputs", async () => {
        await page.mouse.move(0, 0); // Prevent keep mouse over the button. (This cause to sometimes highlight the button)
        await page.click('.ProseMirror');

        await triggerHyperLinkToolBar(page);

        await page.click('[data-testid="link-url"]');
        await page.type(
          '[data-testid="link-url"]',
          'https://www.atlassian.com',
        );

        // test that it doesn't just insert the url after switching to the other input
        await page.click('[data-testid="link-text"]');
        await page.type('[data-testid="link-text"]', 'Hello world!');

        await retryUntilStablePosition(
          page,
          () => page.click('[data-testid="link-url"]'),
          '[aria-label="Floating Toolbar"]',
          1000,
        );

        await snapshot(page);
      });

      it('should highlight items with mouse over', async () => {
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

  describe('Media with link mark', () => {
    it('renders', async () => {
      const { page } = global;

      await initFullPageEditorWithAdf(page, linkADf);

      await waitForMediaToBeLoaded(page);
      await retryUntilStablePosition(
        page,
        async () => await page.waitForSelector(mediaResizeSelectors.left),
        mediaResizeSelectors.left,
      );
      await snapshot(page);
    });
  });
});
