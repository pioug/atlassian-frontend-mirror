import { TextSelection, Selection } from 'prosemirror-state';
import { DecorationSet, EditorView } from 'prosemirror-view';
import { Slice } from 'prosemirror-model';
import {
  doc,
  p as paragraph,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  Preset,
  createProsemirrorEditorFactory,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  addFakeTextCursor,
  removeFakeTextCursor,
  FakeTextCursorSelection,
  drawFakeTextCursor,
  FakeTextCursorBookmark,
} from '../../cursor';
import fakeTextCursorPlugin from '../../index';

describe('FakeTextCursor -> Cursor', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(fakeTextCursorPlugin),
    });

  describe('addFakeTextCursor', () => {
    it('should add placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      expect(editorView.state.selection instanceof TextSelection).toEqual(true);
      addFakeTextCursor(editorView.state, editorView.dispatch);
      expect(
        editorView.state.selection instanceof FakeTextCursorSelection,
      ).toEqual(true);
    });
  });

  describe('removeFakeTextCursor', () => {
    it('should remove placeholder cursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addFakeTextCursor(editorView.state, editorView.dispatch);
      expect(
        editorView.state.selection instanceof FakeTextCursorSelection,
      ).toEqual(true);
      removeFakeTextCursor(editorView.state, editorView.dispatch);
      expect(editorView.state.selection instanceof TextSelection).toEqual(true);
    });
  });

  describe('drawFakeTextCursor', () => {
    it('should return null if selection is not of type FakeTextCursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      const decoration = drawFakeTextCursor(editorView.state);
      expect(decoration).toEqual(null);
    });

    it('should return DecorationSet if selection is of type FakeTextCursor', () => {
      const { editorView } = editor(doc(paragraph('{<>}')));
      addFakeTextCursor(editorView.state, editorView.dispatch);
      const decoration = drawFakeTextCursor(editorView.state);
      expect(decoration instanceof DecorationSet).toEqual(true);
    });
  });

  describe('FakeTextCursorBookmark', () => {
    let editorView: EditorView;
    let linkFakeBookmark: FakeTextCursorBookmark;
    beforeEach(() => {
      ({ editorView } = editor(doc(paragraph('{<>}'))));
      linkFakeBookmark = new FakeTextCursorBookmark(
        editorView.state.selection.$from.pos,
      );
    });

    it('should have instance method map defined', () => {
      expect(linkFakeBookmark.map).not.toEqual(undefined);
    });

    it('should have instance method resolve defined', () => {
      expect(linkFakeBookmark.resolve).not.toEqual(undefined);
    });
  });

  describe('FakeTextCursor', () => {
    let editorView: EditorView;
    let linkFakeTextCursor: FakeTextCursorSelection;
    beforeEach(() => {
      ({ editorView } = editor(doc(paragraph('{<>}'))));
      linkFakeTextCursor = new FakeTextCursorSelection(
        editorView.state.selection.$from,
      );
    });

    it('should extend Selection', () => {
      expect(linkFakeTextCursor instanceof Selection).toEqual(true);
    });

    it('should return instance of FakeTextCursorBookmark when getBookmark is called', () => {
      expect(
        linkFakeTextCursor.getBookmark() instanceof FakeTextCursorBookmark,
      ).toEqual(true);
    });

    it('should return true when eq() is called with FakeTextCursor having same head', () => {
      const linkFakeTextCursorOther = new FakeTextCursorSelection(
        editorView.state.selection.$from,
      );
      expect(linkFakeTextCursor.eq(linkFakeTextCursorOther)).toEqual(true);
    });

    it('should return empty Slice when content() is called', () => {
      expect(linkFakeTextCursor.content()).toEqual(Slice.empty);
    });
  });
});
