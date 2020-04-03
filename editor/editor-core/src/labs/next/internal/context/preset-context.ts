import React from 'react';
import { EditorPlugin } from '../../../../types';

const PresetContext = React.createContext<Array<EditorPlugin>>([]);
const PresetProvider = PresetContext.Provider;
const usePresetContext = () => React.useContext(PresetContext);

export { PresetProvider, usePresetContext };
