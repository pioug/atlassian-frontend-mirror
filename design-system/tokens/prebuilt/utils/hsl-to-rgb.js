"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HSLToRGB = HSLToRGB;
function HSLToRGB(h, s, l) {
  s /= 100;
  l /= 100;
  var k = function k(n) {
    return (n + h / 30) % 12;
  };
  var a = s * Math.min(l, 1 - l);
  var f = function f(n) {
    return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  };
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}