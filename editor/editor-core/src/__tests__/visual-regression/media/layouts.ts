import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { EditorProps } from '../../../types';

import {
  changeMediaLayout,
  waitForMediaToBeLoaded,
  clickMediaInPosition,
  mediaSingleLayouts,
  MediaLayout,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  clickEditableContent,
  animationFrame,
} from '@atlaskit/editor-test-helpers/page-objects/editor';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import * as singleCellTable from './__fixtures__/single-cell-table-adf.json';
import columnLayoutAdf from './__fixtures__/3-column-layout-with-image.adf.json';
import mediaSingleAdf from './__fixtures__/mediaSingle-image-wrap-with-text.adf.json';
import mediaSingleForIndividualLayoutAdf from './__fixtures__/mediaSingle-layouts-on-individual-media.adf.json';
import singleCellTableWithMultipleMediaAdf from './__fixtures__/single-cell-table-with-multiple-media.adf.json';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    appearance: Appearance,
    adf: Object,
    editorProps?: Partial<EditorProps>,
    viewport?: { width: number; height: number },
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      viewport,
      editorProps,
      adf,
    });
  };

  beforeEach(() => {
    page = global.page;
  });

  describe('layouts', () => {
    it('can switch layouts on media', async () => {
      await initEditor(
        Appearance.fullPage,
        mediaSingleAdf,
        {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        { width: 1280, height: 800 },
      );
      await animationFrame(page);
      await waitForMediaToBeLoaded(page);
      await page.click('[data-testid="media-file-card-view"]');
      await animationFrame(page);

      // change layouts
      for (let layout of mediaSingleLayouts) {
        // click it so the toolbar appears
        await changeMediaLayout(page, layout);
        await animationFrame(page);

        await snapshot(page, undefined, undefined, {
          captureBeyondViewport: false,
        });
      }
    });

    it('can switch layouts on individual media', async () => {
      await initEditor(
        Appearance.fullPage,
        mediaSingleForIndividualLayoutAdf,
        {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        { width: 1280, height: 1024 * 2 },
      );
      await animationFrame(page);
      await waitForMediaToBeLoaded(page);
      // We need a bigger height to capture multiple large images in a row.
      await page.setViewport({ width: 1280, height: 1024 * 2 });
      await animationFrame(page);
      await page.click('[data-test-media-name="tall_image.jpeg"]');
      await animationFrame(page);

      // change layouts
      for (let layout of mediaSingleLayouts) {
        // click the *second one* so the toolbar appears
        await changeMediaLayout(page, layout);
        await animationFrame(page);

        await waitForFloatingControl(page, 'Media floating controls');

        await snapshot(page, undefined, undefined, {
          captureBeyondViewport: false,
        });
      }
    });
  });

  describe('layout columns', () => {
    afterEach(async () => {
      await animationFrame(page);
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });
    it('should hold big image in the middle layout column in fix-width mode', async () => {
      await initEditor(
        Appearance.fullPage,
        columnLayoutAdf,
        {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        { width: 1280, height: 800 },
      );
      await waitForMediaToBeLoaded(page);
    });

    it('should hold big image in the middle layout column in full-width mode', async () => {
      await initEditor(
        Appearance.fullWidth,
        columnLayoutAdf,
        {
          media: {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowResizing: false,
          },
        },
        { width: 1280, height: 800 },
      );
      await waitForMediaToBeLoaded(page);
    });
  });

  describe('within a table', () => {
    describe('singular media', () => {
      beforeAll(async () => {
        page = global.page;
        await initEditor(Appearance.fullPage, singleCellTable, {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
        });

        await clickEditableContent(page);
        await animationFrame(page);
        await waitForMediaToBeLoaded(page);
        await page.click('[data-testid="media-file-card-view"]');
        await animationFrame(page);
      });

      for (const layout of [
        MediaLayout.center,
        MediaLayout.alignEnd,
        MediaLayout.alignStart,
        MediaLayout.wrapLeft,
        MediaLayout.wrapRight,
      ]) {
        // TODO: Unskip tests (skipped due to CI reporting slight diff, couldnt repro locally: https://product-fabric.atlassian.net/browse/ED-16362)
        it.skip(`using layout ${MediaLayout[layout]}`, async () => {
          await changeMediaLayout(page, layout);
          await animationFrame(page);
          await snapshot(page, undefined, undefined, {
            captureBeyondViewport: false,
          });
        });
      }
    });

    it("multiple media don't overlap", async () => {
      page = global.page;
      await initEditor(
        Appearance.fullPage,
        singleCellTableWithMultipleMediaAdf,
        {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
        },
        { width: 800, height: 1280 },
      );

      await clickEditableContent(page);
      await animationFrame(page);

      // Media one : left wrapped
      await waitForMediaToBeLoaded(page);
      await clickMediaInPosition(page, 0);
      await animationFrame(page);
      await changeMediaLayout(page, MediaLayout.wrapLeft);
      await animationFrame(page);

      await pressKey(page, 'ArrowRight');
      await animationFrame(page);

      // Media two : center aligned
      await waitForMediaToBeLoaded(page);
      await animationFrame(page);
      await clickMediaInPosition(page, 1);
      await animationFrame(page);

      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });
  });
});
