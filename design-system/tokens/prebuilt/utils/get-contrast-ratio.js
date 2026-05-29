"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContrastRatio = getContrastRatio;
var _hexToRgb = require("./hex-to-rgb");
var _isValidHex = require("./is-valid-hex");
var _relativeLuminanceW3C = require("./relative-luminance-w3-c");
function getContrastRatio(foreground, background) {
  if (!(0, _isValidHex.isValidHex)(foreground) || !(0, _isValidHex.isValidHex)(background)) {
    throw new Error('Invalid HEX');
  }
  var foregroundRgb = (0, _hexToRgb.hexToRgb)(foreground);
  var backgroundRgb = (0, _hexToRgb.hexToRgb)(background);
  var foregroundLuminance = (0, _relativeLuminanceW3C.relativeLuminanceW3C)(foregroundRgb[0], foregroundRgb[1], foregroundRgb[2]);
  var backgroundLuminance = (0, _relativeLuminanceW3C.relativeLuminanceW3C)(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
  // calculate the color contrast ratio
  var brightest = Math.max(foregroundLuminance, backgroundLuminance);
  var darkest = Math.min(foregroundLuminance, backgroundLuminance);
  return (brightest + 0.05) / (darkest + 0.05);
}