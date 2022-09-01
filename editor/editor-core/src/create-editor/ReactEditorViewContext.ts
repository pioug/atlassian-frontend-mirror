import React from 'react';
import { EditorView } from 'prosemirror-view';

type ReactEditorViewContextProps = {
  editorView?: EditorView;
  editorRef?: React.RefObject<HTMLDivElement>;
};

const ReactEditorViewContext = React.createContext<ReactEditorViewContextProps>(
  {},
);

export default ReactEditorViewContext;
