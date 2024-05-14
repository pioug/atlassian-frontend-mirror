"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _customTheme = require("./custom-theme");
var _themeConfig = require("./theme-config");
var _colorUtils = require("./utils/color-utils");
var _customThemeLoadingUtils = require("./utils/custom-theme-loading-utils");
/**
 * Synchronously generates and applies custom theme styles to the page.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @example
 * ```
 * UNSAFE_loadCustomThemeStyles({
 *    colorMode: 'auto',
 *    UNSAFE_themeOptions: { brandColor: '#FF0000' }
 * });
 * ```
 */
var UNSAFE_loadCustomThemeStyles = function UNSAFE_loadCustomThemeStyles() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$colorMode = _ref.colorMode,
    colorMode = _ref$colorMode === void 0 ? _themeConfig.themeStateDefaults['colorMode'] : _ref$colorMode,
    _ref$UNSAFE_themeOpti = _ref.UNSAFE_themeOptions,
    UNSAFE_themeOptions = _ref$UNSAFE_themeOpti === void 0 ? _themeConfig.themeStateDefaults['UNSAFE_themeOptions'] : _ref$UNSAFE_themeOpti;
  // Load custom theme styles
  if (UNSAFE_themeOptions && (0, _colorUtils.isValidBrandHex)(UNSAFE_themeOptions === null || UNSAFE_themeOptions === void 0 ? void 0 : UNSAFE_themeOptions.brandColor)) {
    var attrOfMissingCustomStyles = (0, _customThemeLoadingUtils.findMissingCustomStyleElements)(UNSAFE_themeOptions, colorMode);
    if (attrOfMissingCustomStyles.length !== 0) {
      (0, _customTheme.loadAndAppendCustomThemeCss)({
        colorMode: attrOfMissingCustomStyles.length === 2 ? 'auto' :
        // only load the missing custom theme styles
        attrOfMissingCustomStyles[0],
        UNSAFE_themeOptions: UNSAFE_themeOptions
      });
    }
  }
};
var _default = exports.default = UNSAFE_loadCustomThemeStyles;