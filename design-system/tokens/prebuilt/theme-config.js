"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeStateDefaults = exports.themeOverrideIds = exports.themeIdsWithOverrides = exports.themeIds = exports.themeContrastModes = exports.themeColorModes = exports.default = void 0;
/**
 * This file contains the source of truth for themes and all associated meta data.
 */

/**
 * Themes: The internal identifier of a theme.
 * These ids are what the actual theme files/folders are called.
 * style-dictionary will attempt to locate these in the file-system.
 */

/**
 * ThemeOverrides: The internal identifier of a theme override. Which are themes that contain
 * a subset of tokens intended to override an existing theme. These ids are what the actual
 * theme files/folders are called. style-dictionary will attempt to locate these in the file-system.
 * Theme overrides are temporary and there may not be any defined at times.
 */

/**
 * Theme kinds: The type of theme.
 * Some themes are entirely focused on Color, whilst others are purely focused on spacing.
 * In the future other types may be introduced such as typography.
 */

/**
 * Theme modes: The general purpose of a theme.
 * This attr is used to apply the appropriate system-preference option
 * It may also be used as a selector for mode-specific overrides such as light/dark images.
 * The idea is there may exist many color themes, but every theme must either fit into light or dark.
 */
var themeColorModes = exports.themeColorModes = ['light', 'dark', 'auto'];
/**
 * Contrast preferences: The system contrast preference
 */
var themeContrastModes = exports.themeContrastModes = ['more', 'no-preference', 'auto'];
/**
 * Theme ids: The value that will be mounted to the DOM as a data attr
 * For example: `data-theme="light:light dark:dark spacing:spacing"
 *
 * These ids must be kebab case
 */
var themeIds = exports.themeIds = ['light-increased-contrast', 'light', 'light-future', 'light-brand-refresh', 'dark', 'dark-future', 'dark-increased-contrast', 'dark-brand-refresh', 'legacy-light', 'legacy-dark', 'spacing', 'shape', 'typography-adg3', 'typography-modernized', 'typography-refreshed'];
/**
 * Theme override ids: the equivalent of themeIds for theme overrides.
 * Theme overrides are temporary and there may not be any defined at times.
 */
var themeOverrideIds = exports.themeOverrideIds = [];
var themeIdsWithOverrides = exports.themeIdsWithOverrides = [].concat(themeIds, themeOverrideIds);

/**
 * Theme to use a base. This will create the theme as
 * an extension with all token values marked as optional
 * to allow tokens to be overridden as required.
 */

/**
 * Palettes: The set of base tokens a given theme may be populated with.
 * For example: legacy light & dark themes use the "legacyPalette" containing colors from our
 * previous color set.
 */

/**
 * ThemeConfig: the source of truth for all theme meta-data.
 * This object should be used whenever interfacing with themes.
 */

var themeConfig = {
  'atlassian-light': {
    id: 'light',
    displayName: 'Light Theme',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'light'
    }
  },
  'atlassian-light-future': {
    id: 'light-future',
    displayName: 'Future Light Theme',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'light'
    },
    override: 'light'
  },
  'atlassian-light-increased-contrast': {
    id: 'light-increased-contrast',
    displayName: 'Light Theme (increased contrast)',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'light'
    },
    extends: 'light',
    increasesContrastFor: 'light'
  },
  'atlassian-dark': {
    id: 'dark',
    displayName: 'Dark Theme',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'dark'
    }
  },
  'atlassian-dark-future': {
    id: 'dark-future',
    displayName: 'Future Dark Theme',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'dark'
    },
    override: 'light'
  },
  'atlassian-dark-increased-contrast': {
    id: 'dark-increased-contrast',
    displayName: 'Dark Theme (increased contrast)',
    palette: 'defaultPalette',
    attributes: {
      type: 'color',
      mode: 'dark'
    },
    extends: 'dark',
    increasesContrastFor: 'dark'
  },
  'atlassian-legacy-light': {
    id: 'legacy-light',
    displayName: 'Light Theme (legacy)',
    palette: 'legacyPalette',
    attributes: {
      type: 'color',
      mode: 'light'
    }
  },
  'atlassian-legacy-dark': {
    id: 'legacy-dark',
    displayName: 'Dark Theme (legacy)',
    palette: 'legacyPalette',
    attributes: {
      type: 'color',
      mode: 'dark'
    }
  },
  'atlassian-spacing': {
    id: 'spacing',
    displayName: 'Atlassian Spacing',
    palette: 'spacingScale',
    attributes: {
      type: 'spacing'
    }
  },
  'atlassian-typography-adg3': {
    id: 'typography-adg3',
    displayName: 'ADG3 Typography',
    palette: 'typographyPalette',
    attributes: {
      type: 'typography'
    }
  },
  'atlassian-shape': {
    id: 'shape',
    displayName: 'Atlassian Shape',
    palette: 'shapePalette',
    attributes: {
      type: 'shape'
    }
  },
  'atlassian-typography-modernized': {
    id: 'typography-modernized',
    displayName: 'Atlassian Typography (Modernized)',
    palette: 'typographyPalette',
    attributes: {
      type: 'typography'
    }
  },
  'atlassian-typography-refreshed': {
    id: 'typography-refreshed',
    displayName: 'Atlassian Typography (Refreshed)',
    palette: 'typographyPalette',
    attributes: {
      type: 'typography'
    }
  },
  'atlassian-light-brand-refresh': {
    id: 'light-brand-refresh',
    displayName: 'Light theme (Brand refresh)',
    palette: 'brandRefreshPalette',
    attributes: {
      type: 'color',
      mode: 'light'
    }
  },
  'atlassian-dark-brand-refresh': {
    id: 'dark-brand-refresh',
    displayName: 'Dark theme (Brand refresh)',
    palette: 'brandRefreshPalette',
    attributes: {
      type: 'color',
      mode: 'dark'
    }
  }
};

/**
 * ThemeOptionsSchema: additional configuration options used to customize Atlassian's themes
 */

/**
 * ThemeState: the standard representation of an app's current theme and preferences
 */

/**
 * themeStateDefaults: the default values for ThemeState used by theming utilities
 */
var themeStateDefaults = exports.themeStateDefaults = {
  colorMode: 'auto',
  contrastMode: 'auto',
  dark: 'dark',
  light: 'light',
  shape: undefined,
  spacing: 'spacing',
  typography: undefined,
  UNSAFE_themeOptions: undefined
};

/**
 * Represents theme state once mounted to the page
 * (the page doesn't have an "auto" color mode, it's either light or dark)
 */
var _default = exports.default = themeConfig;