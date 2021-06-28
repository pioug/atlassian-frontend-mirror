import { AnnotationTypes } from '@atlaskit/adf-schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  annotation,
  code_block,
  doc,
  emoji,
  hardBreak,
  media,
  mediaGroup,
  p,
  panel,
  status,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  canApplyAnnotationOnRange,
  getAnnotationIdsFromRange,
} from '../../index';

describe('annotation', () => {
  describe('#canApplyAnnotationOnRange', () => {
    describe('when the range selection is invalid', () => {
      it.each([
        { from: 10, to: 1 },
        { from: 10, to: -1 },
        { from: 10, to: 10 },
        { from: 50, to: 10 },
        { from: -1, to: 10 },
        { from: -1, to: -1 },
        { from: -1, to: 10 },
      ])('should return false', (selection) => {
        const { doc: docNode, schema } = createEditorState(doc(p('Corsair')));

        expect(
          canApplyAnnotationOnRange(
            {
              from: selection.from,
              to: selection.to,
            },
            docNode,
            schema,
          ),
        ).toBe(false);
      });
    });

    describe.each([
      [
        'text only',
        // prettier-ignore
        doc(
          p(
            '{<}Corsair{>}',
            emoji({ shortName: ':smiley:' })()
          )
        ),
        true,
      ],
      [
        'text and emoji',
        // prettier-ignore
        doc(
          p(
            '{<}Corsair',
            emoji({ shortName: ':smiley:' })(),
            '{>}'
          )
        ),
        false,
      ],
      [
        'emoji',
        // prettier-ignore
        doc(
          p(
            'Corsair{<}',
            emoji({ shortName: ':smiley:' })(),
            '{>}'
          )
        ),
        false,
      ],
      [
        'text and media',
        // prettier-ignore
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
        false,
      ],
      [
        'text and code block content',
        // prettier-ignore
        doc(
          p('Cor{<}sair'),
          code_block()('this is {>}code')
        ),
        false,
      ],
      [
        'code block content',
        // prettier-ignore
        doc(
          p('Corsair'),
          code_block()('{<}this is code{>}')
        ),
        false,
      ],
      [
        'text with hard break',
        // prettier-ignore
        doc(
          p(
            'Corsa{<}ir',
            hardBreak(),
            ' corsa{>}ir'
          )
        ),
        true,
      ],
      [
        'panel content',
        // prettier-ignore
        doc(
          p('Corsair'),
          panel()(
            p('Ins{<}ide panel text{>}'),
          ),
        ),
        true,
      ],
      [
        'status content',
        // prettier-ignore
        doc(
          p(
            'Corsair {<}',
            status({
              text:  'Inside panel text',
              color: '#cacaca',
              localId: 'lol',
            }),
            '{>}',
          ),
        ),
        false,
      ],
    ])('when the selection is around %s', (testCase, inputDoc, expected) => {
      it(`should return ${expected}`, () => {
        const { selection, doc, schema } = createEditorState(inputDoc);

        expect(
          canApplyAnnotationOnRange(
            {
              from: selection.from,
              to: selection.to,
            },
            doc,
            schema,
          ),
        ).toBe(expected);
      });
    });
  });

  describe('#getAnnotationIdsFromRange', () => {
    [
      {
        test: 'returns all nested ids when cursor is inside nested annotations',
        doc: doc(
          p(
            'hello ',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'second',
            })(
              annotation({
                annotationType: AnnotationTypes.INLINE_COMMENT,
                id: 'first',
              })('dou{<>}ble'),
            ),
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'first',
            })('single'),
            'world',
          ),
        ),
        expected: ['first', 'second'],
      },
      {
        test: 'returns annotation ids when selection is across it',
        doc: doc(
          p(
            'hello ',
            annotation({
              annotationType: AnnotationTypes.INLINE_COMMENT,
              id: 'first',
            })('si{<}ngle'),
            'world{>}',
          ),
        ),
        expected: ['first'],
      },
      {
        test: 'returns empty array when no annotations in selection',
        doc: doc(p('{<}hello{>}')),
        expected: [],
      },
      {
        test: 'returns empty array there is no selection',
        doc: doc(p('hello')),
        expected: [],
      },
    ].forEach(({ test, doc: testDoc, expected }) => {
      it(test, () => {
        const { selection, doc: docNode, schema } = createEditorState(testDoc);
        expect(
          getAnnotationIdsFromRange(
            {
              from: selection.from,
              to: selection.to,
            },
            docNode,
            schema,
          ),
        ).toStrictEqual(expected);
      });
    });
  });
});
