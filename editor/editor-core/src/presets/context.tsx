import React, { useContext, useMemo, useState } from 'react';

import type { NextEditorPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SetEditorAPI = (editorApi: PublicPluginAPI<any>) => void;

export interface EditorAPIContextType {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	editorApi?: PublicPluginAPI<any>;
	setEditorApi?: SetEditorAPI;
}

export const EditorAPIContext = React.createContext<EditorAPIContextType>({});

interface EditorAPIProviderProps {
	children: React.ReactNode;
}

export const PresetContextProvider = ({ children }: EditorAPIProviderProps) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [editorApi, setEditorApi] = useState<PublicPluginAPI<any> | undefined>();

	const contextValue = useMemo(() => ({ editorApi, setEditorApi }), [editorApi, setEditorApi]);

	return <EditorAPIContext.Provider value={contextValue}>{children}</EditorAPIContext.Provider>;
};

export function usePresetContext<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Plugins extends NextEditorPlugin<any, any>[],
>(): PublicPluginAPI<Plugins> {
	const { editorApi } = useContext(EditorAPIContext);
	return editorApi as PublicPluginAPI<Plugins>;
}

export const useSetPresetContext = () => {
	const { setEditorApi } = useContext(EditorAPIContext);
	return setEditorApi;
};
