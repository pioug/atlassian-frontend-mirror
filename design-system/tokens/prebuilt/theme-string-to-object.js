"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeStringToObject = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _isColorMode = require("./is-color-mode");
var _isThemeIds = require("./is-theme-ids");
var _isThemeKind = require("./is-theme-kind");
var customThemeOptions = 'UNSAFE_themeOptions';

/**
 * Converts a string that is formatted for the `data-theme` HTML attribute
 * to an object that can be passed to `setGlobalTheme`.
 *
 * @param {string} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeStringToObject('dark:dark light:light spacing:spacing');
 * // returns { dark: 'dark', light: 'light', spacing: 'spacing' }
 * ```
 */
var themeStringToObject = exports.themeStringToObject = function themeStringToObject(themeState) {
  return themeState.split(' ')
  // @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
  .map(function (theme) {
    return theme.split(/:([^]*)/);
  }).reduce(function (themeObject, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      kind = _ref2[0],
      id = _ref2[1];
    if (kind === 'colorMode' && (0, _isColorMode.isColorMode)(id)) {
      themeObject[kind] = id;
    }
    if ((0, _isThemeKind.isThemeKind)(kind) && (0, _isThemeIds.isThemeIds)(id)) {
      // @ts-expect-error FIXME - this is a valid ts error
      themeObject[kind] = id;
    }
    if (kind === customThemeOptions) {
      try {
        themeObject[customThemeOptions] = JSON.parse(id);
      } catch (_unused) {
        new Error('Invalid custom theme string');
      }
    }
    return themeObject;
  }, {});
};