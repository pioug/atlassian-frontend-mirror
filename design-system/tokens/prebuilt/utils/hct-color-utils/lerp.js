"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lerp = lerp;
/**
 * The linear interpolation function.
 *
 * @return start if amount = 0 and stop if amount = 1
 */
function lerp(start, stop, amount) {
  return (1.0 - amount) * start + amount * stop;
}