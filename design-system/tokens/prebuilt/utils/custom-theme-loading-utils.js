"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMissingCustomStyleElements = findMissingCustomStyleElements;
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