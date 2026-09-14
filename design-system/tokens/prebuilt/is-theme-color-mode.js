"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isThemeColorMode = void 0;
var _themeColorModes = require("./theme-color-modes");
var isThemeColorMode = exports.isThemeColorMode = function isThemeColorMode(colorMode) {
  return _themeColorModes.themeColorModes.find(function (mode) {
    return mode === colorMode;
  }) !== undefined;
};