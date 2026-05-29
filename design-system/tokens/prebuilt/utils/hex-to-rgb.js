"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToRgb = hexToRgb;
var _isValidHex = require("./is-valid-hex");
function hexToRgb(hex) {
  if (!(0, _isValidHex.isValidHex)(hex)) {
    throw new Error('Invalid HEX');
  }
  var c;
  c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return [c >> 16 & 255, c >> 8 & 255, c & 255];
}