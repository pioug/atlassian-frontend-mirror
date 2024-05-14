"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeStringToObject = exports.themeObjectToString = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _themeConfig = require("./theme-config");
var themeKinds = ['light', 'dark', 'spacing', 'typography', 'shape'];
var customThemeOptions = 'UNSAFE_themeOptions';
var isThemeKind = function isThemeKind(themeKind) {
  return themeKinds.find(function (kind) {
    return kind === themeKind;
  }) !== undefined;
};
var isThemeIds = function isThemeIds(themeId) {
  return _themeConfig.themeIds.find(function (id) {
    return id === themeId;
  }) !== undefined;
};
var isColorMode = function isColorMode(modeId) {
  return ['light', 'dark', 'auto'].includes(modeId);
};
/**
 * Converts a string that is formatted for the `data-theme` HTML attribute
 * to an object that can be passed to `setGlobalTheme`.
 *
 * @param {string} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeStringToObject('dark:dark light:legacy-light spacing:spacing');
 * // returns { dark: 'dark', light: 'legacy-light', spacing: 'spacing' }
 * ```
 */
var themeStringToObject = exports.themeStringToObject = function themeStringToObject(themeState) {
  return themeState.split(' ').map(function (theme) {
    return theme.split(/:([\s\S]*)/);
  }).reduce(function (themeObject, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      kind = _ref2[0],
      id = _ref2[1];
    if (kind === 'colorMode' && isColorMode(id)) {
      themeObject[kind] = id;
    }
    if (isThemeKind(kind) && isThemeIds(id)) {
      // @ts-expect-error FIXME - this is a valid ts error
      themeObject[kind] = id;
    }
    if (kind === customThemeOptions) {
      try {
        themeObject[customThemeOptions] = JSON.parse(id);
      } catch (e) {
        new Error('Invalid custom theme string');
      }
    }
    return themeObject;
  }, {});
};

/**
 * Converts a theme object to a string formatted for the `data-theme` HTML attribute.
 *
 * @param {object} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeObjectToString({ dark: 'dark', light: 'legacy-light', spacing: 'spacing' });
 * // returns 'dark:dark light:legacy-light spacing:spacing'
 * ```
 */
var themeObjectToString = exports.themeObjectToString = function themeObjectToString(themeState) {
  return Object.entries(themeState).reduce(function (themeString, _ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
      kind = _ref4[0],
      id = _ref4[1];
    if (
    // colorMode theme state
    kind === 'colorMode' && typeof id === 'string' && isColorMode(id) ||
    // custom theme state
    kind === customThemeOptions && (0, _typeof2.default)(id) === 'object' ||
    // other theme states
    isThemeKind(kind) && typeof id === 'string' && isThemeIds(id)) {
      return themeString + "".concat(themeString ? ' ' : '') + "".concat(kind, ":").concat((0, _typeof2.default)(id) === 'object' ? JSON.stringify(id) : id);
    }
    return themeString;
  }, '');
};