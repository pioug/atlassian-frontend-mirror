"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yFromLstar = yFromLstar;
var _labInvf = require("./lab-invf");
/**
 * Converts an L* value to a Y value.
 *
 * L* in L*a*b* and Y in XYZ measure the same quantity, luminance.
 *
 * L* measures perceptual luminance, a linear scale. Y in XYZ
 * measures relative luminance, a logarithmic scale.
 *
 * @param lstar L* in L*a*b*
 * @return Y in XYZ
 */
function yFromLstar(lstar) {
  return 100.0 * (0, _labInvf.labInvf)((lstar + 16.0) / 116.0);
}