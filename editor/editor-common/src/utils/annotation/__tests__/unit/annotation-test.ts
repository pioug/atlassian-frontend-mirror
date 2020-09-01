import { EditorState } from 'prosemirror-state';

import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  code_block,
  doc,
  emoji,
  hardBreak,
  media,
  mediaGroup,
  p,
  panel,
  RefsNode,
  status,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';

import { canApplyAnnotationOnRange } from '../../index';

function createEditorState(documentNode: RefsNode) {
  const myState = EditorState.create({
    doc: documentNode,
  });
  const { tr } = myState;
  setSelectionTransform(documentNode, tr);
  return myState.apply(tr);
}

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
      ])('should return false', selection => {
        const { doc: docNode, schema } = createEditorState(
          doc(p('Corsair'))(sampleSchema),
        );

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
        const { selection, doc, schema } = createEditorState(
          inputDoc(sampleSchema),
        );

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
});
