"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBoxShadow = void 0;
Object.defineProperty(exports, "hexToRGBAValues", {
  enumerable: true,
  get: function get() {
    return _hexToRgbaValues.hexToRGBAValues;
  }
});
var _hexToRgbaValues = require("./hex-to-rgba-values");
/**
 * Returns a box shadow formatted for CSS from a ShadowToken raw value.
 *
 * @param rawShadow - ShadowToken raw value
 */
var getBoxShadow = exports.getBoxShadow = function getBoxShadow(rawShadow) {
  return rawShadow.map(function (_ref) {
    var radius = _ref.radius,
      offset = _ref.offset,
      color = _ref.color,
      opacity = _ref.opacity;
    var _hexToRGBAValues = (0, _hexToRgbaValues.hexToRGBAValues)(color),
      r = _hexToRGBAValues.r,
      g = _hexToRGBAValues.g,
      b = _hexToRGBAValues.b;
    return "".concat(offset.x, "px ").concat(offset.y, "px ").concat(radius, "px rgba(").concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(opacity, ")");
  }).join(',');
};