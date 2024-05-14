"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _constants = require("./constants");
var _themeLoading = require("./utils/theme-loading");
/**
 * Provides a script that, when executed before paint, sets the `data-color-mode` attribute based on the current system theme,
 * to enable SSR support for automatic theme switching, avoid a flash of un-themed content on first paint.
 *
 * @param {string} colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 *
 * @returns {string} A string to be added to the innerHTML of a script tag in the document head
 */
var getSSRAutoScript = function getSSRAutoScript(colorMode, contrastMode) {
  if (colorMode !== 'auto' && contrastMode !== 'auto') {
    return undefined;
  }
  var setColorMode = colorMode === 'auto' ? "\n  try {\n    const darkModeMql = window.matchMedia('".concat(_themeLoading.darkModeMediaQuery, "');\n    const colorMode = darkModeMql.matches ? 'dark' : 'light';\n    document.documentElement.setAttribute('").concat(_constants.COLOR_MODE_ATTRIBUTE, "', colorMode);\n  } catch (e) {}") : '';
  var setContrastMode = (0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.increased-contrast-themes') && contrastMode === 'auto' ? "\n  try {\n    const contrastModeMql = window.matchMedia('".concat(_themeLoading.moreContrastMediaQuery, "');\n    const contrastMode = contrastModeMql.matches ? 'more' : 'no-preference';\n    document.documentElement.setAttribute('").concat(_constants.CONTRAST_MODE_ATTRIBUTE, "', contrastMode);\n  } catch (e) {}") : '';
  return "(() => {".concat(setColorMode).concat(setContrastMode, "})()");
};
var _default = exports.default = getSSRAutoScript;