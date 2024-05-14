"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _themeConfig = require("./theme-config");
var _configurePage = _interopRequireDefault(require("./utils/configure-page"));
var _getThemePreferences = require("./utils/get-theme-preferences");
/**
 * Synchronously sets the theme globally at runtime. Themes are not loaded;
 * use `getThemeStyles` and other server-side utilities to generate and load them.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.shape The shape theme to be applied.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 * @param {function} themeLoader Callback function used to override the default theme loading functionality.
 *
 * @returns An unbind function, that can be used to stop listening for changes to system theme.
 *
 * @example
 * ```
 * enableGlobalTheme({colorMode: 'auto', light: 'light', dark: 'dark', spacing: 'spacing'});
 * ```
 */
var enableGlobalTheme = function enableGlobalTheme() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$colorMode = _ref.colorMode,
    colorMode = _ref$colorMode === void 0 ? _themeConfig.themeStateDefaults['colorMode'] : _ref$colorMode,
    _ref$contrastMode = _ref.contrastMode,
    contrastMode = _ref$contrastMode === void 0 ? _themeConfig.themeStateDefaults['contrastMode'] : _ref$contrastMode,
    _ref$dark = _ref.dark,
    dark = _ref$dark === void 0 ? _themeConfig.themeStateDefaults['dark'] : _ref$dark,
    _ref$light = _ref.light,
    light = _ref$light === void 0 ? _themeConfig.themeStateDefaults['light'] : _ref$light,
    _ref$shape = _ref.shape,
    shape = _ref$shape === void 0 ? _themeConfig.themeStateDefaults['shape'] : _ref$shape,
    _ref$spacing = _ref.spacing,
    spacing = _ref$spacing === void 0 ? _themeConfig.themeStateDefaults['spacing'] : _ref$spacing,
    _ref$typography = _ref.typography,
    typography = _ref$typography === void 0 ? _themeConfig.themeStateDefaults['typography'] : _ref$typography,
    _ref$UNSAFE_themeOpti = _ref.UNSAFE_themeOptions,
    UNSAFE_themeOptions = _ref$UNSAFE_themeOpti === void 0 ? _themeConfig.themeStateDefaults['UNSAFE_themeOptions'] : _ref$UNSAFE_themeOpti;
  var themeLoader = arguments.length > 1 ? arguments[1] : undefined;
  var themeState = {
    colorMode: colorMode,
    contrastMode: contrastMode,
    dark: dark,
    light: light,
    shape: shape,
    spacing: spacing,
    typography: typography,
    UNSAFE_themeOptions: themeLoader ? undefined : UNSAFE_themeOptions
  };

  // Determine what to load and call theme loader
  var themePreferences = (0, _getThemePreferences.getThemePreferences)(themeState);
  if (themeLoader) {
    themePreferences.map(function (themeId) {
      return themeLoader(themeId);
    });
  }
  var autoUnbind = (0, _configurePage.default)(themeState);
  return autoUnbind;
};
var _default = exports.default = enableGlobalTheme;