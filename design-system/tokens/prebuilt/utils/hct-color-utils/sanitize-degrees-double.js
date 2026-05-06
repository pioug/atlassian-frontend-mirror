"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeDegreesDouble = sanitizeDegreesDouble;
/**
 * Sanitizes a degree measure as a floating-point number.
 *
 * @return a degree measure between 0.0 (inclusive) and 360.0
 * (exclusive).
 */
function sanitizeDegreesDouble(degrees) {
  degrees = degrees % 360.0;
  if (degrees < 0) {
    degrees = degrees + 360.0;
  }
  return degrees;
}