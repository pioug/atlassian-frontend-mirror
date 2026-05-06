"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clampDouble = clampDouble;
/**
 * Clamps an integer between two floating-point numbers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */
function clampDouble(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }
  return input;
}