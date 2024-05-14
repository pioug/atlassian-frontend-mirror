"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = void 0;
exports.getCustomThemeStyles = getCustomThemeStyles;
exports.loadAndAppendCustomThemeCss = loadAndAppendCustomThemeCss;
var _constants = require("./constants");
var _themeConfig = require("./theme-config");
var _customThemeLoadingUtils = require("./utils/custom-theme-loading-utils");
var _generateCustomColorRamp = require("./utils/generate-custom-color-ramp");
var _hash = require("./utils/hash");
var CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = exports.CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = 10;

/**
 *
 * @param themeSchema The schema of available themes
 * @returns a string with the CSS for the custom theme
 */
/**
 * Takes a color mode and custom branding options, and returns an array of objects for use in applying custom styles to the document head.
 * Only supplies the color themes necessary for initial render, based on the current themeState. I.e. if in light mode, dark mode themes are not returned.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @returns An object array, containing theme IDs, data-attributes to attach to the theme, and the theme CSS.
 * If an error is encountered while loading themes, the themes array will be empty.
 */
function getCustomThemeStyles(themeState) {
  var _themeState$UNSAFE_th;
  var brandColor = themeState === null || themeState === void 0 || (_themeState$UNSAFE_th = themeState.UNSAFE_themeOptions) === null || _themeState$UNSAFE_th === void 0 ? void 0 : _themeState$UNSAFE_th.brandColor;
  var mode = (themeState === null || themeState === void 0 ? void 0 : themeState.colorMode) || _themeConfig.themeStateDefaults['colorMode'];
  var optionString = JSON.stringify(themeState === null || themeState === void 0 ? void 0 : themeState.UNSAFE_themeOptions);
  var uniqueId = (0, _hash.hash)(optionString);
  var themeRamp = (0, _generateCustomColorRamp.generateColors)(brandColor).ramp;

  // outputs object to generate to CSS from
  var themes = [];
  var tokenMaps = (0, _generateCustomColorRamp.generateTokenMapWithContrastCheck)(brandColor, mode, themeRamp);
  if ((mode === 'light' || mode === 'auto') && tokenMaps.light) {
    // Light mode theming
    themes.push({
      id: 'light',
      attrs: {
        'data-theme': 'light',
        'data-custom-theme': uniqueId
      },
      css: "\nhtml[".concat(_constants.CUSTOM_THEME_ATTRIBUTE, "=\"").concat(uniqueId, "\"][").concat(_constants.COLOR_MODE_ATTRIBUTE, "=\"light\"][data-theme~=\"light:light\"] {\n  /* Branded tokens */\n    ").concat((0, _customThemeLoadingUtils.reduceTokenMap)(tokenMaps.light, themeRamp), "\n}")
    });
  }
  if ((mode === 'dark' || mode === 'auto') && tokenMaps.dark) {
    // Dark mode theming
    themes.push({
      id: 'dark',
      attrs: {
        'data-theme': 'dark',
        'data-custom-theme': uniqueId
      },
      css: "\nhtml[".concat(_constants.CUSTOM_THEME_ATTRIBUTE, "=\"").concat(uniqueId, "\"][").concat(_constants.COLOR_MODE_ATTRIBUTE, "=\"dark\"][data-theme~=\"dark:dark\"] {\n  /* Branded tokens */\n    ").concat((0, _customThemeLoadingUtils.reduceTokenMap)(tokenMaps.dark, themeRamp), "\n}")
    });
  }
  return themes;
}
function loadAndAppendCustomThemeCss(themeState) {
  var themes = getCustomThemeStyles(themeState);
  (0, _customThemeLoadingUtils.limitSizeOfCustomStyleElements)(CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD);
  themes.map(function (theme) {
    var styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
    styleTag.dataset.theme = theme.attrs['data-theme'];
    styleTag.dataset.customTheme = theme.attrs['data-custom-theme'];
    styleTag.textContent = theme.css;
  });
}