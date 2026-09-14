"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeIdsWithOverrides = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _themeIds = require("./theme-ids");
/**
 * Theme override ids: the equivalent of themeIds for theme overrides.
 * Theme overrides are temporary and there may not be any defined at times.
 */
var themeOverrideIds = [];
var themeIdsWithOverrides = exports.themeIdsWithOverrides = [].concat((0, _toConsumableArray2.default)(_themeIds.themeIds), themeOverrideIds);