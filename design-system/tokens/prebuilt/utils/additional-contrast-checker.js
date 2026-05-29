"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.additionalContrastChecker = void 0;
var _atlassianDarkTokenValueForContrastCheck = _interopRequireDefault(require("../artifacts/atlassian-dark-token-value-for-contrast-check"));
var _atlassianLightTokenValueForContrastCheck = _interopRequireDefault(require("../artifacts/atlassian-light-token-value-for-contrast-check"));
var _customThemeTokenContrastCheck = require("./custom-theme-token-contrast-check");
var _getContrastRatio = require("./get-contrast-ratio");
var getColorFromTokenRaw = function getColorFromTokenRaw(tokenName, mode) {
  return mode === 'light' ? _atlassianLightTokenValueForContrastCheck.default[tokenName] : _atlassianDarkTokenValueForContrastCheck.default[tokenName];
};
var additionalContrastChecker = exports.additionalContrastChecker = function additionalContrastChecker(_ref) {
  var customThemeTokenMap = _ref.customThemeTokenMap,
    mode = _ref.mode,
    themeRamp = _ref.themeRamp;
  var updatedCustomThemeTokenMap = {};
  var brandTokens = Object.keys(customThemeTokenMap);
  _customThemeTokenContrastCheck.additionalChecks.forEach(function (pairing) {
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
    var contrast = (0, _getContrastRatio.getContrastRatio)(foregroundColor, backgroundColor);
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