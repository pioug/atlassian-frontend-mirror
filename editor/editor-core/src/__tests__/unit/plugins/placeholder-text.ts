import { name } from '../../../version.json';
import placeholderTextPlugin from '../../../plugins/placeholder-text';
import {
  insertPlaceholderTextAtSelection,
  showPlaceholderFloatingToolbar,
  hidePlaceholderFloatingToolbar,
} from '../../../plugins/placeholder-text/actions';
import { FakeTextCursorSelection } from '../../../plugins/fake-text-cursor/cursor';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  DocBuilder,
  p,
  placeholder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { Selection } from 'prosemirror-state';
import { pluginKey } from '../../../plugins/placeholder-text/plugin-key';

describe(name, () => {
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder, options = { allowInserting: true }) =>
    createEditor({
      doc,
      editorProps: { allowTemplatePlaceholders: options },
    });
  describe('Plugins -> PlaceholderText', () => {
    it('should set the `state.allowInserting` to true', () => {
      const { editorView } = editor(
        doc(p('Hello world', placeholder({ text: 'Type something' }))),
        { allowInserting: true },
      );
      const pluginState = pluginKey.getState(editorView.state);
      expect(pluginState.allowInserting).toBe(true);
    });

    it('should provide the placeholderText node', () => {
      const nodes = placeholderTextPlugin({ allowInserting: true }).nodes!();
      expect(nodes).toEqual([expect.objectContaining({ name: 'placeholder' })]);
    });

    it('should not remove a placeholder when cursor is not directly before it', () => {
      const { editorView, sel } = editor(
        doc(p('Hello world{<>}!', placeholder({ text: 'Type something' }))),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('Hello world!!', placeholder({ text: 'Type something' }))),
      );
    });
    it('should not remove a placeholder when cursor is directly after it', () => {
      const { editorView, sel } = editor(
        doc(p(placeholder({ text: 'Type something' }), '{<>}')),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(placeholder({ text: 'Type something' }), '!')),
      );
    });

    it('should remove a placeholder when typing directly before it', () => {
      const { editorView, sel } = editor(
        doc(p('Hello world{<>}', placeholder({ text: 'Type something' }))),
      );
      insertText(editorView, '!', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('Hello world!')));
    });

    describe('when options.allowInserting is false', () => {
      it('should set the `state.allowInserting` to false', () => {
        const { editorView } = editor(
          doc(p('Hello world', placeholder({ text: 'Type something' }))),
          { allowInserting: false },
        );
        const pluginState = pluginKey.getState(editorView.state);
        expect(pluginState.allowInserting).toBe(false);
      });

      it('should provide the placeholderText node', () => {
        const nodes = placeholderTextPlugin({ allowInserting: false }).nodes!();
        expect(nodes).toEqual([
          expect.objectContaining({ name: 'placeholder' }),
        ]);
      });

      it('should not remove a placeholder when cursor is not directly before it', () => {
        const { editorView, sel } = editor(
          doc(p('Hello world{<>}!', placeholder({ text: 'Type something' }))),
          { allowInserting: false },
        );
        insertText(editorView, '!', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('Hello world!!', placeholder({ text: 'Type something' }))),
        );
      });

      it('should not remove a placeholder when cursor is directly after it', () => {
        const { editorView, sel } = editor(
          doc(p(placeholder({ text: 'Type something' }), '{<>}')),
          { allowInserting: false },
        );
        insertText(editorView, '!', sel);
        expect(editorView.state.doc).toEqualDocument(
          doc(p(placeholder({ text: 'Type something' }), '!')),
        );
      });

      it('should remove a placeholder when typing directly before it', () => {
        const { editorView, sel } = editor(
          doc(p('Hello world{<>}', placeholder({ text: 'Type something' }))),
          { allowInserting: false },
        );
        insertText(editorView, '!', sel);
        expect(editorView.state.doc).toEqualDocument(doc(p('Hello world!')));
      });
    });
  });

  describe('Plugins -> PlaceholderText -> actions', () => {
    describe('insertPlaceholderTextAtSelection', () => {
      it('should insert placeholder-text node to the document', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        insertPlaceholderTextAtSelection('What are you saying')(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello{<>}', placeholder({ text: 'What are you saying' }))),
        );
      });

      it('should place selection after node when placeholder-text node inserted', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        insertPlaceholderTextAtSelection('What are you saying')(
          editorView.state,
          editorView.dispatch,
        );
        const selectionAtEnd = Selection.atEnd(editorView.state.doc);
        expect(editorView.state.selection.eq(selectionAtEnd)).toBe(true);
      });

      it('should hide the placeholder toolbar when placeholder-text node inserted', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        insertPlaceholderTextAtSelection('What are you saying')(
          editorView.state,
          editorView.dispatch,
        );
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy.mock.calls[0][0].getMeta(pluginKey)).toEqual({
          showInsertPanelAt: null,
        });
      });
    });

    describe('showPlaceholderFloatingToolbar', () => {
      it('should set the `showInsertPanelAt` meta value to the selection position', () => {
        const { editorView, sel } = editor(doc(p('hello{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(typeof sel).toBe('number');
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy.mock.calls[0][0].getMeta(pluginKey)).toEqual({
          showInsertPanelAt: sel,
        });
      });

      it('should delete the selection if non-empty', () => {
        const { editorView } = editor(doc(p('hel{<}lo{>}')));
        showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(editorView.state.doc).toEqualDocument(doc(p('hel{<>}')));
      });

      it('should show the Fake Text Cursor when inserting placeholder text ', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(editorView.state.selection).toBeInstanceOf(
          FakeTextCursorSelection,
        );
      });
    });

    describe('hidePlaceholderFloatingToolbar', () => {
      it('should set the `showInsertPanelAt` meta value to null', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(dispatchSpy).toHaveBeenCalled();
        expect(dispatchSpy.mock.calls[0][0].getMeta(pluginKey)).toEqual({
          showInsertPanelAt: null,
        });
      });

      it('should remove the show the Fake Text Cursor when inserting placeholder text ', () => {
        const { editorView } = editor(doc(p('hello{<>}')));
        showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(editorView.state.selection).toBeInstanceOf(
          FakeTextCursorSelection,
        );

        hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
        expect(editorView.state.selection).toBeInstanceOf(Selection);
      });
    });
  });
});
