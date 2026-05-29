"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lstarFromY = lstarFromY;
var _labF = require("./lab-f");
/**
 * Converts a Y value to an L* value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 *
 * @param y Y in XYZ
 * @return L* in L*a*b*
 */
function lstarFromY(y) {
  return (0, _labF.labF)(y / 100.0) * 116.0 - 16.0;
}