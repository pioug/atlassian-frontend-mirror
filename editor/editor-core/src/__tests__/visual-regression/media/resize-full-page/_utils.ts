import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot } from '../../_utils';
import {
  getEditorWidth,
  typeInEditor,
} from '../../../__helpers/page-objects/_editor';
import {
  insertMedia,
  resizeMediaInPositionWithSnapshot,
  clickMediaInPosition,
  changeMediaLayout,
  MediaLayout,
  MediaResizeSide,
  TestPageConfig,
  scrollToMedia,
  isLayoutAvailable,
  waitForMediaToBeLoaded,
} from '../../../__helpers/page-objects/_media';
import { selectors } from '../../../__helpers/page-objects/_editor';
import * as layout2Col from '../../common/__fixtures__/basic-columns.adf.json';
import { EditorProps } from '../../../../types';

export function createResizeFullPageForConfig(config: TestPageConfig) {
  const initEditor = async (
    page: PuppeteerPage,
    editorProps: Partial<EditorProps>,
    viewport?: { width: number; height: number },
    defaultValue?: Object,
  ) => {
    await initFullPageEditorWithAdf(
      page,
      defaultValue || {},
      undefined,
      viewport,
      editorProps,
    );
    // wait for editor
    await page.waitForSelector(selectors.editor);
    await page.click(selectors.editor);
  };

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  describe.skip('Snapshot Test: Media', () => {
    describe('full page editor', () => {
      let page: PuppeteerPage;

      beforeAll(async () => {
        page = global.page;
      });

      // run the suite of tests for each viewport/prop combination
      const {
        dynamicTextSizing,
        viewport: { width, height },
      } = config;

      describe(`at ${width}x${height}, without allow resizing, ${
        dynamicTextSizing ? 'with' : 'without'
      } dynamic text sizing`, () => {
        beforeEach(async () => {
          // setup the editor
          await initEditor(
            page,
            {
              media: { allowResizing: false },
              allowDynamicTextSizing: dynamicTextSizing,
            },
            { width, height },
          );
        });

        if (isLayoutAvailable(MediaLayout.wide, width)) {
          it('can make an image wide', async () => {
            // `insertMedia` etc are in each test so we don't load up
            // the mediapicker for tests that don't end up running in beforeEach
            await insertMedia(page);
            await clickMediaInPosition(page, 0);
            await changeMediaLayout(page, MediaLayout.wide);
            await clickMediaInPosition(page, 0);
            await scrollToMedia(page);
            await snapshot(page);
          });
        }

        if (isLayoutAvailable(MediaLayout.fullWidth, width)) {
          it('can make an image full-width', async () => {
            await insertMedia(page);
            await clickMediaInPosition(page, 0);
            await changeMediaLayout(page, MediaLayout.fullWidth);
            await clickMediaInPosition(page, 0);
            await scrollToMedia(page);
            await snapshot(page);
          });
        }
      });

      describe(`at ${width}x${height} ${
        dynamicTextSizing ? 'with' : 'without'
      } dynamic text sizing`, () => {
        let editorWidth: number;

        beforeEach(async () => {
          // setup the editor
          await initEditor(
            page,
            { allowDynamicTextSizing: dynamicTextSizing },
            { width, height },
          );
          editorWidth = await getEditorWidth(page);
        });

        describe('center layout', () => {
          [2, 6, 10].forEach((cols) => {
            it(`can make an image ${cols} columns wide`, async () => {
              const distance = -((editorWidth / 2) * ((12 - cols) / 12));

              await insertMedia(page);
              await scrollToMedia(page);

              await resizeMediaInPositionWithSnapshot(page, 0, distance);
            });
          });
        });

        describe('wrap-left layout', () => {
          [2, 6, 10].forEach((cols) => {
            it(`can make an wrap-left image ${cols} columns wide`, async () => {
              const distance = -((editorWidth / 12) * (12 - cols));

              await insertMedia(page);
              await scrollToMedia(page);
              await clickMediaInPosition(page, 0);
              await changeMediaLayout(page, MediaLayout.wrapLeft);

              await resizeMediaInPositionWithSnapshot(page, 0, distance);
            });
          });
        });

        describe('wrap-right layout', () => {
          [2, 6, 10].forEach((cols) => {
            it(`can make an wrap-right image ${cols} columns wide`, async () => {
              const distance = (editorWidth / 12) * (12 - cols);
              await insertMedia(page);
              await scrollToMedia(page);
              await clickMediaInPosition(page, 0);
              await changeMediaLayout(page, MediaLayout.wrapRight);

              await resizeMediaInPositionWithSnapshot(
                page,
                0,
                distance,
                MediaResizeSide.left,
              );
            });
          });
        });

        describe('lists', () => {
          [2, 6, 10].forEach((cols) => {
            it(`can make an image in a list ${cols} columns wide`, async () => {
              const distance = -((editorWidth / 12) * (12 - cols));

              await typeInEditor(page, '* ');
              await insertMedia(page);
              await scrollToMedia(page);

              await resizeMediaInPositionWithSnapshot(page, 0, distance);
            });
          });
        });

        describe('in columns', () => {
          it(`can resize images inside a column`, async () => {
            await initEditor(
              page,
              {
                allowLayouts: {
                  allowBreakout: true,
                  UNSAFE_addSidebarLayouts: true,
                },
              },
              { width, height },
              layout2Col,
            );

            const editorWidth = await getEditorWidth(page);
            const distance = -((editorWidth / 12) * 10);

            const firstLayoutColSelector =
              'div[data-layout-section] > div:first-of-type';
            await page.waitForSelector(firstLayoutColSelector);
            await page.click(firstLayoutColSelector);

            await insertMedia(page);
            await waitForMediaToBeLoaded(page);
            await resizeMediaInPositionWithSnapshot(page, 0, distance);
          });
        });
      });
    });
  });
}
