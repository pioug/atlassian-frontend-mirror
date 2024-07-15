import type { GlobalThemeTokens } from '../types';
import { createTheme } from '../utils/create-theme';

// Create default global light theme
const { Provider, Consumer, useTheme } = createTheme<GlobalThemeTokens, void>(() => ({
	mode: 'light',
}));

export { useTheme as useGlobalTheme };

const Theme = { Provider, Consumer };
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Theme;
