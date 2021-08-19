import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  changeMediaLayout,
  insertMedia,
  waitForMediaToBeLoaded,
  clickMediaInPosition,
  mediaSingleLayouts,
  MediaLayout,
} from '../../__helpers/page-objects/_media';
import {
  typeInEditor,
  clickEditableContent,
} from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import * as singleCellTable from './__fixtures__/single-cell-table-adf.json';
import adf from './__fixtures__/3-column-layout-with-image.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;

  describe('layouts', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        viewport: { width: 1280, height: 800 },
      });

      // type some text
      await typeInEditor(page, 'some text');
      await pressKey(page, [
        // Go left 3 times to insert image in the middle of the text
        'ArrowLeft',
        'ArrowLeft',
        'ArrowLeft',
        'ArrowLeft',
      ]);
    });

    it('can switch layouts on media', async () => {
      // now we can insert media as necessary
      await insertMedia(page);
      await waitForMediaToBeLoaded(page);

      await clickMediaInPosition(page, 0);

      // change layouts
      for (let layout of mediaSingleLayouts) {
        // click it so the toolbar appears
        await changeMediaLayout(page, layout);
        await clickMediaInPosition(page, 0);

        await snapshot(page);
      }
    });

    it('can switch layouts on individual media', async () => {
      // We need a bigger height to capture multiple large images in a row.
      await page.setViewport({ width: 1280, height: 1024 * 2 });

      // now we can insert media as necessary
      await insertMedia(page, ['one.svg', 'two.svg']);
      await waitForMediaToBeLoaded(page);

      await clickMediaInPosition(page, 1);

      // change layouts
      for (let layout of mediaSingleLayouts) {
        // click the *second one* so the toolbar appears
        await changeMediaLayout(page, layout);
        await clickMediaInPosition(page, 1);

        await snapshot(page);
      }
    });
  });

  describe('layout columns', () => {
    // TODO: https://product-fabric.atlassian.net/browse/EDM-2171
    it.skip('should hold big image in the middle layout column in fix-width mode', async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        viewport: { width: 1280, height: 800 },
      });
      await snapshot(page);
    });

    // TODO: https://product-fabric.atlassian.net/browse/EDM-2171
    it.skip('should hold big image in the middle layout column in full-width mode', async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullWidth,
        adf,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        viewport: { width: 1280, height: 800 },
      });
      await snapshot(page);
    });
  });

  describe('within a table', () => {
    describe('singular media', () => {
      beforeAll(async () => {
        page = global.page;
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: singleCellTable,
          editorProps: {
            media: {
              allowMediaSingle: true,
              allowResizing: true,
            },
          },
        });

        await clickEditableContent(page);
        await insertMedia(page);
        await waitForMediaToBeLoaded(page);
        await clickMediaInPosition(page, 0);
      });

      for (const layout of [
        MediaLayout.center,
        MediaLayout.alignEnd,
        MediaLayout.alignStart,
        MediaLayout.wrapLeft,
        MediaLayout.wrapRight,
      ]) {
        it(`using layout ${MediaLayout[layout]}`, async () => {
          await changeMediaLayout(page, layout);
          await snapshot(page);
        });
      }
    });

    it("multiple media don't overlap", async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: singleCellTable,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
        },
        viewport: { width: 800, height: 1280 },
      });

      await clickEditableContent(page);

      // Media one : left wrapped
      await insertMedia(page, ['recents_tall_image.jpeg']);
      await waitForMediaToBeLoaded(page);
      await clickMediaInPosition(page, 0);
      await changeMediaLayout(page, MediaLayout.wrapLeft);

      await pressKey(page, 'ArrowRight');

      // Media two : center aligned
      await insertMedia(page, ['recents_tall_image.jpeg']);
      await waitForMediaToBeLoaded(page);
      await clickMediaInPosition(page, 0);

      await snapshot(page);
    });
  });
});
