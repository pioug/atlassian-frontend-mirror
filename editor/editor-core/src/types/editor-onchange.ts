import { EditorView } from 'prosemirror-view';

export type EditorOnChangeHandler = (
  editorView: EditorView,
  meta: { source: 'local' | 'remote' },
) => void;
