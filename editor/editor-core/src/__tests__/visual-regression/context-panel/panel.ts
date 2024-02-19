// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { contextPanelSelectors } from '@atlaskit/editor-test-helpers/page-objects/context-panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { scrollToTop } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import { CONTENT_AREA_TEST_ID } from '../../../ui/Appearance/FullPage/FullPageContentArea';

import adfWithNoBreakoutContent from './__fixtures__/content-nobreakout.adf.json';
import adfWithMixedContent from './__fixtures__/content.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Context panel', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    adf: any,
    appearance: Appearance,
    width = 2000,
    height = 1200,
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      adf,
      viewport: { width, height },
      withContextPanel: true,
      forceReload: true,
    });
  };

  const widths = [2000, 500];
  widths.forEach((width) => {
    describe(`full page (${width}px)`, () => {
      beforeEach(async () => {
        page = global.page;
      });

      it('should display show sidebar with content correctly', async () => {
        await initEditor(adfWithMixedContent, Appearance.fullPage, width);
        await scrollToTop(page);
        await snapshot(page, {}, 'body');
      });
    });
  });

  describe(`full page (1950px)`, () => {
    it('should display sidebar without pushing content if it does not overlap editor', async () => {
      await initEditor(adfWithNoBreakoutContent, Appearance.fullPage, 1950);
      await scrollToTop(page);
      await snapshot(page, {}, 'body');
    });

    it('should have the same height as the editor content area if it does not overlap editor', async () => {
      const getHeightFromSelector = async (selector: string) => {
        const element = await page.$(selector);
        const elementBoundingBox = await element?.boundingBox();
        return elementBoundingBox ? elementBoundingBox.height : 0;
      };

      await initEditor(adfWithNoBreakoutContent, Appearance.fullPage, 1950);

      const editorContentHeight = await getHeightFromSelector(
        `[data-testid="${CONTENT_AREA_TEST_ID}"]`,
      );

      const contextPanelHeight = await getHeightFromSelector(
        contextPanelSelectors.contextPanelPanel,
      );

      expect(editorContentHeight).toBeGreaterThan(0);
      expect(contextPanelHeight).toBeGreaterThan(0);
      expect(contextPanelHeight).toEqual(editorContentHeight);
    });
  });

  widths.forEach((width) => {
    describe(`full width mode (${width}px)`, () => {
      beforeEach(async () => {
        page = global.page;
      });

      it('should display show sidebar with content correctly', async () => {
        await initEditor(adfWithMixedContent, Appearance.fullWidth, width);
        await scrollToTop(page);
        await snapshot(page, {}, 'body');
      });
    });
  });
});
