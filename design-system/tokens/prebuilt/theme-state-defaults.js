"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeStateDefaults = void 0;
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
/**
 * Can't evaluate typography feature flags at the module level,
 * it will always resolve to false when server side rendered or when flags are loaded async.
 */

function getShapeDefault() {
  if ((0, _platformFeatureFlags.fg)('platform-dst-shape-theme-default')) {
    return 'shape';
  }
  return undefined;
}
function getMotionDefault() {
  if ((0, _platformFeatureFlags.fg)('platform-dst-motion-theme-default')) {
    return 'motion';
  }
  return undefined;
}

/**
 * themeStateDefaults: the default values for ThemeState used by theming utilities
 */
var themeStateDefaults = exports.themeStateDefaults = {
  colorMode: 'auto',
  contrastMode: 'auto',
  dark: 'dark',
  light: 'light',
  shape: getShapeDefault,
  spacing: 'spacing',
  typography: 'typography',
  motion: getMotionDefault,
  UNSAFE_themeOptions: undefined
};