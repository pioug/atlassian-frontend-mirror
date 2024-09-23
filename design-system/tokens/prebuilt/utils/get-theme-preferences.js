"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemePreferences = exports.getThemeOverridePreferences = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _getIncreasedContrastTheme = _interopRequireDefault(require("./get-increased-contrast-theme"));
var getThemePreferences = exports.getThemePreferences = function getThemePreferences(themeState) {
  var colorMode = themeState.colorMode,
    contrastMode = themeState.contrastMode,
    dark = themeState.dark,
    light = themeState.light,
    shape = themeState.shape,
    spacing = themeState.spacing,
    typography = themeState.typography;
  var autoColorModeThemes = [light, dark];
  var themePreferences = [];
  if (colorMode === 'auto') {
    if (contrastMode !== 'no-preference' && (0, _platformFeatureFlags.fg)('platform_increased-contrast-themes')) {
      autoColorModeThemes.forEach(function (normalTheme) {
        var increasedContrastTheme = (0, _getIncreasedContrastTheme.default)(normalTheme);
        if (increasedContrastTheme) {
          autoColorModeThemes.push(increasedContrastTheme);
        }
      });
    }
    themePreferences.push.apply(themePreferences, autoColorModeThemes);
  } else {
    themePreferences.push(themeState[colorMode]);
    if (contrastMode !== 'no-preference' && (0, _platformFeatureFlags.fg)('platform_increased-contrast-themes')) {
      var increasedContrastTheme = (0, _getIncreasedContrastTheme.default)(themeState[colorMode]);
      if (increasedContrastTheme) {
        themePreferences.push(increasedContrastTheme);
      }
    }
  }
  [shape, spacing, typography].forEach(function (themeId) {
    if (themeId) {
      themePreferences.push(themeId);
    }
  });
  return (0, _toConsumableArray2.default)(new Set(themePreferences));
};
var getThemeOverridePreferences = exports.getThemeOverridePreferences = function getThemeOverridePreferences(_themeState) {
  var themeOverridePreferences = [];
  return (0, _toConsumableArray2.default)(new Set(themeOverridePreferences));
};