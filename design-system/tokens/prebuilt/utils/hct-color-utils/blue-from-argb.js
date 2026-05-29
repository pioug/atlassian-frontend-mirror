"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blueFromArgb = blueFromArgb;
/**
 * Returns the blue component of a color in ARGB format.
 */
function blueFromArgb(argb) {
  return argb & 255;
}