"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isThemeIds = void 0;
var _themeIds = require("./theme-ids");
var isThemeIds = exports.isThemeIds = function isThemeIds(themeId) {
  return _themeIds.themeIds.find(function (id) {
    return id === themeId;
  }) !== undefined;
};