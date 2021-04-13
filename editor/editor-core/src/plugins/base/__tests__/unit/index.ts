import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

describe('Delete', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editorFactory = (doc: DocBuilder) =>
    createEditor({
      doc,
    });

  it(`should merge paragraph and preserve content`, () => {
    const { editorView } = editorFactory(doc(p('Hello{<>}'), p('World')));

    sendKeyToPm(editorView, 'Delete');

    const expectedDoc = doc(p('Hello{<>}World'));
    expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
  });
});
