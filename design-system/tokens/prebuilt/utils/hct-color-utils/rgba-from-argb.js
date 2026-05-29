"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbaFromArgb = rgbaFromArgb;
var _alphaFromArgb = require("./alpha-from-argb");
var _blueFromArgb = require("./blue-from-argb");
var _greenFromArgb = require("./green-from-argb");
var _redFromArgb = require("./red-from-argb");
/**
 * Return RGBA from a given int32 color
 *
 * @param argb ARGB representation of a int32 color.
 * @return RGBA representation of a int32 color.
 */
function rgbaFromArgb(argb) {
  var r = (0, _redFromArgb.redFromArgb)(argb);
  var g = (0, _greenFromArgb.greenFromArgb)(argb);
  var b = (0, _blueFromArgb.blueFromArgb)(argb);
  var a = (0, _alphaFromArgb.alphaFromArgb)(argb);
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
}