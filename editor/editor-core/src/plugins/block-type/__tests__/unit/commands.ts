import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  doc,
  p,
  table,
  tr,
  td,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { transformToCodeBlockAction } from '../../commands';

describe('transform to code block', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: true,
      },
    });

  it('should not remove table if code-block inserted at table gap-cursor', () => {
    const LOCAL_ID = 'test-table-local-id';
    const { editorView } = editor(
      doc('{<|gap>}', table({ localId: LOCAL_ID })(tr(td()(p())))),
    );
    const { state, dispatch } = editorView;

    const transaction = transformToCodeBlockAction(state, 0);
    dispatch(transaction);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(code_block()('{<>}'), table({ localId: LOCAL_ID })(tr(td()(p())))),
    );
  });

  it('should wrap the text in after the cursor code-block', () => {
    const { editorView } = editor(doc(p('some{<>}text')));
    const { state, dispatch } = editorView;

    const transaction = transformToCodeBlockAction(state, 5);
    dispatch(transaction);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(p('some'), code_block()('{<>}text')),
    );
  });
});
