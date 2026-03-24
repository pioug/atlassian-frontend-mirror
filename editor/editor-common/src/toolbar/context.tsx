import React, { createContext, useContext } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorAppearance } from '../types';
import type { ToolbarDocking } from '../user-preferences';

export type EditorToolbarContextType = {
	editorAppearance?: EditorAppearance;
	editorToolbarDockingPreference?: ToolbarDocking;
	editorView: EditorView | null;
	editorViewMode?: 'edit' | 'view';
	isOffline?: boolean;
};

const EditorToolbarContext = createContext<EditorToolbarContextType>({
	editorView: null,
	editorAppearance: undefined,
	editorViewMode: undefined,
	editorToolbarDockingPreference: undefined,
});

/**
 * Access editor specific config and state within a toolbar component
 */
export const useEditorToolbar = (): EditorToolbarContextType => {
	const context = useContext(EditorToolbarContext);

	if (!context) {
		throw new Error('useEditorToolbar must be used within EditorToolbarContext');
	}

	return context;
};

type EditorToolbarProviderProps = {
	children: React.ReactNode;
} & EditorToolbarContextType;

export const EditorToolbarProvider = ({
	children,
	editorView,
	editorAppearance,
	editorViewMode,
	editorToolbarDockingPreference,
	isOffline,
}: EditorToolbarProviderProps): React.JSX.Element => {
	return (
		<EditorToolbarContext.Provider
			// eslint-disable-next-line @atlassian/perf-linting/no-inline-context-value, @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			value={{
				editorView,
				editorAppearance,
				editorViewMode,
				editorToolbarDockingPreference,
				isOffline,
			}}
		>
			{children}
		</EditorToolbarContext.Provider>
	);
};
