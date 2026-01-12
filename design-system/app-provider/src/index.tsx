export { default } from './app-provider';

// Theme provider
export { UNSAFE_useColorModeForMigration } from './theme-provider/hooks/use-color-mode-for-migration';
export { useColorMode } from './theme-provider/hooks/use-color-mode';
export { useSetColorMode } from './theme-provider/hooks/use-set-color-mode';
export { useSetTheme } from './theme-provider/hooks/use-set-theme';
export { useTheme } from './theme-provider/hooks/use-theme';

export type { Theme } from './theme-provider/context/theme';
export { default as ThemeProvider, type ThemeProviderProps } from './theme-provider';

// Router link provider
export { type RouterLinkComponent, type RouterLinkComponentProps } from './router-link-provider';
import useRouterLink from './router-link-provider/hooks/use-router-link';
export { useRouterLink };
