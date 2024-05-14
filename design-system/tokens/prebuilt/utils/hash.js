"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = void 0;
var hash = exports.hash = function hash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};