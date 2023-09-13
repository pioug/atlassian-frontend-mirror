import { initRendererWithADF } from './_utils';

import { getElementComputedStyle } from '@atlaskit/editor-test-helpers/vr-utils/get-computed-style';
import {
  threeNormalParagraphs,
  firstParagraphCentered,
  secondParagraphCentered,
  thirdParagraphCentered,
  mixAlignmentParagraph,
} from '../__fixtures__/alignment-examples';
import {
  doc,
  p,
  table,
  tr,
  alignment,
  td,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

describe('alignment', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });
  describe('when the paragraphs are in the first level of the document ', () => {
    describe('and when it is the first paragraph', () => {
      describe('and when it has not an alignment mark', () => {
        it('should not set the margin-top (0px)', async () => {
          await initRendererWithADF(page, {
            adf: threeNormalParagraphs,
            appearance: 'full-page',
          });

          const nthParagraph = 1;
          const paragraph = `.ak-renderer-document p:nth-of-type(${nthParagraph})`;
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
          await initRendererWithADF(page, {
            adf: firstParagraphCentered,
            appearance: 'full-page',
          });

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

    describe('and when the first and second paragraph has different alignment marks', () => {
      it('should set the second paragraph margin-top', async () => {
        await initRendererWithADF(page, {
          adf: mixAlignmentParagraph,
          appearance: 'full-page',
        });

        const paragraph = `.fabric-editor-alignment[data-align="end"] > p`;
        const paragraphMarginTop = await getElementComputedStyle(
          page,
          paragraph,
          'margin-top',
        );

        expect(paragraphMarginTop).not.toEqual('0px');
      });
    });

    describe.each([
      {
        description: 'second paragraph',
        nthParagraph: 2,
        adf: secondParagraphCentered,
      },
      {
        description: 'third paragraph',
        nthParagraph: 3,
        adf: thirdParagraphCentered,
      },
    ])('[case %#]', ({ adf, nthParagraph }) => {
      describe('and when it has not an alignment mark', () => {
        it('should have the margin-top', async () => {
          await initRendererWithADF(page, {
            adf: threeNormalParagraphs,
            appearance: 'full-page',
          });

          const paragraph = `.ak-renderer-document p:nth-of-type(${nthParagraph})`;
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
          await initRendererWithADF(page, {
            adf,
            appearance: 'full-page',
          });

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
  });

  describe.each([
    {
      description: 'table header',
      cellType: th,
    },
    {
      description: 'table cell',
      cellType: td,
    },
  ])(
    'when there are three normal paragraphs inside table',
    ({ cellType, description }) => {
      describe(description, () => {
        const pmDocument = doc(
          // prettier-ignore
          table()(
              tr(
                cellType()(
                  p('paragraph ONE'),
                  p('paragraph TWO'),
                  p('paragraph THREE'),
                ),
              ),
            ),
        )(defaultSchema);
        it('should not set margin-top to first paragraph', async () => {
          const adf = { version: 1, ...pmDocument.toJSON() };

          await initRendererWithADF(page, {
            adf,
            appearance: 'full-page',
          });

          const nthParagraph = 1;
          const paragraph = `.ak-renderer-document p:nth-of-type(${nthParagraph})`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).toEqual('0px');
        });

        it.each([2, 3])(
          'should set margin-top to the nth: %d paragraph',
          async (nthParagraph) => {
            const adf = { version: 1, ...pmDocument.toJSON() };

            await initRendererWithADF(page, {
              adf,
              appearance: 'full-page',
            });

            const paragraph = `.ak-renderer-document p:nth-of-type(${nthParagraph})`;
            const paragraphMarginTop = await getElementComputedStyle(
              page,
              paragraph,
              'margin-top',
            );

            expect(paragraphMarginTop).not.toEqual('0px');
          },
        );
      });
    },
  );

  describe.each([
    {
      description: 'table header',
      cellType: th,
    },
    {
      description: 'table cell',
      cellType: td,
    },
  ])(
    'when first paragraph has alignment mark inside table',
    ({ cellType, description }) => {
      describe(description, () => {
        it('should not set margin-top to first paragraph', async () => {
          const pmDocument = doc(
            // prettier-ignore
            table()(
              tr(
                cellType()(
                  alignment({ align: 'center' })(p('paragraph ONE')),
                  p('paragraph TWO'),
                  p('paragraph THREE'),
                ),
              ),
            ),
          )(defaultSchema);

          const adf = { version: 1, ...pmDocument.toJSON() };

          await initRendererWithADF(page, {
            adf,
            appearance: 'full-page',
          });

          const paragraph = `.fabric-editor-alignment > p`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).toEqual('0px');
        });
      });
    },
  );

  describe.each([
    {
      description: 'table header',
      cellType: th,
    },
    {
      description: 'table cell',
      cellType: td,
    },
  ])(
    'when nth paragraph has alignment mark inside table',
    ({ cellType, description }) => {
      describe(description, () => {
        const case0 = {
          description: 'second paragraph',
          nthParagraph: 2,
          docBuilder: doc(
            // prettier-ignore
            table()(
              tr(
                cellType()(
                  p('paragraph ONE'),
                  alignment({ align: 'center' })(p('paragraph CENTER')),
                  p('paragraph THREE'),
                ),
              ),
            ),
          ),
        };
        const case1 = {
          description: 'third paragraph',
          nthParagraph: 3,
          docBuilder: doc(
            // prettier-ignore
            table()(
              tr(
                cellType()(
                  p('paragraph ONE'),
                  p('paragraph TWO'),
                  alignment({ align: 'center' })(p('paragraph CENTER')),
                ),
              ),
            ),
          ),
        };

        describe.each<{
          docBuilder: DocBuilder;
          nthParagraph: number;
          description: string;
        }>([case0, case1])('[case%#]', ({ docBuilder, nthParagraph }) => {
          it(`should set margin-top to nth(${nthParagraph}) paragraph`, async () => {
            const pmDocument = docBuilder(defaultSchema);

            const adf = { version: 1, ...pmDocument.toJSON() };

            await initRendererWithADF(page, {
              adf,
              appearance: 'full-page',
            });

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
    },
  );

  describe.each([
    {
      description: 'table header',
      cellType: th,
    },
    {
      description: 'table cell',
      cellType: td,
    },
  ])(
    'when the first and second paragraph has different alignment marks',
    ({ cellType, description }) => {
      describe(description, () => {
        it('should set the second paragraph margin-top', async () => {
          const pmDocument = doc(
            // prettier-ignore
            table()(
              tr(
                cellType()(
                  alignment({ align: 'center' })(p('paragraph ONE')),
                  alignment({ align: 'end' })(p('paragraph TWO')),
                  p('paragraph THREE'),
                ),
              ),
            ),
          )(defaultSchema);

          const adf = { version: 1, ...pmDocument.toJSON() };
          await initRendererWithADF(page, {
            adf,
            appearance: 'full-page',
          });

          const paragraph = `.fabric-editor-alignment[data-align="end"] > p`;
          const paragraphMarginTop = await getElementComputedStyle(
            page,
            paragraph,
            'margin-top',
          );

          expect(paragraphMarginTop).not.toEqual('0px');
        });
      });
    },
  );
});
