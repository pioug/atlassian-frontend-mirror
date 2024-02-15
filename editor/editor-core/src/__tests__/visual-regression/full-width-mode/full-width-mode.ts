/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  clickFirstParagraph,
  scrollToTop,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import { waitForMediaToBeLoaded } from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  Appearance,
  initEditorWithAdf,
  mediaToFullyLoad,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adfWithMedia from './__fixtures__/content-with-media.adf.json';
import adfWithHScrollContent from './__fixtures__/horizontal-scroll-content.adf.json';
import adfWithBreakout from './__fixtures__/mixed-content-with-breakout.adf.json';
import adfWithMixedContent from './__fixtures__/mixed-content.adf.json';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe.skip('Full-width mode', () => {
  let page: PuppeteerPage;

  const initEditor = async (adf: any, width = 2000, height = 800) => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullWidth,
      adf,
      viewport: { width, height },
      withSidebar: true,
      forceReload: true,
    });
  };

  // In full-width mode we cap the max-width at 1800px, for sizes greater than this the
  // content will be left-aligned. so we want to test a size < 1800 and a size > 1800
  const widths = [2000, 1200];
  widths.forEach((width) => {
    describe(`(${width}px)`, () => {
      beforeEach(async () => {
        page = global.page;
      });

      it('should display content in full-width mode', async () => {
        await initEditor(adfWithMixedContent, width);
        await scrollToTop(page);
        await snapshot(page);
      });

      it('should not add horizontal scroll bars to page', async () => {
        // adf contains content that has caused editor to get too wide in the past
        await initEditor(adfWithHScrollContent, width, 1000);
        await waitForMediaToBeLoaded(page);
        // click is needed to trigger scroll bars
        await clickFirstParagraph(page);
        await mediaToFullyLoad(page);
        await snapshot(page);
      });

      describe(`with media`, () => {
        it('should display content in full-width mode', async () => {
          await initEditor(adfWithMedia, width);
          await waitForMediaToBeLoaded(page);
          await snapshot(page);
        });
      });
    });
  });

  describe('breakout', () => {
    it('should disable breakout and ignore sizes', async () => {
      await initEditor(adfWithBreakout);
      await snapshot(page);
    });
  });
});
