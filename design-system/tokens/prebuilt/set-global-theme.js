"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _themeConfig = require("./theme-config");
var _colorUtils = require("./utils/color-utils");
var _configurePage = _interopRequireDefault(require("./utils/configure-page"));
var _customThemeLoadingUtils = require("./utils/custom-theme-loading-utils");
var _getThemePreferences = require("./utils/get-theme-preferences");
var _themeLoading = require("./utils/theme-loading");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Sets the theme globally at runtime. This updates the `data-theme` and `data-color-mode` attributes on your page's <html> tag.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.contrastMode The contrast mode theme to be applied. If set to `auto`, the theme applied will be determined by the OS setting.set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.shape The shape theme to be applied.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 * @param {function} themeLoader Callback function used to override the default theme loading functionality.
 *
 * @returns A Promise of an unbind function, that can be used to stop listening for changes to system theme.
 *
 * @example
 * ```
 * setGlobalTheme({colorMode: 'auto', light: 'light', dark: 'dark', spacing: 'spacing'});
 * ```
 */
var setGlobalTheme = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
    var _ref2,
      _ref2$colorMode,
      colorMode,
      _ref2$contrastMode,
      contrastMode,
      _ref2$dark,
      dark,
      _ref2$light,
      light,
      _ref2$shape,
      shape,
      _ref2$spacing,
      spacing,
      _ref2$typography,
      typography,
      _ref2$UNSAFE_themeOpt,
      UNSAFE_themeOptions,
      themeLoader,
      themeState,
      themePreferences,
      loadingStrategy,
      loadingTasks,
      mode,
      attrOfMissingCustomStyles,
      themeOverridePreferences,
      _iterator,
      _step,
      themeId,
      autoUnbind,
      _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _ref2 = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref2$colorMode = _ref2.colorMode, colorMode = _ref2$colorMode === void 0 ? _themeConfig.themeStateDefaults['colorMode'] : _ref2$colorMode, _ref2$contrastMode = _ref2.contrastMode, contrastMode = _ref2$contrastMode === void 0 ? _themeConfig.themeStateDefaults['contrastMode'] : _ref2$contrastMode, _ref2$dark = _ref2.dark, dark = _ref2$dark === void 0 ? _themeConfig.themeStateDefaults['dark'] : _ref2$dark, _ref2$light = _ref2.light, light = _ref2$light === void 0 ? _themeConfig.themeStateDefaults['light'] : _ref2$light, _ref2$shape = _ref2.shape, shape = _ref2$shape === void 0 ? _themeConfig.themeStateDefaults['shape'] : _ref2$shape, _ref2$spacing = _ref2.spacing, spacing = _ref2$spacing === void 0 ? _themeConfig.themeStateDefaults['spacing'] : _ref2$spacing, _ref2$typography = _ref2.typography, typography = _ref2$typography === void 0 ? _themeConfig.themeStateDefaults['typography'] : _ref2$typography, _ref2$UNSAFE_themeOpt = _ref2.UNSAFE_themeOptions, UNSAFE_themeOptions = _ref2$UNSAFE_themeOpt === void 0 ? _themeConfig.themeStateDefaults['UNSAFE_themeOptions'] : _ref2$UNSAFE_themeOpt;
          themeLoader = _args3.length > 1 ? _args3[1] : undefined;
          // CLEANUP: Remove. This blocks application of increased contrast themes
          // without the feature flag enabled.
          if (!(0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.increased-contrast-themes')) {
            if (light === 'light-increased-contrast') {
              light = 'light';
            }
            if (dark === 'dark-increased-contrast') {
              dark = 'dark';
            }
          }
          themeState = {
            colorMode: colorMode,
            contrastMode: contrastMode,
            dark: dark,
            light: light,
            shape: shape,
            spacing: spacing,
            typography: typography,
            UNSAFE_themeOptions: themeLoader ? undefined : UNSAFE_themeOptions
          }; // Determine what to load and loading strategy
          themePreferences = (0, _getThemePreferences.getThemePreferences)(themeState);
          loadingStrategy = themeLoader ? themeLoader : _themeLoading.loadAndAppendThemeCss; // Load standard themes
          loadingTasks = themePreferences.map( /*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(themeId) {
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return loadingStrategy(themeId);
                  case 2:
                    return _context.abrupt("return", _context.sent);
                  case 3:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x) {
              return _ref3.apply(this, arguments);
            };
          }()); // Load custom themes if needed
          if (!themeLoader && UNSAFE_themeOptions && (0, _colorUtils.isValidBrandHex)(UNSAFE_themeOptions === null || UNSAFE_themeOptions === void 0 ? void 0 : UNSAFE_themeOptions.brandColor)) {
            mode = colorMode || _themeConfig.themeStateDefaults['colorMode'];
            attrOfMissingCustomStyles = (0, _customThemeLoadingUtils.findMissingCustomStyleElements)(UNSAFE_themeOptions, mode);
            if (attrOfMissingCustomStyles.length > 0) {
              // Load custom theme styles
              loadingTasks.push((0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
                var _yield$import, loadAndAppendCustomThemeCss;
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return Promise.resolve().then(function () {
                        return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-custom-theme" */
                        './custom-theme'));
                      });
                    case 2:
                      _yield$import = _context2.sent;
                      loadAndAppendCustomThemeCss = _yield$import.loadAndAppendCustomThemeCss;
                      loadAndAppendCustomThemeCss({
                        colorMode: attrOfMissingCustomStyles.length === 2 ? 'auto' :
                        // only load the missing custom theme styles
                        attrOfMissingCustomStyles[0],
                        UNSAFE_themeOptions: UNSAFE_themeOptions
                      });
                    case 5:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }))());
            }
          }
          _context3.next = 10;
          return Promise.all(loadingTasks);
        case 10:
          // Load override themes after standard themes
          themeOverridePreferences = (0, _getThemePreferences.getThemeOverridePreferences)(themeState);
          _iterator = _createForOfIteratorHelper(themeOverridePreferences);
          _context3.prev = 12;
          _iterator.s();
        case 14:
          if ((_step = _iterator.n()).done) {
            _context3.next = 20;
            break;
          }
          themeId = _step.value;
          _context3.next = 18;
          return loadingStrategy(themeId);
        case 18:
          _context3.next = 14;
          break;
        case 20:
          _context3.next = 25;
          break;
        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](12);
          _iterator.e(_context3.t0);
        case 25:
          _context3.prev = 25;
          _iterator.f();
          return _context3.finish(25);
        case 28:
          autoUnbind = (0, _configurePage.default)(themeState);
          return _context3.abrupt("return", autoUnbind);
        case 30:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[12, 22, 25, 28]]);
  }));
  return function setGlobalTheme() {
    return _ref.apply(this, arguments);
  };
}();
var _default = exports.default = setGlobalTheme;