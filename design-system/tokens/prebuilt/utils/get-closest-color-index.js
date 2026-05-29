"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestColorIndex = void 0;
var _deltaE = require("./delta-e");
var _hexToRgb = require("./hex-to-rgb");
var getClosestColorIndex = exports.getClosestColorIndex = function getClosestColorIndex(themeRamp, brandColor) {
  // Iterate over themeRamp and find whichever color is closest to brandColor
  var closestColorIndex = 0;
  var closestColorDistance = null;
  themeRamp.forEach(function (value, index) {
    var distance = (0, _deltaE.deltaE)((0, _hexToRgb.hexToRgb)(value), (0, _hexToRgb.hexToRgb)(brandColor));
    if (closestColorDistance === null || distance < closestColorDistance) {
      closestColorIndex = index;
      closestColorDistance = distance;
    }
  });
  return closestColorIndex;
};