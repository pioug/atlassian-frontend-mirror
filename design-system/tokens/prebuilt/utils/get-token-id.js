"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokenId = void 0;
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