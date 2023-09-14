import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getElementComputedStyle } from '@atlaskit/editor-test-helpers/vr-utils/get-computed-style';
import {
  threeNormalParagraphs,
  threeNormalParagraphsInsideTable,
  threeNormalParagraphsInsideTableHeader,
} from './__fixtures__/alignment-examples';

async function centerCurrentParagraph(page: PuppeteerPage) {
  await clickToolbarMenu(page, ToolbarMenuItem.alignment);
  await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
  await clickToolbarMenu(page, ToolbarMenuItem.alignmentCenter);
}

async function alignRightCurrentParagraph(page: PuppeteerPage) {
  await clickToolbarMenu(page, ToolbarMenuItem.alignment);
  await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
  await clickToolbarMenu(page, ToolbarMenuItem.alignmentRight);
}

describe('alignment', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });
  describe('when the paragraphs are in the first level of the document ', () => {
    describe('and when it is the first paragraph', () => {
      describe('and when it has not an alignment mark', () => {
        it('should not set the margin-top (0px)', async () => {
          await initEditorWithAdf(page, {
            adf: threeNormalParagraphs,
            appearance: Appearance.fullPage,
          });

          const nthParagraph = 1;
          await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

          const paragraph = `.ProseMirror p:nth-of-type(${nthParagraph})`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).toEqual('0px');
        });
      });

      describe('and when has an alignment mark', () => {
        it('should not set the margin-top (0px)', async () => {
          await initEditorWithAdf(page, {
            adf: threeNormalParagraphs,
            appearance: Appearance.fullPage,
          });

          const nthParagraph = 1;
          await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

          await centerCurrentParagraph(page);

          const paragraph = `.fabric-editor-alignment > p`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).toEqual('0px');
        });
      });
    });

    describe.each([2, 3])('and when it is #%d paragraph', (nthParagraph) => {
      describe('and when it has not an alignment mark', () => {
        it('should have the margin-top', async () => {
          await initEditorWithAdf(page, {
            adf: threeNormalParagraphs,
            appearance: Appearance.fullPage,
          });

          await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

          const paragraph = `.ProseMirror p:nth-of-type(${nthParagraph})`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).not.toEqual('0px');
        });
      });

      describe('and when has an alignment mark', () => {
        it('should set the margin-top', async () => {
          await initEditorWithAdf(page, {
            adf: threeNormalParagraphs,
            appearance: Appearance.fullPage,
          });

          await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

          await centerCurrentParagraph(page);

          const paragraph = `.fabric-editor-alignment > p`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).not.toEqual('0px');
        });
      });
    });

    describe('and when the first and second paragraph has different alignment marks', () => {
      it('should set the second paragraph margin-top', async () => {
        await initEditorWithAdf(page, {
          adf: threeNormalParagraphs,
          appearance: Appearance.fullPage,
        });

        let nthParagraph = 1;
        await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);
        await centerCurrentParagraph(page);

        nthParagraph = 2;
        await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);
        await alignRightCurrentParagraph(page);

        const paragraph = `.fabric-editor-alignment.fabric-editor-align-end > p`;
        const paragraphMarginTop = await getElementComputedStyle(
          page,
          paragraph,
          'margin-top',
        );

        expect(paragraphMarginTop).not.toEqual('0px');
      });
    });
  });

  describe('when the paragraphs are inside a table ', () => {
    describe.each([
      {
        cellType: 'header',
        adf: threeNormalParagraphsInsideTableHeader,
      },
      {
        cellType: 'normal',
        adf: threeNormalParagraphsInsideTable,
      },
    ])('and when cell is $cellType', ({ adf }) => {
      describe('and when it is the first paragraph', () => {
        describe('and when it has not an alignment mark', () => {
          it('should not set the margin-top (0px)', async () => {
            await initEditorWithAdf(page, {
              adf,
              appearance: Appearance.fullPage,
            });

            const nthParagraph = 1;
            await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

            const paragraph = `.ProseMirror p:nth-of-type(${nthParagraph})`;
            const paragraphMarginTop = await getElementComputedStyle(
              page,
              paragraph,
              'margin-top',
            );

            expect(paragraphMarginTop).toEqual('0px');
          });
        });

        describe('and when has an alignment mark', () => {
          it('should not set the margin-top (0px)', async () => {
            await initEditorWithAdf(page, {
              adf,
              appearance: Appearance.fullPage,
            });

            const nthParagraph = 1;
            await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

            await centerCurrentParagraph(page);

            const paragraph = `.fabric-editor-alignment > p`;
            const paragraphMarginTop = await getElementComputedStyle(
              page,
              paragraph,
              'margin-top',
            );

            expect(paragraphMarginTop).toEqual('0px');
          });
        });
      });

      describe.each([2, 3])('when it is #%d paragraph', (nthParagraph) => {
        describe('and when it has not an alignment mark', () => {
          it('should have the margin-top', async () => {
            await initEditorWithAdf(page, {
              adf,
              appearance: Appearance.fullPage,
            });

            await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

            const paragraph = `.ProseMirror p:nth-of-type(${nthParagraph})`;
            const paragraphMarginTop = await getElementComputedStyle(
              page,
              paragraph,
              'margin-top',
            );

            expect(paragraphMarginTop).not.toEqual('0px');
          });
        });

        describe('and when has an alignment mark', () => {
          it('should set the margin-top', async () => {
            await initEditorWithAdf(page, {
              adf,
              appearance: Appearance.fullPage,
            });

            await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);

            await centerCurrentParagraph(page);

            const paragraph = `.fabric-editor-alignment > p`;
            const paragraphMarginTop = await getElementComputedStyle(
              page,
              paragraph,
              'margin-top',
            );

            expect(paragraphMarginTop).not.toEqual('0px');
          });
        });
      });

      describe('and when the first and second paragraph has different alignment marks', () => {
        it('should set the second paragraph margin-top', async () => {
          await initEditorWithAdf(page, {
            adf,
            appearance: Appearance.fullPage,
          });

          let nthParagraph = 1;
          await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);
          await centerCurrentParagraph(page);

          nthParagraph = 2;
          await page.click(`.ProseMirror p:nth-of-type(${nthParagraph})`);
          await alignRightCurrentParagraph(page);

          const paragraph = `.fabric-editor-alignment.fabric-editor-align-end > p`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).not.toEqual('0px');
        });
      });
    });
  });
});
