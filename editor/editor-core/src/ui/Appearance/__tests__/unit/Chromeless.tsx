import {
  createEditorFactory,
  doc,
  insertText,
  p,
  panel,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';

describe('Chromeless editor', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
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
