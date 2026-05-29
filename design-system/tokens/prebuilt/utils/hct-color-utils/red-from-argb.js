"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redFromArgb = redFromArgb;
/**
 * Returns the red component of a color in ARGB format.
 */
function redFromArgb(argb) {
  return argb >> 16 & 255;
}