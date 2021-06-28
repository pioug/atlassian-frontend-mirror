import { Decoration } from 'prosemirror-view';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common';
import {
  annotation,
  doc,
  emoji,
  em,
  p,
  strike,
  mediaGroup,
  media,
  code_block,
  hardBreak,
  RefsNode,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  surroundingMarks,
  getAllAnnotations,
  addDraftDecoration,
  getAnnotationViewKey,
  inlineCommentPluginKey,
  hasInvalidNodes,
  hasWhitespaceNode,
  isSelectionValid,
  hasAnnotationMark,
  annotationExists,
  containsAnyAnnotations,
  stripNonExistingAnnotations,
  findAnnotationsInSelection,
} from '../../utils';
import { AnnotationInfo, AnnotationSelectionType } from '../../types';

import annotationPlugin from '../..';
import emojiPlugin from '../../../emoji';
import { inlineCommentProvider } from '../_utils';
import mediaPlugin from '../../../media';
import codeBlockPlugin from '../../../code-block';
import blockTypePlugin from '../../../block-type';
import panelPlugin from '../../../panel';
import {
  InlineCommentMap,
  InlineCommentPluginState,
} from '../../pm-plugins/types';
import { EditorState } from 'prosemirror-state';
import { Slice, Fragment, Schema } from 'prosemirror-model';

const annotationPreset = new Preset<LightEditorPlugin>()
  .add([
    annotationPlugin,
    { inlineComment: { ...inlineCommentProvider, disallowOnWhitespace: true } },
  ])
  .add(emojiPlugin)
  .add(panelPlugin)
  .add(codeBlockPlugin)
  .add(blockTypePlugin)
  .add([
    mediaPlugin,
    {
      allowMediaGroup: true,
    },
  ]);

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({ emojiProvider });

function mockCommentsStateWithAnnotations(
  annotations: InlineCommentMap,
  options?: object,
) {
  const defaultOptions = {
    selectedAnnotations: [],
    mouseData: { isSelecting: false },
    disallowOnWhitespace: false,
    isVisible: true,
  };

  const testInlineCommentState: InlineCommentPluginState = {
    annotations: annotations,
    ...defaultOptions,
    ...options,
  };
  return jest
    .spyOn(inlineCommentPluginKey, 'getState')
    .mockReturnValue(testInlineCommentState);
}

