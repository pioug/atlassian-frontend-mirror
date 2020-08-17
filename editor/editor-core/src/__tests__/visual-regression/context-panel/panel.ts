import { snapshot, initEditorWithAdf, Appearance } from '../_utils';

import adfWithMixedContent from './__fixtures__/content.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { scrollToTop } from '../../__helpers/page-objects/_editor';

describe('Context panel', () => {
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
  widths.forEach(width => {
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

  widths.forEach(width => {
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
