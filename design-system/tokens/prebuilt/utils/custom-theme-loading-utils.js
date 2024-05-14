"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMissingCustomStyleElements = findMissingCustomStyleElements;
exports.limitSizeOfCustomStyleElements = limitSizeOfCustomStyleElements;
exports.reduceTokenMap = reduceTokenMap;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _tokenNames = _interopRequireDefault(require("../artifacts/token-names"));
var _constants = require("../constants");
var _hash = require("./hash");
function findMissingCustomStyleElements(UNSAFE_themeOptions, mode) {
  var optionString = JSON.stringify(UNSAFE_themeOptions);
  var uniqueId = (0, _hash.hash)(optionString);
  var attrOfMissingCustomStyles = [];
  (mode === 'auto' ? ['light', 'dark'] : [mode]).forEach(function (themeId) {
    var element = document.head.querySelector("style[".concat(_constants.CUSTOM_THEME_ATTRIBUTE, "=\"").concat(uniqueId, "\"][").concat(_constants.THEME_DATA_ATTRIBUTE, "=\"").concat(themeId, "\"]"));
    if (element) {
      // Append the existing custom styles to take precedence over others
      document.head.appendChild(element);
    } else {
      attrOfMissingCustomStyles.push(themeId);
    }
  });
  return attrOfMissingCustomStyles;
}
function limitSizeOfCustomStyleElements(sizeThreshold) {
  var styleTags = (0, _toConsumableArray2.default)(Array.from(document.head.querySelectorAll("style[".concat(_constants.CUSTOM_THEME_ATTRIBUTE, "][").concat(_constants.THEME_DATA_ATTRIBUTE, "]"))));
  if (styleTags.length < sizeThreshold) {
    return;
  }
  styleTags.slice(0, styleTags.length - (sizeThreshold - 1)).forEach(function (element) {
    return element.remove();
  });
}
function reduceTokenMap(tokenMap, themeRamp) {
  return Object.entries(tokenMap).reduce(function (acc, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    var cssVar = _tokenNames.default[key];
    return cssVar ? "".concat(acc, "\n  ").concat(cssVar, ": ").concat(typeof value === 'string' ? value : themeRamp[value], ";") : acc;
  }, '');
}