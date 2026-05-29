"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduceTokenMap = reduceTokenMap;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _tokenNames = _interopRequireDefault(require("../artifacts/token-names"));
function reduceTokenMap(tokenMap, themeRamp) {
  return Object.entries(tokenMap).reduce(function (acc, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    var cssVar = _tokenNames.default[key];
    return cssVar ? "".concat(acc, "\n  ").concat(cssVar, ": ").concat(typeof value === 'string' ? value : themeRamp[value], ";") : acc;
  }, '');
}