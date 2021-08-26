import {
  doc,
  p,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
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

  it('should keep paragraph as the last node', async () => {
    const { editorView, typeAheadTool } = editor(doc(p('{<>}')));
    await typeAheadTool.searchQuickInsert('info')?.insert({ index: 0 });

    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p('')), p('')),
    );
  });
});
