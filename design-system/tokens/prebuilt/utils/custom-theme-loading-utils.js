"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMissingCustomStyleElements = findMissingCustomStyleElements;
Object.defineProperty(exports, "limitSizeOfCustomStyleElements", {
  enumerable: true,
  get: function get() {
    return _limitSizeOfCustomStyleElements.limitSizeOfCustomStyleElements;
  }
});
exports.reduceTokenMap = reduceTokenMap;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _tokenNames = _interopRequireDefault(require("../artifacts/token-names"));
var _constants = require("../constants");
var _hash = require("./hash");
var _limitSizeOfCustomStyleElements = require("./limit-size-of-custom-style-elements");
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
function reduceTokenMap(tokenMap, themeRamp) {
  return Object.entries(tokenMap).reduce(function (acc, _ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    var cssVar = _tokenNames.default[key];
    return cssVar ? "".concat(acc, "\n  ").concat(cssVar, ": ").concat(typeof value === 'string' ? value : themeRamp[value], ";") : acc;
  }, '');
}