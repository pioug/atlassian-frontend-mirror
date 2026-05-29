"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTokenMapWithContrastCheck = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _additionalContrastChecker = require("./additional-contrast-checker");
var _generateColors = require("./generate-colors");
var _generateTokenMap = require("./generate-token-map");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var generateTokenMapWithContrastCheck = exports.generateTokenMapWithContrastCheck = function generateTokenMapWithContrastCheck(brandColor, mode, themeRamp) {
  var colors = themeRamp || (0, _generateColors.generateColors)(brandColor).ramp;
  var tokenMaps = (0, _generateTokenMap.generateTokenMap)(brandColor, mode, colors);
  var result = {};
  Object.entries(tokenMaps).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      mode = _ref2[0],
      map = _ref2[1];
    if (mode === 'light' || mode === 'dark') {
      result[mode] = _objectSpread(_objectSpread({}, map), (0, _additionalContrastChecker.additionalContrastChecker)({
        customThemeTokenMap: map,
        mode: mode,
        themeRamp: colors
      }));
    }
  });
  return result;
};