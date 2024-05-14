"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configurePage;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _getThemeHtmlAttrs = _interopRequireDefault(require("../get-theme-html-attrs"));
var _colorModeListeners = _interopRequireDefault(require("./color-mode-listeners"));
var _contrastModeListeners = _interopRequireDefault(require("./contrast-mode-listeners"));
/**
 * Given ThemeState, sets appropriate html attributes on the documentElement,
 * adds a listener to keep colorMode updated, and returns a function to unbind.
 */
function configurePage(themeState) {
  if (themeState.colorMode === 'auto') {
    // Set colorMode based on the user preference
    themeState.colorMode = _colorModeListeners.default.getColorMode();
    // Bind a listener (if one doesn't already exist) to keep colorMode updated
    _colorModeListeners.default.bind();
  } else {
    _colorModeListeners.default.unbind();
  }
  if ((0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.increased-contrast-themes')) {
    if (themeState.contrastMode === 'auto') {
      // Set contrastMode based on the user preference
      themeState.contrastMode = _contrastModeListeners.default.getContrastMode();
      // Bind a listener (if one doesn't already exist) to keep contrastMode updated
      _contrastModeListeners.default.bind();
    } else {
      _contrastModeListeners.default.unbind();
    }
  }
  var themeAttributes = (0, _getThemeHtmlAttrs.default)(themeState);
  Object.entries(themeAttributes).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    document.documentElement.setAttribute(key, value);
  });
  return function () {
    _colorModeListeners.default.unbind();
    if ((0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.increased-contrast-themes')) {
      _contrastModeListeners.default.unbind();
    }
  };
}