"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCSSCustomProperty = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _constants = require("../constants");
/**
 * Transforms a style dictionary token path to a CSS custom property.
 *
 * A css prefix will be prepended and all [default] key words will be omitted
 * from the path
 *
 * @example <caption>Passing a path as an array</caption>
 * // Returns ds-background-bold
 * getCSSCustomProperty(['color', 'background', 'bold', '[default]'])
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns ds-background-bold
 * getCSSCustomProperty('color.background.bold.[default]')
 */
var getCSSCustomProperty = exports.getCSSCustomProperty = function getCSSCustomProperty(path) {
  var normalizedPath = typeof path === 'string' ? path.split('.') : path;

  // Opacity and other 'shallow' groups are more readable when not trimmed
  var slice = _constants.CSS_VAR_FULL.includes(normalizedPath[0]) ? 0 : 1;
  return "--".concat([_constants.CSS_PREFIX].concat((0, _toConsumableArray2.default)(normalizedPath.slice(slice))).filter(function (el) {
    return el !== '[default]';
  }).join('-'));
};