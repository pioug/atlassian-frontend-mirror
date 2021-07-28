import { p, ul, ol, li, doc } from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { mergeNextListAtPosition } from '../../../actions/merge-lists';

describe('list -> actions -> merge-lists', () => {
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
