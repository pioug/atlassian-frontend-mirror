import { createParagraphAtEnd } from '../../index';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
describe('Editor commands', () => {
  describe('createParagraphAtEnd', () => {
    const createEditor = createEditorFactory();
    const editor = (doc: any) =>
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
