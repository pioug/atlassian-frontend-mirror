"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlpha = getAlpha;
function getAlpha(hex) {
  if (hex.length === 9) {
    var int = parseInt(hex.slice(7, 9), 16) / 255;
    return Number(parseFloat(int.toString()).toFixed(2));
  }
  return 1;
}