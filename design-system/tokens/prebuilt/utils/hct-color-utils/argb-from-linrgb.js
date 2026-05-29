"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argbFromLinrgb = argbFromLinrgb;
var _argbFromRgb = require("./argb-from-rgb");
var _delinearized = require("./delinearized");
/**
 * Converts a color from linear RGB components to ARGB format.
 */
function argbFromLinrgb(linrgb) {
  var r = (0, _delinearized.delinearized)(linrgb[0]);
  var g = (0, _delinearized.delinearized)(linrgb[1]);
  var b = (0, _delinearized.delinearized)(linrgb[2]);
  return (0, _argbFromRgb.argbFromRgb)(r, g, b);
}