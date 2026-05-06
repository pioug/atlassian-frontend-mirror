"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullyQualifiedTokenId = void 0;
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