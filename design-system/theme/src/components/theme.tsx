import type { GlobalThemeTokens } from '../types';
import { createTheme } from '../utils/create-theme';

// Create default global light theme
const { Provider, Consumer, useTheme } = createTheme<GlobalThemeTokens, void>(
  () => ({
    mode: 'light',
  }),
);

export { useTheme as useGlobalTheme };

export default { Provider, Consumer };
