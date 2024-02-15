import React, { useContext, useMemo, useState } from 'react';

import type {
  NextEditorPlugin,
  OptionalPlugin,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';

export type SetEditorAPI = (editorApi: PublicPluginAPI<any>) => void;

export interface EditorAPIContextType {
  editorApi?: PublicPluginAPI<any>;
  setEditorApi?: SetEditorAPI;
}

export const EditorAPIContext = React.createContext<EditorAPIContextType>({});

interface EditorAPIProviderProps {
  children: React.ReactNode;
}

export const PresetContextProvider = ({ children }: EditorAPIProviderProps) => {
  const [editorApi, setEditorApi] = useState<
    PublicPluginAPI<any> | undefined
  >();

  const contextValue = useMemo(
    () => ({ editorApi, setEditorApi }),
    [editorApi, setEditorApi],
  );

  return (
    <EditorAPIContext.Provider value={contextValue}>
      {children}
    </EditorAPIContext.Provider>
  );
};

export function usePresetContext<
  Plugins extends OptionalPlugin<NextEditorPlugin<any, any>>[],
>(): PublicPluginAPI<Plugins> {
  const { editorApi } = useContext(EditorAPIContext);
  return editorApi as PublicPluginAPI<Plugins>;
}

export const useSetPresetContext = () => {
  const { setEditorApi } = useContext(EditorAPIContext);
  return setEditorApi;
};
