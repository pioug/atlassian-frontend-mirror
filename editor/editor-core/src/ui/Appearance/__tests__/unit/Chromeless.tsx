import {
  doc,
  p,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { sendKeyToPm } from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

describe('Chromeless editor', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        appearance: 'chromeless',
        quickInsert: true,
      },
    });

  it('should keep paragraph as the last node', () => {
    const { editorView, sel } = editor(doc(p('{<>}')));
    insertText(editorView, '/info', sel);
    sendKeyToPm(editorView, 'Enter');

    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p('')), p('')),
    );
  });
});
