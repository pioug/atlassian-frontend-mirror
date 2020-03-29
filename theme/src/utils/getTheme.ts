import { Theme, ThemeProps } from '../types';

// ideally this would be fetched from ../constants but that causes a
// circular dep loop. This will be refactored as part of a breaking
// change in the future.
const DEFAULT_THEME_MODE = 'light';

// Resolves the different types of theme objects in the current API
export default function getTheme(props?: ThemeProps): Theme {
  if (props && props.theme) {
    // Theme is the global Atlaskit theme
    if ('__ATLASKIT_THEME__' in props.theme) {
      return props.theme.__ATLASKIT_THEME__;
    }
    // User has provided alternative modes
    else if ('mode' in props.theme) {
      return props.theme;
    }
  }
  // If format not supported (or no theme provided), return standard theme
  return { mode: DEFAULT_THEME_MODE };
}
