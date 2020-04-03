import { createTheme } from '../utils/createTheme';
import { GlobalThemeTokens } from '../types';

// Create default global light theme
export default createTheme<GlobalThemeTokens, any>(() => ({
  mode: 'light',
}));
