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

export { useTheme as useGlobalTheme };

const Theme: {
    Provider: ComponentType<{
        children?: ReactNode;
        value?: ThemeProp<GlobalThemeTokens, void> | undefined;
    }>; Consumer: ComponentType<{
        children: (tokens: GlobalThemeTokens) => ReactNode;
    }>;
} = { Provider, Consumer };
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Theme;
