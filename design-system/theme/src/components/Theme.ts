import { createTheme } from '../utils/createTheme';
import { GlobalThemeTokens } from '../types';

// Create default global light theme
const { Provider, Consumer, useTheme } = createTheme<GlobalThemeTokens, void>(
  () => ({
    mode: 'light',
  }),
);

export const useGlobalTheme = () => {
  return useTheme();
};

export default { Provider, Consumer };
