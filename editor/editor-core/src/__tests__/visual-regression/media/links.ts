// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mediaResizeSelectors,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  retryUntilStablePosition,
  triggerHyperLinkToolBar,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as linkADf from './__fixtures__/mediasingle-and-media-with-link-mark.json';

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

  // FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
  // Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
  describe.skip('Media with link mark', () => {
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
