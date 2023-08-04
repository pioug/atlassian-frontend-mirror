import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  code,
  doc,
  DocBuilder,
  hardBreak,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { insertNewLine } from '../commands';

describe('commands', () => {
  const createEditor = (doc: DocBuilder) =>
    createEditorFactory()({
      doc,
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
