/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  scrollToMedia,
  waitForMediaToBeLoaded,
  clickMediaInPosition,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import borderADF from './__fixtures__/media-border.adf.json';
import borderADFWithLink from './__fixtures__/media-border-with-link.adf.json';
import borderADFWithinTable from './__fixtures__/media-border-within-table.adf.json';
import type { EditorProps } from '../../../types';

describe('Snapshot Test: Media Border Mark', () => {
  let page: PuppeteerPage;
  const initEditor = async (
    appearance: Appearance,
    viewport: { width: number; height: number },
    adf?: Object,
    editorProps?: Partial<EditorProps>,
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      viewport,
      editorProps,
      adf,
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe('full page editor', () => {
    beforeEach(async () => {
      await initEditor(
        Appearance.fullPage,
        { width: 800, height: 700 },
        borderADF,
        { allowBorderMark: true, media: { allowMediaSingle: true } },
      );
    });

    afterEach(async () => {
      await animationFrame(page);
      await scrollToMedia(page);
      await animationFrame(page);
      await snapshot(page);
    });

    it('should render media single with border mark', async () => {
      await waitForMediaToBeLoaded(page);
      await page.waitForSelector('div[data-mark-type="border"]', {
        visible: true,
      });
    });

    it('should render media single with selection ring and border mark', async () => {
      await waitForMediaToBeLoaded(page);
      await page.waitForSelector('div[data-mark-type="border"]', {
        visible: true,
      });
      await clickMediaInPosition(page, 0);
    });

    [80, 100, 120].forEach((zoomLevel) => {
      it(`should render media single with border mark without gap between the image and the border at ${zoomLevel}% zoom`, async () => {
        await page.setViewport({
          width: 800,
          height: 700,
          deviceScaleFactor: zoomLevel / 100,
        });
        await waitForMediaToBeLoaded(page);
        await page.waitForSelector('div[data-mark-type="border"]', {
          visible: true,
        });
      });
    });

    describe('with link', () => {
      beforeEach(async () => {
        await initEditor(
          Appearance.fullPage,
          { width: 800, height: 700 },
          borderADFWithLink,
          {
            allowBorderMark: true,
            media: { allowMediaSingle: true, allowLinking: true },
          },
        );
      });

      afterEach(async () => {
        await animationFrame(page);
        await scrollToMedia(page);
        await animationFrame(page);
        await snapshot(page);
      });

      it('should render media single with border mark', async () => {
        await waitForMediaToBeLoaded(page);
        await page.waitForSelector('div[data-mark-type="border"]', {
          visible: true,
        });
      });

      it('should render media single with selection ring and border mark', async () => {
        await waitForMediaToBeLoaded(page);
        await page.waitForSelector('div[data-mark-type="border"]', {
          visible: true,
        });
        await clickMediaInPosition(page, 0);
      });
    });

    describe('within table', () => {
      beforeEach(async () => {
        await initEditor(
          Appearance.fullPage,
          { width: 800, height: 900 },
          borderADFWithinTable,
          {
            allowBorderMark: true,
            media: { allowMediaSingle: true, allowLinking: true },
            allowTables: {
              advanced: true,
            },
          },
        );
      });

      afterEach(async () => {
        await animationFrame(page);
        await scrollToMedia(page);
        await animationFrame(page);
        await snapshot(page);
      });

      it('should render multiple media singles with border mark', async () => {
        await waitForMediaToBeLoaded(page);
        await page.waitForSelector('div[data-mark-type="border"]', {
          visible: true,
        });
      });

      it('should render media single with selection ring and border mark', async () => {
        await waitForMediaToBeLoaded(page);
        await page.waitForSelector('div[data-mark-type="border"]', {
          visible: true,
        });
        await clickMediaInPosition(page, 0);
      });

      it('should render media single with selection ring and border and link mark', async () => {
        await waitForMediaToBeLoaded(page);
        await page.waitForSelector('div[data-mark-type="border"]', {
          visible: true,
        });
        await clickMediaInPosition(page, 1);
      });
    });
  });
});
