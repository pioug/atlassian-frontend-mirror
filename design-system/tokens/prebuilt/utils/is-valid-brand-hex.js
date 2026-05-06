"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidBrandHex = void 0;
var isValidBrandHex = exports.isValidBrandHex = function isValidBrandHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
};