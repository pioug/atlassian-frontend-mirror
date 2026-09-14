import { useContext } from 'react';

import { EditorThemeContext } from './index';
import type { EditorTheme } from './index';

export const useEditorThemeContext = (): EditorTheme => useContext(EditorThemeContext);
