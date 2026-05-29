"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isThemeKind = void 0;
var themeKinds = ['light', 'dark', 'spacing', 'typography', 'shape', 'motion'];
var isThemeKind = exports.isThemeKind = function isThemeKind(themeKind) {
  return themeKinds.find(function (kind) {
    return kind === themeKind;
  }) !== undefined;
};