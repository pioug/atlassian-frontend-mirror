/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */

import type { ComponentType, ReactNode } from 'react';

import type { GlobalThemeTokens } from '../types';
import { createTheme, type ThemeProp } from '../utils/create-theme';

// Create default global light theme
const dest = createTheme<GlobalThemeTokens, void>(() => ({
	mode: 'light',
}));
const Provider: ComponentType<{
	children?: ReactNode;
	value?: ThemeProp<GlobalThemeTokens, void> | undefined;
}> = dest.Provider;
const Consumer: ComponentType<{
	children: (tokens: GlobalThemeTokens) => ReactNode;
}> = dest.Consumer;
const useTheme: (props: void) => GlobalThemeTokens = dest.useTheme;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and the supported customization APIs of Atlassian Design System components.
 */
export { useTheme as useGlobalTheme };

const Theme: {
	Provider: ComponentType<{
		children?: ReactNode;
		value?: ThemeProp<GlobalThemeTokens, void> | undefined;
	}>;
	Consumer: ComponentType<{
		children: (tokens: GlobalThemeTokens) => ReactNode;
	}>;
} = { Provider, Consumer };

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and the supported customization APIs of Atlassian Design System components.
 */
export default Theme;
