"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clampComponent = clampComponent;
function clampComponent(value) {
  if (value < 0) {
    return 0;
  }
  if (value > 255) {
    return 255;
  }
  return value;
}