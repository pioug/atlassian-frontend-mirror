import React from 'react';

import { type EditorView } from '@atlaskit/editor-prosemirror/view';

type ReactEditorViewContextProps = {
	editorRef?: React.RefObject<HTMLDivElement>;
	editorView?: EditorView;
	popupsMountPoint?: HTMLElement | undefined;
};

const ReactEditorViewContext = React.createContext<ReactEditorViewContextProps>({});

export default ReactEditorViewContext;
