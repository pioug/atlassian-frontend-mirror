"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alphaFromArgb = alphaFromArgb;
/**
 * Returns the alpha component of a color in ARGB format.
 */
function alphaFromArgb(argb) {
  return argb >> 24 & 255;
}