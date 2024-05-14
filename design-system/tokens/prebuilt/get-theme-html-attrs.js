"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _constants = require("./constants");
var _themeConfig = require("./theme-config");
var _themeStateTransformer = require("./theme-state-transformer");
var _colorUtils = require("./utils/color-utils");
var _hash = require("./utils/hash");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var defaultColorMode = 'light';
var defaultContrastMode = 'no-preference';

/**
 * Server-side rendering utility. Generates the valid HTML attributes for a given theme.
 * Note: this utility does not handle automatic theme switching.
 *
 * @param {Object<string, string>} themeOptions - Theme options object
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @returns {Object} Object of HTML attributes to be applied to the document root
 */
var getThemeHtmlAttrs = function getThemeHtmlAttrs() {
  var _result;
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$colorMode = _ref.colorMode,
    colorMode = _ref$colorMode === void 0 ? _themeConfig.themeStateDefaults['colorMode'] : _ref$colorMode,
    _ref$dark = _ref.dark,
    dark = _ref$dark === void 0 ? _themeConfig.themeStateDefaults['dark'] : _ref$dark,
    _ref$light = _ref.light,
    light = _ref$light === void 0 ? _themeConfig.themeStateDefaults['light'] : _ref$light,
    _ref$contrastMode = _ref.contrastMode,
    contrastMode = _ref$contrastMode === void 0 ? _themeConfig.themeStateDefaults['contrastMode'] : _ref$contrastMode,
    _ref$shape = _ref.shape,
    shape = _ref$shape === void 0 ? _themeConfig.themeStateDefaults['shape'] : _ref$shape,
    _ref$spacing = _ref.spacing,
    spacing = _ref$spacing === void 0 ? _themeConfig.themeStateDefaults['spacing'] : _ref$spacing,
    _ref$typography = _ref.typography,
    typography = _ref$typography === void 0 ? _themeConfig.themeStateDefaults['typography'] : _ref$typography,
    _ref$UNSAFE_themeOpti = _ref.UNSAFE_themeOptions,
    UNSAFE_themeOptions = _ref$UNSAFE_themeOpti === void 0 ? _themeConfig.themeStateDefaults['UNSAFE_themeOptions'] : _ref$UNSAFE_themeOpti;
  var themeAttribute = (0, _themeStateTransformer.themeObjectToString)({
    dark: dark,
    light: light,
    shape: shape,
    spacing: spacing,
    typography: typography
  });
  var result = (_result = {}, (0, _defineProperty2.default)(_result, _constants.THEME_DATA_ATTRIBUTE, themeAttribute), (0, _defineProperty2.default)(_result, _constants.COLOR_MODE_ATTRIBUTE, colorMode === 'auto' ? defaultColorMode : colorMode), _result);
  if ((0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.increased-contrast-themes')) {
    result = _objectSpread(_objectSpread({}, result), {}, (0, _defineProperty2.default)({}, _constants.CONTRAST_MODE_ATTRIBUTE, contrastMode === 'auto' ? defaultContrastMode : contrastMode));
  }
  if (UNSAFE_themeOptions && (0, _colorUtils.isValidBrandHex)(UNSAFE_themeOptions.brandColor)) {
    var optionString = JSON.stringify(UNSAFE_themeOptions);
    var uniqueId = (0, _hash.hash)(optionString);
    result[_constants.CUSTOM_THEME_ATTRIBUTE] = uniqueId;
  }
  return result;
};
var _default = exports.default = getThemeHtmlAttrs;