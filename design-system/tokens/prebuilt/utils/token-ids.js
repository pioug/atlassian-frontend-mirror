"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokenId = exports.getFullyQualifiedTokenId = exports.getCSSCustomProperty = void 0;
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

/**
 * Transforms a style dictionary token path to a shorthand token id
 * These ids will be typically be how tokens are interacted with via typescript and css
 *
 * All [default] key words will be omitted from the path
 *
 * @example <caption>Passing a path as an array</caption>
 * // Returns color.background.bold
 * getTokenId(['color', 'background', 'bold', '[default]'])
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns color.background.bold
 * getTokenId('color.background.bold.[default]')
 */
var getTokenId = exports.getTokenId = function getTokenId(path) {
  var normalizedPath = typeof path === 'string' ? path.split('.') : path;
  return normalizedPath.filter(function (el) {
    return el !== '[default]';
  }).join('.');
};

/**
 * Transforms a style dictionary token path to a fully qualified token id
 * These Ids are intended to be used internal to this package by style-dictionary
 *
 * [default] key words will NOT be omitted from the path
 *
 * @example <caption>Passing a path as a string</caption>
 * // Returns color.background.bold.[default]
 * getFullyQualifiedTokenId(['color', 'background', 'bold', '[default]'])
 */
var getFullyQualifiedTokenId = exports.getFullyQualifiedTokenId = function getFullyQualifiedTokenId(path) {
  return path.join('.');
};