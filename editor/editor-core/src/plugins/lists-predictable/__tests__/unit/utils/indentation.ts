import { EditorState } from 'prosemirror-state';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import {
  p,
  ol,
  li,
  doc,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { hasValidListIndentationLevel } from '../../../utils/indentation';

function createEditorState(documentNode: RefsNode) {
  const editorState = EditorState.create({
    doc: documentNode,
  });
  const { tr } = editorState;
  setSelectionTransform(documentNode, tr);
  return editorState.apply(tr);
}

describe('utils', () => {
  describe('indentation', () => {
    // prettier-ignore
    const documentWithIndentedLists = doc(
      ol(
        li(p('A'),
        ol(
          li(p('B'),
          ol(
            li(p('C'),
            ol(
              li(p('D'),
              ol(
                li(p('E'),
                ol(
                  li(p('F')),
                )),
              )),
            )),
          )),
        )),
      ),
    )(sampleSchema);

    describe('#hasValidListIndentationLevel', () => {
      it('should return true if indentation level is within the maximum', () => {
        const { tr } = createEditorState(documentWithIndentedLists);
        expect(
          hasValidListIndentationLevel({ tr, maxIndentation: 6 }),
        ).toBeTruthy();
      });

      it('should return false if indentation level exceeds the maximum', () => {
        const { tr } = createEditorState(documentWithIndentedLists);
        expect(
          hasValidListIndentationLevel({ tr, maxIndentation: 3 }),
        ).toBeFalsy();
      });
    });
  });
});
