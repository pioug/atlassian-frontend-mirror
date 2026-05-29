"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeObjectToString = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _isColorMode = require("./is-color-mode");
var _isThemeIds = require("./is-theme-ids");
var _isThemeKind = require("./is-theme-kind");
var customThemeOptions = 'UNSAFE_themeOptions';

/**
 * Converts a theme object to a string formatted for the `data-theme` HTML attribute.
 *
 * @param {object} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeObjectToString({ dark: 'dark', light: 'light', spacing: 'spacing' });
 * // returns 'dark:dark light:light spacing:spacing'
 * ```
 */
var themeObjectToString = exports.themeObjectToString = function themeObjectToString(themeState) {
  return Object.entries(themeState).reduce(function (themeString, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      kind = _ref2[0],
      id = _ref2[1];
    if (
    // colorMode theme state
    kind === 'colorMode' && typeof id === 'string' && (0, _isColorMode.isColorMode)(id) ||
    // custom theme state
    kind === customThemeOptions && (0, _typeof2.default)(id) === 'object' ||
    // other theme states
    (0, _isThemeKind.isThemeKind)(kind) && typeof id === 'string' && (0, _isThemeIds.isThemeIds)(id)) {
      return themeString + "".concat(themeString ? ' ' : '') + "".concat(kind, ":").concat((0, _typeof2.default)(id) === 'object' ? JSON.stringify(id) : id);
    }
    return themeString;
  }, '');
};