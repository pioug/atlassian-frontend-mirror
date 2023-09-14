/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  animationFrame,
  selectors,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
import {
  pressKeyDown,
  pressKeyUp,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import {
  clickToolbarMenu,
  retryUntilStablePosition,
  ToolbarMenuItem,
  waitForFloatingControl,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  evaluateTeardownMockDate,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

import hyperlinkWithTextAdf from '../__fixtures__/basic-hyperlink-with-text.adf.json';
import hyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';
import hyperlinkWithText from '../__fixtures__/hyperlink-with-text.adf.json';
import manyHyperlinksAdf from '../__fixtures__/many-hyperlinks.adf.json';
import mediaWithCaptionAdf from '../__fixtures__/media-with-caption.adf.json';

const click = async (page: any, selector: string) => {
  await page.waitForSelector(selector);
  await retryUntilStablePosition(
    page,
    () => page.click(selector),
    hyperlinkSelectors.floatingToolbar,
    1000,
  );
  await animationFrame(page);
};

describe('Hyperlink', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForFloatingControl(page, 'Hyperlink floating controls');
    await snapshot(page);
  });

  describe('floating toolbar', () => {
    beforeEach(async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: manyHyperlinksAdf,
        viewport: { width: 800, height: 400 },
      });
      await evaluateTeardownMockDate(page);
    });

    describe('heading', () => {
      // FIXME: This test was automatically skipped due to failure on 31/05/2023: https://product-fabric.atlassian.net/browse/ED-18172
      it.skip('should display the link toolbar', async () => {
        await click(page, `${selectors.editor} > h1 > a`);
      });
    });

    describe('paragraph', () => {
      it('should display the link toolbar', async () => {
        await click(page, `${selectors.editor} > p > a`);
      });
    });

    describe('action item', () => {
      it('should display the link toolbar', async () => {
        await click(page, `${selectors.editor} .taskItemView-content-wrap a`);
      });
    });

    describe('decision item', () => {
      it('should display the link toolbar', async () => {
        await click(
          page,
          `${selectors.editor} .decisionItemView-content-wrap a`,
        );
      });
    });
  });

  describe('hyperlink menu', () => {
    describe('edit link', () => {
      it('displays correctly when link matches display text', async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: hyperlinkAdf,
          viewport: { width: 800, height: 400 },
        });
        await click(page, hyperlinkSelectors.hyperlink);
        await page.click(hyperlinkSelectors.editLinkBtn);
      });

      it('displays correctly when link is different to display text', async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: hyperlinkWithTextAdf,
          viewport: { width: 800, height: 400 },
        });
        await click(page, hyperlinkSelectors.hyperlink);
        await page.click(hyperlinkSelectors.editLinkBtn);
      });
    });

    describe('insert link', () => {
      it('displays correctly when inside a caption node', async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: mediaWithCaptionAdf,
          viewport: { width: 1200, height: 800 },
          editorProps: {
            media: {
              allowMediaSingle: true,
              allowCaptions: true,
            },
          },
        });
        await page.click('[data-testid="media-caption"]');
        await clickToolbarMenu(page, ToolbarMenuItem.link);
        await waitForLoadedImageElements(page, 5000);
      });
    });
  });

  describe('hyperlink menu with Link Picker Options and ff:lp-link-picker', () => {
    describe('edit link', () => {
      it('displays correctly when link matches display text', async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: hyperlinkAdf,
          viewport: { width: 800, height: 500 },
          editorProps: {
            featureFlags: {
              'lp-link-picker': true,
            },
          },
          withLinkPickerOptions: true,
        });
        await click(page, hyperlinkSelectors.hyperlink);
        await page.click(hyperlinkSelectors.editLinkBtn);
        await page.waitForSelector(hyperlinkSelectors.linkInput);
      });

      it('displays correctly when link is different to display text', async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: hyperlinkWithTextAdf,
          viewport: { width: 800, height: 400 },
          editorProps: {
            featureFlags: {
              'lp-link-picker': true,
            },
          },
          withLinkPickerOptions: true,
        });
        await click(page, hyperlinkSelectors.hyperlink);
        await page.click(hyperlinkSelectors.editLinkBtn);
        await page.waitForSelector(hyperlinkSelectors.linkInput);
      });
    });

    describe('insert link', () => {
      it('displays correctly when inside a caption node', async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: mediaWithCaptionAdf,
          viewport: { width: 800, height: 1200 },
          editorProps: {
            featureFlags: {
              'lp-link-picker': true,
            },
            media: {
              allowMediaSingle: true,
              allowCaptions: true,
            },
          },
          withLinkPickerOptions: true,
        });

        await page.click('[data-testid="media-caption"]');
        await clickToolbarMenu(page, ToolbarMenuItem.link);
        await waitForLoadedImageElements(page, 5000);
      });
    });
  });

  describe('selection', () => {
    // FIXME: This test was automatically skipped due to failure on 07/06/2023: https://product-fabric.atlassian.net/browse/ED-18266
    it.skip('displayed when link is clicked with shift', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: hyperlinkWithText,
        viewport: { width: 800, height: 400 },
      });

      await page.click(selectors.lastEditorElement);
      await page.waitForSelector(hyperlinkSelectors.hyperlink);

      await pressKeyDown(page, 'Shift');
      await page.click(hyperlinkSelectors.hyperlink);
      await pressKeyUp(page, 'Shift');

      await animationFrame(page);
    });
  });
});
