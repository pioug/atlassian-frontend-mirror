"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argbFromXyz = argbFromXyz;
var _argbFromRgb = require("./argb-from-rgb");
var _delinearized = require("./delinearized");
/**
 * Color science utilities.
 *
 * Utility methods for color science constants and color space
 * conversions that aren't HCT or CAM16.
 */
var XYZ_TO_SRGB = [[3.2413774792388685, -1.5376652402851851, -0.49885366846268053], [-0.9691452513005321, 1.8758853451067872, 0.04156585616912061], [0.05562093689691305, -0.20395524564742123, 1.0571799111220335]];

/**
 * Converts a color from ARGB to XYZ.
 */
function argbFromXyz(x, y, z) {
  var matrix = XYZ_TO_SRGB;
  var linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
  var linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
  var linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
  var r = (0, _delinearized.delinearized)(linearR);
  var g = (0, _delinearized.delinearized)(linearG);
  var b = (0, _delinearized.delinearized)(linearB);
  return (0, _argbFromRgb.argbFromRgb)(r, g, b);
}