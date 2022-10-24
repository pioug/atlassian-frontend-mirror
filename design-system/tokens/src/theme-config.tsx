/**
 * This file contains the source of truth for themes and all associated meta data.
 */

/**
 * Themes: The internal identifier of a theme.
 * These ids are what the actual theme files/folders are called.
 * style-dictionary will attempt to locate these in the file-system.
 */
export type Themes =
  | 'atlassian-light'
  | 'atlassian-dark'
  | 'atlassian-legacy-light'
  | 'atlassian-legacy-dark'
  | 'atlassian-spacing';
export type ThemeFileNames = Themes;

/**
 * Theme kinds: The type of theme.
 * Some themes are entirely focused on Color, whilst others are purely focused on spacing.
 * In the future other types may be introduced such as typography.
 */
export type ThemeKinds = 'color' | 'spacing';

/**
 * Theme modes: The general purpose of a theme.
 * This attr is used to apply the appropriate system-preference media selector
 * It may also be used as a selector for mode-specific overrides such as light/dark images.
 * The idea is there may exist many color themes, but every theme must either fit into light or dark.
 */
export type ThemeColorModes = 'light' | 'dark';

/**
 * Theme ids: The value that will mounted to the DOM as a data attr
 * For example: `data-theme="light"
 *
 * These ids must be kebab case
 */
export type ThemeIds =
  | 'light'
  | 'dark'
  | 'legacy-light'
  | 'legacy-dark'
  | 'spacing';

/**
 * Palettes: The set of base tokens a given theme may be populated with.
 * For example: legacy light & dark themes use the "legacyPalette" containing colors from our
 * previous color set.
 */
export type Palettes = 'defaultPalette' | 'legacyPalette' | 'spacingScale';

/**
 * ThemeConfig: the source of truth for all theme meta-data.
 * This object should be used whenever interfacing with themes.
 */
interface ThemeConfig {
  id: ThemeIds;
  displayName: string;
  palette: Palettes;
  attributes:
    | {
        type: 'color';
        mode: ThemeColorModes;
      }
    | {
        type: 'spacing';
      };
}

const themeConfig: Record<Themes, ThemeConfig> = {
  'atlassian-light': {
    id: 'light',
    displayName: 'Light Theme',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'light',
    },
  },
  'atlassian-dark': {
    id: 'dark',
    displayName: 'Dark Theme',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'dark',
    },
  },
  'atlassian-legacy-light': {
    id: 'legacy-light',
    displayName: 'Light Theme (legacy)',
    palette: 'legacyPalette',
    attributes: {
      type: 'color',
      mode: 'light',
    },
  },
  'atlassian-legacy-dark': {
    id: 'legacy-dark',
    displayName: 'Dark Theme (legacy)',
    palette: 'legacyPalette',
    attributes: {
      type: 'color',
      mode: 'dark',
    },
  },
  'atlassian-spacing': {
    id: 'spacing',
    displayName: 'Atlassian Spacing',
    palette: 'spacingScale',
    attributes: {
      type: 'spacing',
    },
  },
};

export default themeConfig;
