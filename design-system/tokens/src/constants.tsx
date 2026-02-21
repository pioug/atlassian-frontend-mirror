export const THEME_DATA_ATTRIBUTE = 'data-theme';
export const SUBTREE_THEME_ATTRIBUTE = 'data-subtree-theme';
export const COLOR_MODE_ATTRIBUTE = 'data-color-mode';
export const CONTRAST_MODE_ATTRIBUTE = 'data-contrast-mode';
export const CUSTOM_THEME_ATTRIBUTE = 'data-custom-theme';
export const CSS_PREFIX = 'ds';
export const CSS_VAR_FULL: string[] = ['opacity', 'font', 'space', 'border', 'radius'];
export const TOKEN_NOT_FOUND_CSS_VAR: '--ds-token-not-found' = `--${CSS_PREFIX}-token-not-found`;
export const CURRENT_SURFACE_CSS_VAR: '--ds-elevation-surface-current' =
	`--${CSS_PREFIX}-elevation-surface-current` as const;
