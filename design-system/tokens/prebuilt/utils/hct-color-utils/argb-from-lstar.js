"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argbFromLstar = argbFromLstar;
var _argbFromRgb = require("./argb-from-rgb");
var _delinearized = require("./delinearized");
var _yFromLstar = require("./y-from-lstar");
/**
 * Converts an L* value to an ARGB representation.
 *
 * @param lstar L* in L*a*b*
 * @return ARGB representation of grayscale color with lightness
 * matching L*
 */
function argbFromLstar(lstar) {
  var y = (0, _yFromLstar.yFromLstar)(lstar);
  var component = (0, _delinearized.delinearized)(y);
  return (0, _argbFromRgb.argbFromRgb)(component, component, component);
}