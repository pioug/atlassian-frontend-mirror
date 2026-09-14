"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalTheme = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../constants");
var _isThemeColorMode = require("../is-theme-color-mode");
var _themeStringToObject = require("../theme-string-to-object");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var getGlobalTheme = exports.getGlobalTheme = function getGlobalTheme() {
  if (typeof document === 'undefined') {
    return {};
  }
  var element = document.documentElement;
  var colorMode = element.getAttribute(_constants.COLOR_MODE_ATTRIBUTE) || '';
  var theme = element.getAttribute(_constants.THEME_DATA_ATTRIBUTE) || '';
  return _objectSpread(_objectSpread({}, (0, _themeStringToObject.themeStringToObject)(theme)), (0, _isThemeColorMode.isThemeColorMode)(colorMode) && {
    colorMode: colorMode
  });
};