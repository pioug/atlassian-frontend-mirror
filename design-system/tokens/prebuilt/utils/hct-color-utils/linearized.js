"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearized = linearized;
/**
 * Linearizes an RGB component.
 *
 * @param rgbComponent 0 <= rgb_component <= 255, represents R/G/B
 * channel
 * @return 0.0 <= output <= 100.0, color channel converted to
 * linear RGB space
 */
function linearized(rgbComponent) {
  var normalized = rgbComponent / 255.0;
  if (normalized <= 0.040449936) {
    return normalized / 12.92 * 100.0;
  } else {
    return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100.0;
  }
}