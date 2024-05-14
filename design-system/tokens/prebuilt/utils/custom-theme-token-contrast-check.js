"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.additionalContrastChecker = exports.additionalChecks = void 0;
var _atlassianDarkTokenValueForContrastCheck = _interopRequireDefault(require("../artifacts/atlassian-dark-token-value-for-contrast-check"));
var _atlassianLightTokenValueForContrastCheck = _interopRequireDefault(require("../artifacts/atlassian-light-token-value-for-contrast-check"));
var _colorUtils = require("./color-utils");
var additionalChecks = exports.additionalChecks = [{
  foreground: 'color.text.brand',
  backgroundLight: 'elevation.surface.sunken',
  backgroundDark: 'elevation.surface.overlay',
  desiredContrast: 4.5,
  updatedTokens: [
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base token
  'color.text.brand', 'color.text.selected', 'color.link', 'color.link.pressed', 'color.icon.brand', 'color.icon.selected']
}, {
  foreground: 'color.text.brand',
  backgroundLight: 'color.background.selected',
  backgroundDark: 'color.background.selected',
  desiredContrast: 4.5,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base toke
  updatedTokens: ['color.text.brand', 'color.link', 'color.link.pressed']
}, {
  foreground: 'color.text.selected',
  backgroundLight: 'color.background.selected',
  backgroundDark: 'color.background.selected',
  desiredContrast: 4.5,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base token
  updatedTokens: ['color.text.selected', 'color.icon.selected']
}, {
  foreground: 'color.border.brand',
  backgroundLight: 'elevation.surface.sunken',
  backgroundDark: 'elevation.surface.overlay',
  desiredContrast: 3,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base toke
  updatedTokens: ['color.border.brand', 'color.border.selected']
}, {
  foreground: 'color.chart.brand',
  backgroundLight: 'elevation.surface.sunken',
  backgroundDark: 'elevation.surface.overlay',
  desiredContrast: 3,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base token
  updatedTokens: ['color.chart.brand', 'color.chart.brand.hovered']
}];
var getColorFromTokenRaw = function getColorFromTokenRaw(tokenName, mode) {
  return mode === 'light' ? _atlassianLightTokenValueForContrastCheck.default[tokenName] : _atlassianDarkTokenValueForContrastCheck.default[tokenName];
};
var additionalContrastChecker = exports.additionalContrastChecker = function additionalContrastChecker(_ref) {
  var customThemeTokenMap = _ref.customThemeTokenMap,
    mode = _ref.mode,
    themeRamp = _ref.themeRamp;
  var updatedCustomThemeTokenMap = {};
  var brandTokens = Object.keys(customThemeTokenMap);
  additionalChecks.forEach(function (pairing) {
    var backgroundLight = pairing.backgroundLight,
      backgroundDark = pairing.backgroundDark,
      foreground = pairing.foreground,
      desiredContrast = pairing.desiredContrast,
      updatedTokens = pairing.updatedTokens;
    var background = mode === 'light' ? backgroundLight : backgroundDark;
    var foregroundTokenValue = customThemeTokenMap[foreground];
    var backgroundTokenValue = customThemeTokenMap[background];
    var foregroundColor = brandTokens.includes(foreground) ? typeof foregroundTokenValue === 'string' ? foregroundTokenValue : themeRamp[foregroundTokenValue] : getColorFromTokenRaw(foreground, mode);
    var backgroundColor = brandTokens.includes(background) ? typeof backgroundTokenValue === 'string' ? backgroundTokenValue : themeRamp[backgroundTokenValue] : getColorFromTokenRaw(background, mode);
    var contrast = (0, _colorUtils.getContrastRatio)(foregroundColor, backgroundColor);
    if (contrast <= desiredContrast) {
      updatedTokens.forEach(function (token) {
        var rampValue = customThemeTokenMap[token];
        if (typeof rampValue === 'number') {
          updatedCustomThemeTokenMap[token] = mode === 'light' ? rampValue + 1 : rampValue - 1;
        }
      });
    }
  });
  return updatedCustomThemeTokenMap;
};