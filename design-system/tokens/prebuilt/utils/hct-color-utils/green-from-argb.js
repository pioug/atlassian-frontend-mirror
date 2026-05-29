"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greenFromArgb = greenFromArgb;
/**
 * Returns the green component of a color in ARGB format.
 */
function greenFromArgb(argb) {
  return argb >> 8 & 255;
}