"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argbFromRgb = argbFromRgb;
/**
 * Converts a color from RGB components to ARGB format.
 */
function argbFromRgb(red, green, blue) {
  return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
}