describe('annotation', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      providerFactory,
      pluginKey: inlineCommentPluginKey,
      preset: annotationPreset,
    });

  describe('surroundingMarks', () => {
    it('works for nodes on both sides, all marks', () => {
      const testDoc = doc(p(em('hello'), 'al{<>}ex', strike('world')))(
        defaultSchema,
      );

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [defaultSchema.marks.em.create()],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes on both sides, after marks only', () => {
      const testDoc = doc(p('hello', 'al{<>}ex', strike('world')))(
        defaultSchema,
      );

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only after', () => {
      const testDoc = doc(p('al{<>}ex', strike('world')))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only after, start of node', () => {
      const testDoc = doc(p('{<>}alex', strike('world')))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only before', () => {
      const testDoc = doc(p(strike('world'), 'al{<>}ex'))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [defaultSchema.marks.strike.create()],
        [],
      ]);
    });
  });

  describe('getAllAnnotations', () => {
    it('flat annotations', () => {
      const testDoc = doc(
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'alpaca',
          })('text-alpaca'),
        ),
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'baboon',
          })('text-baboon'),
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['alpaca', 'baboon']);
    });

    it('nested annotations', () => {
      const testDoc = doc(
        p(
          'before',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'alpaca',
          })(
            'text-alpaca',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'baboon',
            })('text-baboon'),
            'text-alpaca-after',
          ),
          'after',
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['alpaca', 'baboon']);
    });

    it('duplicate annotations', () => {
      const testDoc = doc(
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'alpaca',
          })('text-alpaca'),
        ),
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'alpaca',
          })('text-alpaca'),
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['alpaca']);
    });

    it('annotations with invalid data', () => {
      const testDoc = doc(
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'null',
          })('text-alpaca-1'),
        ),
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'undefined',
          })('text-alpaca-2'),
        ),
        p(
          'text',
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'test',
          })('test-annotation-2'),
        ),
        p(
          'text',
          annotation({
            annotationType: 'unknown' as AnnotationTypes,
            id: 'test2',
          })('test-annotation-3'),
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['test']);
    });
  });

  describe('addDraftDecoration', () => {
    it('creates a prosemirror decoration with correct styles', () => {
      const decoration = addDraftDecoration(0, 5);
      expect(decoration).toBeInstanceOf(Decoration);
      expect(decoration.from).toBe(0);
      expect(decoration.to).toBe(5);
      expect((decoration as any).type.attrs).toEqual({
        class: AnnotationSharedClassNames.draft,
      });
    });
  });

  describe('getAnnotationViewKey', () => {
    it('generates key for annotation view wrapper', () => {
      const annotations: AnnotationInfo[] = [
        { id: 'id-1', type: AnnotationTypes.INLINE_COMMENT },
        { id: 'id-2', type: AnnotationTypes.INLINE_COMMENT },
      ];
      expect(getAnnotationViewKey(annotations)).toBe(
        'view-annotation-wrapper_id-1_id-2',
      );
    });
  });

  describe('hasInvalidNodes', () => {
    test.each([
      [
        'text only',
        doc(p('{<}Corsair{>}', emoji({ shortName: ':smiley:' })())),
        false,
      ],
      [
        'mixed',
        doc(p('{<}Corsair', emoji({ shortName: ':smiley:' })(), '{>}')),
        true,
      ],
      [
        'inline only',
        doc(p('Corsair{<}', emoji({ shortName: ':smiley:' })(), '{>}')),
        true,
      ],
      [
        'leaf block node',
        doc(
          p('Cors{<}air'),
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: 'media-plugin-mock-collection-123',
            })(),
          ),
          p(' th{>}ings'),
        ),
        true,
      ],
      [
        'selection finishing inside invalid node',
        doc(p('Cor{<}sair'), code_block()('this is {>}code')),
        true,
      ],
      [
        'false for hardBreak',
        doc(p('Corsa{<}ir', hardBreak(), ' corsa{>}ir')),
        false,
      ],
    ])('%s', (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);

      expect(hasInvalidNodes(editorView.state)).toBe(expected);
    });
  });

  describe('hasWhitespaceNode', () => {
    test.each([
      ['no whitespace', doc(p('{<}Corsair smartly{>}')), false],
      [
        'whitespace within node',
        doc(p('{<}Corsair          smartly{>}')),
        false,
      ],
      ['whitespace spaces', doc(p('Corsair {<}   {>} smartly')), true],
      ['whitespace tabs', doc(p('Corsair {<}\t{>} smartly')), true],
      [
        'across empty node',
        doc(p('{<}Corsair smartly'), p(''), p('Trysail Sail{>}')),
        true,
      ],
      [
        'across whitespace node',
        doc(p('{<}Corsair smartly'), p('     '), p('Trysail Sail{>}')),
        true,
      ],
    ])('%s', (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);

      expect(hasWhitespaceNode(editorView.state.selection)).toBe(expected);
    });
  });

  describe('isSelectionValid', () => {
    let pluginState: jest.SpyInstance;
    afterEach(() => {
      pluginState.mockClear();
    });
    describe('with disallowOnWhitespace disabled', () => {
      beforeEach(() => {
        pluginState = mockCommentsStateWithAnnotations(
          {},
          { disallowOnWhitespace: false },
        );
      });
      test.each([
        [
          'empty selection across multiple paragraphs',
          doc(p('{<}'), p('{>}')),
          AnnotationSelectionType.INVALID,
        ],
        [
          'white space selection',
          doc(p('{<} {>}')),
          AnnotationSelectionType.VALID,
        ],
      ])('%s', (_, inputDoc, expected) => {
        const { editorView } = editor(inputDoc);

        expect(isSelectionValid(editorView.state)).toBe(expected);
      });
    });

    describe('with disallowOnWhitespace enabled', () => {
      beforeEach(() => {
        pluginState = mockCommentsStateWithAnnotations(
          {},
          { disallowOnWhitespace: true },
        );
      });

      test.each([
        [
          'text',
          doc(p('{<}Corsair smartly{>}')),
          AnnotationSelectionType.VALID,
        ],
        [
          'inline node',
          doc(p('{<}Corsair', emoji({ shortName: ':smiley:' })(), '{>}')),
          AnnotationSelectionType.DISABLED,
        ],
        [
          'node selection',
          doc(p('Corsair', '{<node>}', emoji({ shortName: ':smiley:' })())),
          AnnotationSelectionType.INVALID,
        ],
        [
          'empty selection',
          doc(p('{<>}Corsair smartly')),
          AnnotationSelectionType.INVALID,
        ],
        [
          'no selection',
          doc(p('{<>}Corsair smartly')),
          AnnotationSelectionType.INVALID,
        ],
        [
          'white space selection',
          doc(p('{<} {>}')),
          AnnotationSelectionType.INVALID,
        ],
      ])('%s', (_, inputDoc, expected) => {
        const { editorView } = editor(inputDoc);

        expect(isSelectionValid(editorView.state)).toBe(expected);
      });
    });
  });

  describe('hasAnnotationMark', () => {
    it.each([
      [
        'returns true when node contains annotation',
        doc(
          p(
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'id-0',
            })('annotated text'),
          ),
        ),
        true,
      ],
      [
        'returns false when node does not contain annotation',
        doc(p('text')),
        false,
      ],
      [
        'returns false if annotation exists in nodes descendants',
        doc(
          panel()(
            p(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'id-0',
              })('annotated text'),
            ),
          ),
        ),
        false,
      ],
    ])('%s', (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);
      const annotationNode = editorView.state.doc.firstChild!.firstChild!;
      expect(hasAnnotationMark(annotationNode, editorView.state)).toBe(
        expected,
      );
    });
  });

  describe('annotationExists', () => {
    let pluginState: jest.SpyInstance;
    const dummyState = {} as EditorState;
    beforeEach(() => {
      pluginState = mockCommentsStateWithAnnotations({ 'annotation-id': true });
    });
    afterEach(() => {
      pluginState.mockClear();
    });

    it('verifies if annotation is in the plugin state', () => {
      expect(annotationExists('annotation-id', dummyState)).toBe(true);
      expect(annotationExists('non-existing-annotation-id', dummyState)).toBe(
        false,
      );
    });
  });

  describe('containsAnyAnnotations', () => {
    it.each([
      [
        'returns false when slice does not contain annotation',
        doc(p('text')),
        false,
      ],
      [
        'returns true if slice contains annotations',
        doc(
          panel()(
            p(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'id-0',
              })('annotated text'),
            ),
          ),
        ),
        true,
      ],
    ])('%s', (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);
      const testNode = editorView.state.doc.firstChild!;
      const slice = new Slice(Fragment.from(testNode), 0, 0);
      expect(containsAnyAnnotations(slice, editorView.state)).toBe(expected);
    });
  });

  describe('stripNonExistingAnnotations', () => {
    let pluginState: jest.SpyInstance,
      inputDoc: (schema: Schema<any, any>) => RefsNode;
    beforeEach(() => {
      pluginState = mockCommentsStateWithAnnotations({ 'annotation-id': true });
      inputDoc = doc(
        p(
          annotation({
            annotationType: AnnotationTypes.INLINE_COMMENT,
            id: 'id-0',
          })('annotated text'),
        ),
      );
    });
    afterEach(() => {
      pluginState.mockClear();
    });

    function testStripAnnotations(expected: boolean) {
      const {
        editorView: { state },
      } = editor(inputDoc);
      const testNode = state.doc.firstChild!;
      const slice = new Slice(Fragment.from(testNode), 0, 0);
      const annotationNode = slice.content.firstChild!.firstChild!;
      expect(
        annotationNode.marks.some((mark) => mark.type.name === 'annotation'),
      ).toBe(true);
      stripNonExistingAnnotations(slice, state);
      expect(
        annotationNode.marks.some((mark) => mark.type.name === 'annotation'),
      ).toBe(expected);
    }

    it('removes annotation from the slice if it is not in the plugin state', () => {
      testStripAnnotations(false);
    });

    it('keeps annotation if it is in the plugin state', () => {
      pluginState = mockCommentsStateWithAnnotations({ 'id-0': true });
      testStripAnnotations(true);
    });
  });

  describe('findAnnotationsInSelection', () => {
    test.each([
      [
        'left side',
        doc(
          p(
            '{<>}',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'id-0',
            })('annotated text'),
          ),
        ),
      ],
      [
        'right side',
        doc(
          p(
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'id-0',
            })('annotated text'),
            '{<>}',
          ),
        ),
      ],
      [
        'middle',
        doc(
          p(
            'Hello, ',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'id-0',
            })('my brave new'),
            '{<>} world.',
          ),
        ),
      ],
    ])('on %s of annotation', (_, inputDoc) => {
      const { editorView } = editor(inputDoc);
      const { selection, doc } = editorView.state;

      expect(findAnnotationsInSelection(selection, doc)).toContainEqual({
        id: 'id-0',
        type: AnnotationTypes.INLINE_COMMENT,
      });
    });
  });
});
