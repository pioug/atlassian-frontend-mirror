import { Schema } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  p,
  ul,
  ol,
  li,
  doc,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { joinSiblingLists, JoinDirection } from '../../../utils/node';

type DocumentType = (schema: Schema) => RefsNode;

describe('utils/node', () => {
  describe('#joinSiblingLists', () => {
    const case0: [string, JoinDirection, DocumentType, DocumentType] = [
      'should join two list inside of the selection when the direction is right',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        ul(li(p('{<}A'))),
        ul(li(p('B{>}'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ul(
          li(p('{<}A')),
          li(p('B{>}')),
        ),
      ),
    ];

    const case1: [string, JoinDirection, DocumentType, DocumentType] = [
      'should join two list inside of the selection when the direction is left',
      JoinDirection.LEFT,
      // Scenario
      // prettier-ignore
      doc(
        ol(li(p('{<}A'))),
        ol(li(p('B{>}'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ol(
          li(p('{<}A')),
          li(p('B{>}')),
        ),
      ),
    ];

    const case2: [string, JoinDirection, DocumentType, DocumentType] = [
      'should join two list distinct list inside of the selection and keep the type of the left node',
      JoinDirection.LEFT,
      // Scenario
      // prettier-ignore
      doc(
        ul(li(p('{<}A'))),
        ol(li(p('B{>}'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ul(
          li(p('{<}A')),
          li(p('B{>}')),
        ),
      ),
    ];

    const case3: [string, JoinDirection, DocumentType, DocumentType] = [
      'should join two list distinct list inside of the selection and keep the type of the right node',
      JoinDirection.RIGHT,
      // Scenario
      // prettier-ignore
      doc(
        ul(li(p('{<}A'))),
        ol(li(p('B{>}'))),
      ),
      // Expected Result
      // prettier-ignore
      doc(
        ol(
          li(p('{<}A')),
          li(p('B{>}')),
        ),
      ),
    ];

    describe.each<[string, JoinDirection, DocumentType, DocumentType]>([
      // prettier-ignore
      case0,
      case1,
      case2,
      case3,
    ])(
      '[case%#] when %s',
      (_scenario, direction, previousDocument, expectedDocument) => {
        it('should match the expected document and keep the selection', () => {
          const myState = createEditorState(previousDocument);
          const { tr } = myState;

          joinSiblingLists({ tr, direction });

          expect(tr).toEqualDocumentAndSelection(
            expectedDocument(sampleSchema),
          );
        });
      },
    );
  });
});
