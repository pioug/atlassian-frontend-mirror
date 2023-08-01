import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type EditorOnChangeHandler = (
  editorView: EditorView,
  meta: { source: 'local' | 'remote' },
) => void;
