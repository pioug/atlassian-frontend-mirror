"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clampInt = clampInt;
/**
 * Clamps an integer between two integers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */
function clampInt(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }
  return input;
}