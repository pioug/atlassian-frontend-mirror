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
  | 'atlassian-shape'
  | 'atlassian-spacing'
  | 'atlassian-typography';
export type ThemeFileNames = Themes;

/**
 * ThemeOverrides: The internal identifier of a theme override. Which are themes that contain
 * a subset of tokens intended to override an existing theme. These ids are what the actual
 * theme files/folders are called. style-dictionary will attempt to locate these in the file-system.
 * Theme overrides are temporary and there may not be any defined at times.
 */
export type ThemeOverrides =
  | 'atlassian-light-new-input-border'
  | 'atlassian-dark-new-input-border';

/**
 * Theme kinds: The type of theme.
 * Some themes are entirely focused on Color, whilst others are purely focused on spacing.
 * In the future other types may be introduced such as typography.
 */
export type ThemeKinds = 'color' | 'spacing' | 'typography' | 'shape';

/**
 * Theme modes: The general purpose of a theme.
 * This attr is used to apply the appropriate system-preference option
 * It may also be used as a selector for mode-specific overrides such as light/dark images.
 * The idea is there may exist many color themes, but every theme must either fit into light or dark.
 */
export const themeColorModes = ['light', 'dark', 'auto'] as const;
export type ThemeColorModes = (typeof themeColorModes)[number];
export type DataColorModes = Exclude<ThemeColorModes, 'auto'>;

/**
 * Theme ids: The value that will be mounted to the DOM as a data attr
 * For example: `data-theme="light:light dark:dark spacing:spacing"
 *
 * These ids must be kebab case
 */
export const themeIds = [
  'light',
  'dark',
  'legacy-light',
  'legacy-dark',
  'spacing',
  'typography',
  'shape',
] as const;
export type ThemeIds = (typeof themeIds)[number];

/**
 * Theme override ids: the equivalent of themeIds for theme overrides.
 * Theme overrides are temporary and there may not be any defined at times.
 */
export const themeOverrideIds = [
  'light-new-input-border',
  'dark-new-input-border',
] as const;
export type ThemeOverrideIds = (typeof themeOverrideIds)[number];

/**
 * Theme to use a base. This will create the theme as
 * an extension with all token values marked as optional
 * to allow tokens to be overridden as required.
 */
export type ExtensionThemeId = ThemeIds;

/**
 * Palettes: The set of base tokens a given theme may be populated with.
 * For example: legacy light & dark themes use the "legacyPalette" containing colors from our
 * previous color set.
 */
export type Palettes =
  | 'defaultPalette'
  | 'legacyPalette'
  | 'spacingScale'
  | 'shapePalette'
  | 'typographyPalette';

/**
 * ThemeConfig: the source of truth for all theme meta-data.
 * This object should be used whenever interfacing with themes.
 */
interface ThemeConfig {
  id: ThemeIds | ThemeOverrideIds;
  displayName: string;
  palette: Palettes;
  attributes: (
    | {
        type: 'color';
        // https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
        mode: DataColorModes;
      }
    | {
        type: Extract<ThemeKinds, 'spacing' | 'typography' | 'shape'>;
      }
  ) & {
    extends?: ExtensionThemeId;
  };
  override?: ThemeIds;
}

const themeConfig: Record<Themes | ThemeOverrides, ThemeConfig> = {
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
  'atlassian-typography': {
    id: 'typography',
    displayName: 'Atlassian Typography',
    palette: 'typographyPalette',
    attributes: {
      type: 'typography',
    },
  },
  'atlassian-shape': {
    id: 'shape',
    displayName: 'Atlassian Shape',
    palette: 'shapePalette',
    attributes: {
      type: 'shape',
    },
  },
  'atlassian-light-new-input-border': {
    id: 'light-new-input-border',
    displayName: 'Light Theme New Input Border',
    palette: 'defaultPalette',
    override: 'light',
    attributes: {
      type: 'color',
      mode: 'light',
    },
  },
  'atlassian-dark-new-input-border': {
    id: 'dark-new-input-border',
    displayName: 'Dark Theme New Input Border',
    palette: 'defaultPalette',
    override: 'dark',
    attributes: {
      type: 'color',
      mode: 'dark',
    },
  },
};

export default themeConfig;
