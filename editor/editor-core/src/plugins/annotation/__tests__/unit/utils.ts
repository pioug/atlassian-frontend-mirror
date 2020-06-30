import { Decoration } from 'prosemirror-view';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common';
import {
  annotation,
  doc,
  emoji,
  em,
  p,
  strike,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import {
  surroundingMarks,
  getAllAnnotations,
  addDraftDecoration,
  getAnnotationViewKey,
  inlineCommentPluginKey,
  hasInlineNodes,
  hasWhitespaceNode,
  isSelectionValid,
} from '../../utils';
import { AnnotationInfo, AnnotationSelectionType } from '../../types';

import annotationPlugin from '../..';
import emojiPlugin from '../../../emoji';
import { inlineCommentProvider } from '../_utils';

const annotationPreset = new Preset<LightEditorPlugin>()
  .add([
    annotationPlugin,
    { inlineComment: { ...inlineCommentProvider, disallowOnWhitespace: true } },
  ])
  .add(emojiPlugin);

const emojiProvider = emojiData.testData.getEmojiResourcePromise();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('annotation', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: any) =>
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

  describe('hasInlineNodes', () => {
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
    ])('%s', (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);

      expect(hasInlineNodes(editorView.state)).toBe(expected);
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
    test.each([
      ['text', doc(p('{<}Corsair smartly{>}')), AnnotationSelectionType.VALID],
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
    ])('%s', (_, inputDoc, expected) => {
      const { editorView } = editor(inputDoc);

      expect(isSelectionValid(editorView.state)).toBe(expected);
    });
  });
});
