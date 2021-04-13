import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  p,
  doc,
  DocBuilder,
  code,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { clearEditorContent, insertNewLine } from '../../../commands';

describe('commands', () => {
  const createEditor = (doc: DocBuilder) =>
    createEditorFactory()({
      doc,
    });

  describe('clearEditorContent', () => {
    it('clears editor content', () => {
      const { editorView } = createEditor(doc(p('text{<>}')));
      clearEditorContent(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });
  });

  describe('insertNewLine', () => {
    it('hardBreak doesnt inherit marks', () => {
      const { editorView } = createEditor(doc(p(code('te{<>}xt'))));
      insertNewLine()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('te'), hardBreak(), code('xt'))),
      );
    });
  });
});
