"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _getGlobalTheme = _interopRequireDefault(require("./get-global-theme"));
var _themeConfig = require("./theme-config");
var _colorUtils = require("./utils/color-utils");
var _configurePage = _interopRequireDefault(require("./utils/configure-page"));
var _customThemeLoadingUtils = require("./utils/custom-theme-loading-utils");
var _getThemePreferences = require("./utils/get-theme-preferences");
var _themeLoading = require("./utils/theme-loading");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
    var nextThemeState,
      themeLoader,
      _ref2,
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
          nextThemeState = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
          themeLoader = _args3.length > 1 ? _args3[1] : undefined;
          _ref2 = typeof nextThemeState === 'function' ? nextThemeState(_objectSpread(_objectSpread({}, _themeConfig.themeStateDefaults), {}, {
            typography: _themeConfig.themeStateDefaults['typography']()
          }, (0, _getGlobalTheme.default)())) : nextThemeState, _ref2$colorMode = _ref2.colorMode, colorMode = _ref2$colorMode === void 0 ? _themeConfig.themeStateDefaults['colorMode'] : _ref2$colorMode, _ref2$contrastMode = _ref2.contrastMode, contrastMode = _ref2$contrastMode === void 0 ? _themeConfig.themeStateDefaults['contrastMode'] : _ref2$contrastMode, _ref2$dark = _ref2.dark, dark = _ref2$dark === void 0 ? _themeConfig.themeStateDefaults['dark'] : _ref2$dark, _ref2$light = _ref2.light, light = _ref2$light === void 0 ? _themeConfig.themeStateDefaults['light'] : _ref2$light, _ref2$shape = _ref2.shape, shape = _ref2$shape === void 0 ? _themeConfig.themeStateDefaults['shape'] : _ref2$shape, _ref2$spacing = _ref2.spacing, spacing = _ref2$spacing === void 0 ? _themeConfig.themeStateDefaults['spacing'] : _ref2$spacing, _ref2$typography = _ref2.typography, typography = _ref2$typography === void 0 ? _themeConfig.themeStateDefaults['typography']() : _ref2$typography, _ref2$UNSAFE_themeOpt = _ref2.UNSAFE_themeOptions, UNSAFE_themeOptions = _ref2$UNSAFE_themeOpt === void 0 ? _themeConfig.themeStateDefaults['UNSAFE_themeOptions'] : _ref2$UNSAFE_themeOpt; // CLEANUP: Remove. This blocks application of increased contrast themes
          // without the feature flag enabled.
          if (!(0, _platformFeatureFlags.fg)('platform_increased-contrast-themes')) {
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
          _context3.next = 11;
          return Promise.all(loadingTasks);
        case 11:
          // Load override themes after standard themes
          themeOverridePreferences = (0, _getThemePreferences.getThemeOverridePreferences)(themeState);
          _iterator = _createForOfIteratorHelper(themeOverridePreferences);
          _context3.prev = 13;
          _iterator.s();
        case 15:
          if ((_step = _iterator.n()).done) {
            _context3.next = 21;
            break;
          }
          themeId = _step.value;
          _context3.next = 19;
          return loadingStrategy(themeId);
        case 19:
          _context3.next = 15;
          break;
        case 21:
          _context3.next = 26;
          break;
        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](13);
          _iterator.e(_context3.t0);
        case 26:
          _context3.prev = 26;
          _iterator.f();
          return _context3.finish(26);
        case 29:
          autoUnbind = (0, _configurePage.default)(themeState);
          return _context3.abrupt("return", autoUnbind);
        case 31:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[13, 23, 26, 29]]);
  }));
  return function setGlobalTheme() {
    return _ref.apply(this, arguments);
  };
}();
var _default = exports.default = setGlobalTheme;