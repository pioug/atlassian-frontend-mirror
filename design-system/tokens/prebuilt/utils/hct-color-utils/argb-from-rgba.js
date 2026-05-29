"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argbFromRgba = argbFromRgba;
var _clampComponent = require("./clamp-component");
/**
 * Return int32 color from a given RGBA component
 *
 * @param rgba RGBA representation of a int32 color.
 * @returns ARGB representation of a int32 color.
 */
function argbFromRgba(_ref) {
  var r = _ref.r,
    g = _ref.g,
    b = _ref.b,
    a = _ref.a;
  var rValue = (0, _clampComponent.clampComponent)(r);
  var gValue = (0, _clampComponent.clampComponent)(g);
  var bValue = (0, _clampComponent.clampComponent)(b);
  var aValue = (0, _clampComponent.clampComponent)(a);
  return aValue << 24 | rValue << 16 | gValue << 8 | bValue;
}