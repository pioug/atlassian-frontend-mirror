"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "themeColorModes", {
  enumerable: true,
  get: function get() {
    return _themeColorModes.themeColorModes;
  }
});
Object.defineProperty(exports, "themeIds", {
  enumerable: true,
  get: function get() {
    return _themeIds.themeIds;
  }
});
exports.themeIdsWithOverrides = void 0;
Object.defineProperty(exports, "themeStateDefaults", {
  enumerable: true,
  get: function get() {
    return _themeStateDefaults.themeStateDefaults;
  }
});
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _themeIds = require("./theme-ids");
var _themeColorModes = require("./theme-color-modes");
var _themeStateDefaults = require("./theme-state-defaults");
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
 * Contrast preferences: The system contrast preference
 */
var themeContrastModes = ['more', 'no-preference', 'auto'];
/**
 * Theme override ids: the equivalent of themeIds for theme overrides.
 * Theme overrides are temporary and there may not be any defined at times.
 */
var themeOverrideIds = [];
var themeIdsWithOverrides = exports.themeIdsWithOverrides = [].concat((0, _toConsumableArray2.default)(_themeIds.themeIds), themeOverrideIds);

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
  'atlassian-spacing': {
    id: 'spacing',
    displayName: 'Atlassian Spacing',
    palette: 'spacingScale',
    attributes: {
      type: 'spacing'
    }
  },
  'atlassian-typography': {
    id: 'typography',
    displayName: 'Atlassian Typography',
    palette: 'typographyPalette',
    attributes: {
      type: 'typography'
    }
  },
  'atlassian-shape': {
    id: 'shape',
    displayName: 'Shape',
    palette: 'shapePalette',
    attributes: {
      type: 'shape'
    }
  },
  'atlassian-motion': {
    id: 'motion',
    displayName: 'Motion',
    palette: 'motionPalette',
    attributes: {
      type: 'motion'
    }
  }
};

/**
 * Represents theme state once mounted to the page
 * (the page doesn't have an "auto" color mode, it's either light or dark)
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
var _default = exports.default = themeConfig;