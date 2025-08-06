import React, { createContext, useContext } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

type EditorToolbarContextType = {
	editorView: EditorView | null;
};

const EditorToolbarContext = createContext<EditorToolbarContextType>({
	editorView: null,
});

/**
 * Access editor specific config and state within a toolbar component
 */
export const useEditorToolbar = () => {
	const context = useContext(EditorToolbarContext);

	if (!context) {
		throw new Error('useEditorToolbar must be used within EditorToolbarContext');
	}

	return context;
};

type EditorToolbarProviderProps = {
	children: React.ReactNode;
} & EditorToolbarContextType;

export const EditorToolbarProvider = ({ children, editorView }: EditorToolbarProviderProps) => {
	return (
		<EditorToolbarContext.Provider value={{ editorView }}>{children}</EditorToolbarContext.Provider>
	);
};
