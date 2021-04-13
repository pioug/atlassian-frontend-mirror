import { Slice, Mark, Node } from 'prosemirror-model';
import {
  doc,
  emoji,
  p,
  strong,
  underline,
  annotation,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { toJSON } from '../../../../utils';
import {
  applyTextMarksToSlice,
  hasOnlyNodesOfType,
  isSingleLine,
  htmlContainsSingleFile,
  isEmptyNode,
} from '../../util';
import { AnnotationTypes } from '@atlaskit/adf-schema';

describe('paste util', () => {
  describe('isSingleLine()', () => {
    it('should return true for single line of text', () => {
      expect(isSingleLine('only one line')).toBe(true);
    });

    it('should return false for multiple lines of text', () => {
      expect(isSingleLine('first line\nsecond line')).toBe(false);
    });
  });

  describe('htmlContainsSingleFile()', () => {
    it('should return false for media blob urls', () => {
      const blobUrl =
        'http://localhost:9000/d76eca31-edb9-44ef-9604-1a4edf3113b0#media-blob-url=true';
      expect(
        htmlContainsSingleFile(`<meta charset=""><img src="${blobUrl}" />`),
      ).toBe(false);
      expect(
        htmlContainsSingleFile(`<meta charset=""><img src="${blobUrl}" >`),
      ).toBe(false);
      expect(htmlContainsSingleFile(`<img src="${blobUrl}" >`)).toBe(false);
      expect(htmlContainsSingleFile(`<img src="${blobUrl}" />`)).toBe(false);
    });

    it('should return true for media single file', () => {
      const mediaUrl =
        'https://helpx.adobe.com/visual-reverse-image-search-v2_intro.jpg';
      expect(
        htmlContainsSingleFile(`<meta charset=""><img src="${mediaUrl}" />`),
      ).toBe(true);
      expect(
        htmlContainsSingleFile(`<meta charset=""><img src="${mediaUrl}" >`),
      ).toBe(true);
      expect(htmlContainsSingleFile(`<img src="${mediaUrl}" >`)).toBe(true);
      expect(htmlContainsSingleFile(`<img src="${mediaUrl}" />`)).toBe(true);
    });
  });

  describe('hasOnlyNodesOfType()', () => {
    it('should return true for a slice containing only specified nodes', () => {
      const {
        nodes: { paragraph, text },
      } = defaultSchema;

      const json = toJSON(
        doc(p('some text'), p('another text'))(defaultSchema),
      );
      const slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      expect(hasOnlyNodesOfType(paragraph, text)(slice)).toBeTruthy();
    });

    it('should return false for a slice containing unspecified nodes', () => {
      const {
        nodes: { paragraph, text },
      } = defaultSchema;

      const json = toJSON(
        doc(
          p(emoji({ shortName: ':grinning:', text: '😀' })()),
          p('another text'),
        )(defaultSchema),
      );
      const slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      expect(hasOnlyNodesOfType(paragraph, text)(slice)).toBeFalsy();
    });
  });

  describe('applyTextMarksToSlice()', () => {
    const {
      marks: {
        code,
        em: emMark,
        strong: strongMark,
        annotation: annotationMark,
        link: linkMark,
      },
    } = defaultSchema;

    it('should return input slice when no marks', () => {
      const json = toJSON(doc(p('some text'))(defaultSchema));
      const slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      expect(applyTextMarksToSlice(defaultSchema, [])(slice)).toEqual(slice);
    });

    describe('returns new slice with applied marks, and preserves existing marks from input slice', () => {
      function testApplyTextMarksToSlice({
        testCase,
        content,
        newMarks,
        expectedContent,
      }: {
        testCase: string;
        content: any;
        newMarks: Mark<any>[];
        expectedContent: any[];
      }) {
        it(testCase, () => {
          const slice = Slice.fromJSON(defaultSchema, {
            content: content,
            openStart: 1,
            openEnd: 1,
          });
          const transformedSlice = applyTextMarksToSlice(
            defaultSchema,
            newMarks,
          )(slice);
          expect(transformedSlice).toBeTruthy();
          expect(transformedSlice).not.toBe(slice);
          expect(transformedSlice.toJSON()).toEqual({
            content: expectedContent,
            openStart: 1,
            openEnd: 1,
          });
        });
      }

      testApplyTextMarksToSlice({
        testCase: 'applies code mark to plain text',
        content: toJSON(doc(p('some text'))(defaultSchema)).content,
        newMarks: [code.create()],
        expectedContent: [
          {
            content: [
              {
                marks: [
                  {
                    type: 'code',
                  },
                ],
                text: 'some text',
                type: 'text',
              },
            ],
            type: 'paragraph',
          },
        ],
      });

      testApplyTextMarksToSlice({
        testCase:
          'strips off existing marks when applies code mark to a slice with formatted text',
        content: toJSON(doc(p(underline('some text')))(defaultSchema)).content,
        newMarks: [code.create()],
        expectedContent: [
          {
            content: [
              {
                marks: [
                  {
                    type: 'code',
                  },
                ],
                text: 'some text',
                type: 'text',
              },
            ],
            type: 'paragraph',
          },
        ],
      });

      testApplyTextMarksToSlice({
        testCase: 'strips off link marks from applied marks',
        content: toJSON(doc(p('some text'))(defaultSchema)).content,
        newMarks: [
          strongMark.create(),
          linkMark.create({
            href: 'http://www.atlassian.com',
          }),
        ],
        expectedContent: [
          {
            content: [
              {
                marks: [
                  {
                    type: 'strong',
                  },
                ],
                text: 'some text',
                type: 'text',
              },
            ],
            type: 'paragraph',
          },
        ],
      });

      testApplyTextMarksToSlice({
        testCase:
          'applies new formatting marks, while clears marks from the pasted slice',
        content: toJSON(doc(p(underline('some text')))(defaultSchema)).content,
        newMarks: [emMark.create(), strongMark.create()],
        expectedContent: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'em' }, { type: 'strong' }],
                text: 'some text',
              },
            ],
          },
        ],
      });

      testApplyTextMarksToSlice({
        testCase:
          'preserves annotation marks in a slice, while strips off text formatting',
        content: toJSON(
          doc(
            p(
              annotation({
                id: 'annotation-id',
                annotationType: AnnotationTypes.INLINE_COMMENT,
              })('This is a ', strong('formatted'), ' annotation'),
            ),
          )(defaultSchema),
        ).content,
        newMarks: [emMark.create()],
        expectedContent: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'annotation',
                    attrs: {
                      id: 'annotation-id',
                      annotationType: 'inlineComment',
                    },
                  },
                  { type: 'em' },
                ],
                text: 'This is a ',
              },
              {
                type: 'text',
                marks: [
                  {
                    type: 'annotation',
                    attrs: {
                      id: 'annotation-id',
                      annotationType: 'inlineComment',
                    },
                  },
                  { type: 'em' },
                ],
                text: 'formatted',
              },
              {
                type: 'text',
                marks: [
                  {
                    type: 'annotation',
                    attrs: {
                      id: 'annotation-id',
                      annotationType: 'inlineComment',
                    },
                  },
                  { type: 'em' },
                ],
                text: ' annotation',
              },
            ],
          },
        ],
      });

      testApplyTextMarksToSlice({
        testCase:
          'adds new annotation marks to existing annotation marks in a slice',
        content: toJSON(
          doc(
            p(
              annotation({
                id: 'annotation-id',
                annotationType: AnnotationTypes.INLINE_COMMENT,
              })('This is an annotation'),
            ),
          )(defaultSchema),
        ).content,
        newMarks: [
          annotationMark.create({
            id: 'annotation-new-id',
            annotationType: AnnotationTypes.INLINE_COMMENT,
          }),
        ],
        expectedContent: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'annotation',
                    attrs: {
                      id: 'annotation-id',
                      annotationType: 'inlineComment',
                    },
                  },
                  {
                    type: 'annotation',
                    attrs: {
                      id: 'annotation-new-id',
                      annotationType: 'inlineComment',
                    },
                  },
                ],
                text: 'This is an annotation',
              },
            ],
          },
        ],
      });
    });
  });

  describe('isEmptyNode()', () => {
    const {
      nodes: { panel },
    } = defaultSchema;
    it('should return true if node is empty', () => {
      const emptyInfoPanel = panel.createAndFill();
      expect(isEmptyNode(emptyInfoPanel)).toBe(true);
    });
    it('should return true when node attributes are different to the default', () => {
      const emptyNotePanel = panel.createAndFill({ panelType: 'note' });
      expect(isEmptyNode(emptyNotePanel)).toBe(true);
      const emptyWarningPanel = panel.createAndFill({ panelType: 'warning' });
      expect(isEmptyNode(emptyWarningPanel)).toBe(true);
    });
    it('should return false if node contains content', () => {
      const content = doc(p('some text'))(defaultSchema).toJSON();
      const paragraph = Node.fromJSON(defaultSchema, content);
      const nonEmptyPanel = panel.createAndFill(null, paragraph);
      expect(isEmptyNode(nonEmptyPanel)).toBe(false);
    });
  });
});
