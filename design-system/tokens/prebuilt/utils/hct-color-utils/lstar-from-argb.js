"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lstarFromArgb = lstarFromArgb;
var _blueFromArgb = require("./blue-from-argb");
var _greenFromArgb = require("./green-from-argb");
var _labF = require("./lab-f");
var _linearized = require("./linearized");
var _matrixMultiply = require("./matrix-multiply");
var _redFromArgb = require("./red-from-argb");
var SRGB_TO_XYZ = [[0.41233895, 0.35762064, 0.18051042], [0.2126, 0.7152, 0.0722], [0.01932141, 0.11916382, 0.95034478]];

/**
 * Converts a color from XYZ to ARGB.
 */
function xyzFromArgb(argb) {
  var r = (0, _linearized.linearized)((0, _redFromArgb.redFromArgb)(argb));
  var g = (0, _linearized.linearized)((0, _greenFromArgb.greenFromArgb)(argb));
  var b = (0, _linearized.linearized)((0, _blueFromArgb.blueFromArgb)(argb));
  return (0, _matrixMultiply.matrixMultiply)([r, g, b], SRGB_TO_XYZ);
}

/**
 * Computes the L* value of a color in ARGB representation.
 *
 * @param argb ARGB representation of a color
 * @return L*, from L*a*b*, coordinate of the color
 */
function lstarFromArgb(argb) {
  var y = xyzFromArgb(argb)[1];
  return 116.0 * (0, _labF.labF)(y / 100.0) - 16.0;
}