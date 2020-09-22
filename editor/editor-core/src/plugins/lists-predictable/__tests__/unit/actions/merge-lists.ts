import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import {
  p,
  ul,
  ol,
  li,
  doc,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { mergeNextListAtPosition } from '../../../actions/merge-lists';

function createEditorState(
  documentNode: (schema: Schema<any, any>) => RefsNode,
) {
  const doc = documentNode(sampleSchema);
  const myState = EditorState.create({
    doc,
  });
  const { tr } = myState;
  setSelectionTransform(doc, tr);
  return myState.apply(tr);
}
describe('list-predictable -> actions -> merge-lists', () => {
  it('should merge the current list selected with the next sibling', () => {
    // prettier-ignore
    const documentCase = doc(
      '{<>}',
      ul(
        li(
          p('A'),
        ),
      ),
      ul(
        li(
          p('B'),
        ),
      ),
    );
    // prettier-ignore
    const documentExpected = doc(
      ul(
        li(
          p('A'),
        ),
        li(
          p('B'),
        ),
      ),
    );
    const state = createEditorState(documentCase);
    const {
      tr,
      selection: { $from },
    } = state;

    mergeNextListAtPosition({ tr, listPosition: $from.pos });

    expect(tr.docChanged).toBe(true);
    expect(tr.doc).toEqualDocument(documentExpected);
  });

  describe('when the next list has a different type', () => {
    it('should merge and keep the the type of the sibling list ', () => {
      // prettier-ignore
      const documentCase = doc(
      '{<>}',
      ul(
        li(
          p('A'),
        ),
      ),
      ol(
        li(
          p('B'),
        ),
      ),
    );
      // prettier-ignore
      const documentExpected = doc(
      ol(
        li(
          p('A'),
        ),
        li(
          p('B'),
        ),
      ),
    );
      const state = createEditorState(documentCase);
      const {
        tr,
        selection: { $from },
      } = state;

      mergeNextListAtPosition({ tr, listPosition: $from.pos });

      expect(tr.docChanged).toBe(true);
      expect(tr.doc).toEqualDocument(documentExpected);
    });
  });
});
