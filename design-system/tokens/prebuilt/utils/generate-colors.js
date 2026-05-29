"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateColors = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _getClosestColorIndex = require("./get-closest-color-index");
var _hctColorUtils = require("./hct-color-utils");
var _hexToHsl = require("./hex-to-hsl");
var _hexToRgbA = require("./hex-to-rgb-a");
var _hslToRgb = require("./hsl-to-rgb");
var _relativeLuminanceW3C = require("./relative-luminance-w3-c");
var _rgbToHex = require("./rgb-to-hex");
var lowLuminanceContrastRatios = [1.12, 1.33, 2.03, 2.73, 3.33, 4.27, 5.2, 6.62, 12.46, 14.25];
var highLuminanceContrastRatios = [1.08, 1.24, 1.55, 1.99, 2.45, 3.34, 4.64, 6.1, 10.19, 12.6];
var generateColors = exports.generateColors = function generateColors(brandColor) {
  // Determine luminance
  var HSLBrandColorHue = (0, _hexToHsl.hexToHSL)(brandColor)[0];
  var baseRgb = (0, _hslToRgb.HSLToRGB)(HSLBrandColorHue, 100, 60);
  var isLowLuminance = (0, _relativeLuminanceW3C.relativeLuminanceW3C)(baseRgb[0], baseRgb[1], baseRgb[2]) < 0.4;
  // Choose right palette
  var themeRatios = isLowLuminance ? lowLuminanceContrastRatios : highLuminanceContrastRatios;
  var brandRgba = (0, _hexToRgbA.hexToRgbA)(brandColor);
  var hctColor = _hctColorUtils.Hct.fromInt((0, _hctColorUtils.argbFromRgba)({
    r: brandRgba[0],
    g: brandRgba[1],
    b: brandRgba[2],
    a: brandRgba[3]
  }));
  var themeRamp = themeRatios.map(function (contrast) {
    var rgbaColor = (0, _hctColorUtils.rgbaFromArgb)(_hctColorUtils.Hct.from(hctColor.hue, hctColor.chroma, _hctColorUtils.Contrast.darker(100, contrast) + 0.25 // Material's utils provide an offset
    ).toInt());
    return (0, _rgbToHex.rgbToHex)(rgbaColor.r, rgbaColor.g, rgbaColor.b);
  });
  var closestColorIndex = (0, _getClosestColorIndex.getClosestColorIndex)(themeRamp, brandColor);

  // Replace closet color with brandColor
  var updatedThemeRamp = (0, _toConsumableArray2.default)(themeRamp);
  updatedThemeRamp[closestColorIndex] = brandColor;
  return {
    ramp: updatedThemeRamp,
    // add the replaced color into the result
    replacedColor: themeRamp[closestColorIndex]
  };
};