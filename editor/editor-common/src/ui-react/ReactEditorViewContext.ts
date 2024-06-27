import React from 'react';

import { type EditorView } from '@atlaskit/editor-prosemirror/view';

type ReactEditorViewContextProps = {
	editorView?: EditorView;
	editorRef?: React.RefObject<HTMLDivElement>;
	popupsMountPoint?: HTMLElement | undefined;
};

const ReactEditorViewContext = React.createContext<ReactEditorViewContextProps>({});

export default ReactEditorViewContext;
