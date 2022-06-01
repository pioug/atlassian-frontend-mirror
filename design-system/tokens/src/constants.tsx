export const THEMES = ['light', 'dark'] as const;
export const THEME_DATA_ATTRIBUTE = 'data-theme';
export const DEFAULT_THEME = 'light';
export const CSS_PREFIX = 'ds';

// Maps the longer theme name to a shorthand used in css/code
export const LONG_SHORT_MAPPING: Record<string, typeof THEMES[number]> = {
  'atlassian-light': 'light',
  'atlassian-dark': 'dark',
};

export const TOKEN_NOT_FOUND_CSS_VAR = `--${CSS_PREFIX}-token-not-found`;
