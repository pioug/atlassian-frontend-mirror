"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidHex = void 0;
// valid hex color with 4, 6 or 8 digits
var isValidHex = exports.isValidHex = function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
};