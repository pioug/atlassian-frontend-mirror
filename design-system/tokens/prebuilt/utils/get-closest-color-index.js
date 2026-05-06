"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestColorIndex = void 0;
var _colorUtils = require("./color-utils");
var getClosestColorIndex = exports.getClosestColorIndex = function getClosestColorIndex(themeRamp, brandColor) {
  // Iterate over themeRamp and find whichever color is closest to brandColor
  var closestColorIndex = 0;
  var closestColorDistance = null;
  themeRamp.forEach(function (value, index) {
    var distance = (0, _colorUtils.deltaE)((0, _colorUtils.hexToRgb)(value), (0, _colorUtils.hexToRgb)(brandColor));
    if (closestColorDistance === null || distance < closestColorDistance) {
      closestColorIndex = index;
      closestColorDistance = distance;
    }
  });
  return closestColorIndex;
};