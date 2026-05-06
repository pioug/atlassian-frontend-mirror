"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbToHex = rgbToHex;
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}