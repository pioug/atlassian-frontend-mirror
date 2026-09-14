"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeOverridePreferences = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _fg = require("@atlaskit/platform-feature-flags/fg");
var _getIncreasedContrastTheme = _interopRequireDefault(require("./get-increased-contrast-theme"));
var finesseOverrides = {
  light: 'light-finesse',
  'light-increased-contrast': 'light-increased-contrast-finesse',
  dark: 'dark-finesse',
  'dark-increased-contrast': 'dark-increased-contrast-finesse',
  typography: 'typography-finesse'
};
var getThemeOverridePreferences = exports.getThemeOverridePreferences = function getThemeOverridePreferences(themeState) {
  if (!(0, _fg.fg)('platform-dst-tokens-finesse')) {
    return [];
  }
  var colorMode = themeState.colorMode,
    contrastMode = themeState.contrastMode,
    dark = themeState.dark,
    light = themeState.light,
    typography = themeState.typography;
  var selectedThemes = [].concat((0, _toConsumableArray2.default)(colorMode === 'auto' ? [light, dark] : [themeState[colorMode]]), [typography]);
  if (contrastMode !== 'no-preference' && (0, _fg.fg)('platform_increased-contrast-themes')) {
    selectedThemes.forEach(function (themeId) {
      var increasedContrastTheme = (0, _getIncreasedContrastTheme.default)(themeId);
      if (increasedContrastTheme) {
        selectedThemes.push(increasedContrastTheme);
      }
    });
  }
  var themeOverridePreferences = selectedThemes.map(function (themeId) {
    return finesseOverrides[themeId];
  }).filter(function (themeId) {
    return themeId !== undefined;
  });
  return (0, _toConsumableArray2.default)(new Set(themeOverridePreferences));
};