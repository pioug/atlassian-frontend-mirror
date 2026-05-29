"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isColorMode = void 0;
var isColorMode = exports.isColorMode = function isColorMode(modeId) {
  return ['light', 'dark', 'auto'].includes(modeId);
};