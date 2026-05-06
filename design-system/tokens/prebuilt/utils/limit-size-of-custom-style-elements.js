"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.limitSizeOfCustomStyleElements = limitSizeOfCustomStyleElements;
var _constants = require("../constants");
function limitSizeOfCustomStyleElements(sizeThreshold) {
  var styleTags = Array.from(document.head.querySelectorAll("style[".concat(_constants.CUSTOM_THEME_ATTRIBUTE, "][").concat(_constants.THEME_DATA_ATTRIBUTE, "]")));
  if (styleTags.length < sizeThreshold) {
    return;
  }
  styleTags.slice(0, styleTags.length - (sizeThreshold - 1)).forEach(function (element) {
    return element.remove();
  });
}