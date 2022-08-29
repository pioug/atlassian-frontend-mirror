export const THEMES = ['light', 'dark', 'legacy-light', 'legacy-dark'] as const;
export const THEME_DATA_ATTRIBUTE = 'data-theme';
export const DEFAULT_THEME = 'light';
export const CSS_PREFIX = 'ds';

// Maps the longer theme name to a shorthand used in css/code
export const THEME_NAME_MAP = {
  'atlassian-light': 'light',
  'atlassian-dark': 'dark',
  'atlassian-legacy-light': 'legacy-light',
  'atlassian-legacy-dark': 'legacy-dark',
};

export const TOKEN_NOT_FOUND_CSS_VAR = `--${CSS_PREFIX}-token-not-found`;
