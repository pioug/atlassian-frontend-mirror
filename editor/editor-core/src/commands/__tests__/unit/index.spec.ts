// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';

import { createParagraphAtEnd } from '../../index';
describe('Editor commands', () => {
  describe('createParagraphAtEnd', () => {
    const createEditor = createEditorFactory();
    const editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        editorProps: { allowPanel: true },
      });
    it('should not append a paragraph at end when already present', () => {
      const { editorView } = editor(doc(p('Hello world'), p('')));
      createParagraphAtEnd()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Hello world'), p('')),
      );
    });

    it('should append a paragraph at end when not already present', () => {
      const { editorView } = editor(doc(p('Hello world')));
      createParagraphAtEnd()(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Hello world'), p('')),
      );
    });
  });
});
