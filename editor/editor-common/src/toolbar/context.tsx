import React, { createContext, useContext, useMemo } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const EditorToolbarProvider = ({
	children,
	editorView,
	editorAppearance,
	editorViewMode,
	editorToolbarDockingPreference,
	isOffline,
}: EditorToolbarProviderProps): React.JSX.Element => {
	const memoizedValue = useMemo(
		() => ({
			editorView,
			editorAppearance,
			editorViewMode,
			editorToolbarDockingPreference,
			isOffline,
		}),
		[editorView, editorAppearance, editorViewMode, editorToolbarDockingPreference, isOffline],
	);
	const contextValue = expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
		? memoizedValue
		: {
				editorView,
				editorAppearance,
				editorViewMode,
				editorToolbarDockingPreference,
				isOffline,
			};

	return (
		<EditorToolbarContext.Provider value={contextValue}>{children}</EditorToolbarContext.Provider>
	);
};
