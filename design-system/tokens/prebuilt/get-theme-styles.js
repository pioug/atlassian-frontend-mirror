"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _platformFeatureFlags = require("@atlaskit/platform-feature-flags");
var _themeConfig = require("./theme-config");
var _colorUtils = require("./utils/color-utils");
var _getThemePreferences = require("./utils/get-theme-preferences");
var _themeLoading = require("./utils/theme-loading");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Takes an object containing theme preferences, and returns an array of objects for use in applying styles to the document head.
 * Only supplies the color themes necessary for initial render, based on the current themeState. I.e. if in light mode, dark mode themes are not returned.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.shape The shape theme to be applied.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @returns A Promise of an object array, containing theme IDs, data-attributes to attach to the theme, and the theme CSS.
 * If an error is encountered while loading themes, the themes array will be empty.
 */
var getThemeStyles = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(preferences) {
    var themePreferences, themeOverridePreferences, themeState, results;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          themeOverridePreferences = [];
          if (preferences === 'all') {
            themePreferences = _themeConfig.themeIdsWithOverrides;

            // CLEANUP: Remove
            if (!(0, _platformFeatureFlags.getBooleanFF)('platform.design-system-team.increased-contrast-themes')) {
              themePreferences = themePreferences.filter(function (n) {
                return n !== 'light-increased-contrast' && n !== 'dark-increased-contrast';
              });
            }
          } else {
            themeState = {
              colorMode: (preferences === null || preferences === void 0 ? void 0 : preferences.colorMode) || _themeConfig.themeStateDefaults['colorMode'],
              contrastMode: (preferences === null || preferences === void 0 ? void 0 : preferences.contrastMode) || _themeConfig.themeStateDefaults['contrastMode'],
              dark: (preferences === null || preferences === void 0 ? void 0 : preferences.dark) || _themeConfig.themeStateDefaults['dark'],
              light: (preferences === null || preferences === void 0 ? void 0 : preferences.light) || _themeConfig.themeStateDefaults['light'],
              shape: (preferences === null || preferences === void 0 ? void 0 : preferences.shape) || _themeConfig.themeStateDefaults['shape'],
              spacing: (preferences === null || preferences === void 0 ? void 0 : preferences.spacing) || _themeConfig.themeStateDefaults['spacing'],
              typography: (preferences === null || preferences === void 0 ? void 0 : preferences.typography) || _themeConfig.themeStateDefaults['typography']
            };
            themePreferences = (0, _getThemePreferences.getThemePreferences)(themeState);
            themeOverridePreferences = (0, _getThemePreferences.getThemeOverridePreferences)(themeState);
          }
          _context3.next = 4;
          return Promise.all([].concat((0, _toConsumableArray2.default)([].concat((0, _toConsumableArray2.default)(themePreferences), (0, _toConsumableArray2.default)(themeOverridePreferences)).map( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(themeId) {
              var css;
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return (0, _themeLoading.loadThemeCss)(themeId);
                  case 3:
                    css = _context.sent;
                    return _context.abrupt("return", {
                      id: themeId,
                      attrs: {
                        'data-theme': themeId
                      },
                      css: css
                    });
                  case 7:
                    _context.prev = 7;
                    _context.t0 = _context["catch"](0);
                    return _context.abrupt("return", undefined);
                  case 10:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[0, 7]]);
            }));
            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }())), [
          // Add custom themes if they're present
          (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
            var _preferences$UNSAFE_t;
            var _yield$import, getCustomThemeStyles, customThemeStyles;
            return _regenerator.default.wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(preferences !== 'all' && preferences !== null && preferences !== void 0 && preferences.UNSAFE_themeOptions && (0, _colorUtils.isValidBrandHex)(preferences === null || preferences === void 0 || (_preferences$UNSAFE_t = preferences.UNSAFE_themeOptions) === null || _preferences$UNSAFE_t === void 0 ? void 0 : _preferences$UNSAFE_t.brandColor))) {
                    _context2.next = 15;
                    break;
                  }
                  _context2.prev = 1;
                  _context2.next = 4;
                  return Promise.resolve().then(function () {
                    return _interopRequireWildcard(require( /* webpackChunkName: "@atlaskit-internal_atlassian-custom-theme" */
                    './custom-theme'));
                  });
                case 4:
                  _yield$import = _context2.sent;
                  getCustomThemeStyles = _yield$import.getCustomThemeStyles;
                  _context2.next = 8;
                  return getCustomThemeStyles({
                    colorMode: (preferences === null || preferences === void 0 ? void 0 : preferences.colorMode) || _themeConfig.themeStateDefaults['colorMode'],
                    UNSAFE_themeOptions: preferences === null || preferences === void 0 ? void 0 : preferences.UNSAFE_themeOptions
                  });
                case 8:
                  customThemeStyles = _context2.sent;
                  return _context2.abrupt("return", customThemeStyles);
                case 12:
                  _context2.prev = 12;
                  _context2.t0 = _context2["catch"](1);
                  return _context2.abrupt("return", undefined);
                case 15:
                case "end":
                  return _context2.stop();
              }
            }, _callee2, null, [[1, 12]]);
          }))()]));
        case 4:
          results = _context3.sent;
          return _context3.abrupt("return", results.flat().filter(function (theme) {
            return theme !== undefined;
          }));
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getThemeStyles(_x) {
    return _ref.apply(this, arguments);
  };
}();
var _default = exports.default = getThemeStyles;