import {
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';
import { selectors } from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
  clickToolbarMenu,
  ToolbarMenuItem,
} from '../../../../__tests__/__helpers/page-objects/_toolbar';
import { hyperlinkSelectors } from '../../../../__tests__/__helpers/page-objects/_hyperlink';

import hyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';
import hyperlinkWithTextAdf from '../__fixtures__/basic-hyperlink-with-text.adf.json';
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
    });

    describe('heading', () => {
      it('should display the link toolbar', async () => {
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
              featureFlags: {
                captions: true,
              },
            },
          },
        });
        await page.click('[data-testid="media-caption"]');
        await clickToolbarMenu(page, ToolbarMenuItem.link);
        await waitForLoadedImageElements(page, 5000);
      });
    });
  });
});
