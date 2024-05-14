"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRGBAValues = exports.getBoxShadow = void 0;
var hexToRGBAValues = exports.hexToRGBAValues = function hexToRGBAValues(hex) {
  var hexColor = hex.replace('#', '');
  return {
    r: parseInt(hexColor.slice(0, 2), 16),
    g: parseInt(hexColor.slice(2, 4), 16),
    b: parseInt(hexColor.slice(4, 6), 16),
    a: parseFloat((parseInt(hexColor.slice(6, 8), 16) / 255).toFixed(2))
  };
};

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
    var _hexToRGBAValues = hexToRGBAValues(color),
      r = _hexToRGBAValues.r,
      g = _hexToRGBAValues.g,
      b = _hexToRGBAValues.b;
    return "".concat(offset.x, "px ").concat(offset.y, "px ").concat(radius, "px rgba(").concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(opacity, ")");
  }).join(',');
};