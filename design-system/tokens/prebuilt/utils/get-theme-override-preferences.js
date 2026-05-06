"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeOverridePreferences = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var getThemeOverridePreferences = exports.getThemeOverridePreferences = function getThemeOverridePreferences(_themeState) {
  var themeOverridePreferences = [];
  return (0, _toConsumableArray2.default)(new Set(themeOverridePreferences));
};