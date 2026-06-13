"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestColorIndex = exports.generateTokenMapWithContrastCheck = exports.generateTokenMap = exports.generateColors = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _atlassianDarkTokenValueForContrastCheck = _interopRequireDefault(require("../artifacts/atlassian-dark-token-value-for-contrast-check"));
var _colorUtils = require("./color-utils");
var _customThemeTokenContrastCheck = require("./custom-theme-token-contrast-check");
var _hctColorUtils = require("./hct-color-utils");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var lowLuminanceContrastRatios = [1.12, 1.33, 2.03, 2.73, 3.33, 4.27, 5.2, 6.62, 12.46, 14.25];
var highLuminanceContrastRatios = [1.08, 1.24, 1.55, 1.99, 2.45, 3.34, 4.64, 6.1, 10.19, 12.6];
var getClosestColorIndex = exports.getClosestColorIndex = function getClosestColorIndex(themeRamp, brandColor) {
  // Iterate over themeRamp and find whichever color is closest to brandColor
  var closestColorIndex = 0;
  var closestColorDistance = null;
  themeRamp.forEach(function (value, index) {
    var distance = (0, _colorUtils.deltaE)((0, _colorUtils.hexToRgb)(value), (0, _colorUtils.hexToRgb)(brandColor));
    if (closestColorDistance === null || distance < closestColorDistance) {
      closestColorIndex = index;
      closestColorDistance = distance;
    }
  });
  return closestColorIndex;
};
var generateColors = exports.generateColors = function generateColors(brandColor) {
  // Determine luminance
  var HSLBrandColorHue = (0, _colorUtils.hexToHSL)(brandColor)[0];
  var baseRgb = (0, _colorUtils.HSLToRGB)(HSLBrandColorHue, 100, 60);
  var isLowLuminance = (0, _colorUtils.relativeLuminanceW3C)(baseRgb[0], baseRgb[1], baseRgb[2]) < 0.4;
  // Choose right palette
  var themeRatios = isLowLuminance ? lowLuminanceContrastRatios : highLuminanceContrastRatios;
  var brandRgba = (0, _colorUtils.hexToRgbA)(brandColor);
  var hctColor = _hctColorUtils.Hct.fromInt((0, _hctColorUtils.argbFromRgba)({
    r: brandRgba[0],
    g: brandRgba[1],
    b: brandRgba[2],
    a: brandRgba[3]
  }));
  var themeRamp = themeRatios.map(function (contrast) {
    var rgbaColor = (0, _hctColorUtils.rgbaFromArgb)(_hctColorUtils.Hct.from(hctColor.hue, hctColor.chroma, _hctColorUtils.Contrast.darker(100, contrast) + 0.25 // Material's utils provide an offset
    ).toInt());
    return (0, _colorUtils.rgbToHex)(rgbaColor.r, rgbaColor.g, rgbaColor.b);
  });
  var closestColorIndex = getClosestColorIndex(themeRamp, brandColor);

  // Replace closet color with brandColor
  var updatedThemeRamp = (0, _toConsumableArray2.default)(themeRamp);
  updatedThemeRamp[closestColorIndex] = brandColor;
  return {
    ramp: updatedThemeRamp,
    // add the replaced color into the result
    replacedColor: themeRamp[closestColorIndex]
  };
};

/**
 * Return the interaction tokens for a color, given its ramp position and the number of
 * needed interaction states. Use higher-indexed colors (i.e. darker colors) if possible;
 * if there's not enough room to shift up for the required number of interaction tokens,
 * it goes as far as it can, then returns lighter colors lower down the ramp instead.
 *
 * Returns an array of the resulting colors
 */
function getInteractionStates(rampPosition, number, colors) {
  var result = [];
  for (var i = 1; i <= number; i++) {
    if (rampPosition + i < colors.length) {
      result.push(rampPosition + i);
    } else {
      result.push(rampPosition - (i - (colors.length - 1 - rampPosition)));
    }
  }
  return result;
}
var generateTokenMap = exports.generateTokenMap = function generateTokenMap(brandColor, mode, themeRamp) {
  var _generateColors = generateColors(brandColor),
    ramp = _generateColors.ramp,
    replacedColor = _generateColors.replacedColor;
  var colors = themeRamp || ramp;
  var closestColorIndex = getClosestColorIndex(colors, brandColor);
  var customThemeTokenMapLight = {};
  var customThemeTokenMapDark = {};
  var inputContrast = (0, _colorUtils.getContrastRatio)(brandColor, '#FFFFFF');
  // Branch based on brandColor's contrast against white
  if (inputContrast >= 4.5) {
    /**
     * Generate interaction tokens for
     * - color.background.brand.bold
     * - color.background.selected.bold
     */
    var _getInteractionStates = getInteractionStates(closestColorIndex, 2, colors),
      _getInteractionStates2 = (0, _slicedToArray2.default)(_getInteractionStates, 2),
      brandBoldSelectedHoveredIndex = _getInteractionStates2[0],
      brandBoldSelectedPressedIndex = _getInteractionStates2[1];
    var brandTextIndex = closestColorIndex;
    if (inputContrast < 5.4 && inputContrast >= 4.8 && closestColorIndex === 6) {
      // Use the one-level darker closest color (X800) for color.text.brand
      // and color.link to avoid contrast breaches
      brandTextIndex = closestColorIndex + 1;
    }

    /**
     * Generate interaction token for color.link:
     * If inputted color replaces X1000
     * - Pressed = X900
     *
     * If inputted color replaces X700-X900
     * - Shift one 1 step darker
     */
    var _getInteractionStates3 = getInteractionStates(brandTextIndex, 1, colors),
      _getInteractionStates4 = (0, _slicedToArray2.default)(_getInteractionStates3, 1),
      linkPressed = _getInteractionStates4[0];
    customThemeTokenMapLight = {
      'color.text.brand': brandTextIndex,
      'color.icon.brand': closestColorIndex,
      'color.background.brand.subtlest': 0,
      'color.background.brand.subtlest.hovered': 1,
      'color.background.brand.subtlest.pressed': 2,
      'color.background.brand.bold': closestColorIndex,
      'color.background.brand.bold.hovered': brandBoldSelectedHoveredIndex,
      'color.background.brand.bold.pressed': brandBoldSelectedPressedIndex,
      'color.background.brand.boldest': 9,
      'color.background.brand.boldest.hovered': 8,
      'color.background.brand.boldest.pressed': 7,
      'color.border.brand': closestColorIndex,
      'color.text.selected': brandTextIndex,
      'color.icon.selected': closestColorIndex,
      'color.background.selected.bold': closestColorIndex,
      'color.background.selected.bold.hovered': brandBoldSelectedHoveredIndex,
      'color.background.selected.bold.pressed': brandBoldSelectedPressedIndex,
      'color.border.selected': closestColorIndex,
      'color.link': brandTextIndex,
      'color.link.pressed': linkPressed,
      'color.chart.brand': 5,
      'color.chart.brand.hovered': 6,
      'color.background.selected': 0,
      'color.background.selected.hovered': 1,
      'color.background.selected.pressed': 2
    };
  } else {
    var brandBackgroundIndex = 6;
    if (inputContrast < 4.5 && inputContrast >= 4 && closestColorIndex === 6) {
      // Use the generated closest color instead of the input brand color for
      // color.background.selected.bold and color.background.brand.bold
      // to avoid contrast breaches
      brandBackgroundIndex = replacedColor;
    }
    customThemeTokenMapLight = {
      'color.background.brand.subtlest': 0,
      'color.background.brand.subtlest.hovered': 1,
      'color.background.brand.subtlest.pressed': 2,
      'color.background.brand.bold': brandBackgroundIndex,
      'color.background.brand.bold.hovered': 7,
      'color.background.brand.bold.pressed': 8,
      'color.background.brand.boldest': 9,
      'color.background.brand.boldest.hovered': 8,
      'color.background.brand.boldest.pressed': 7,
      'color.border.brand': 6,
      'color.background.selected.bold': brandBackgroundIndex,
      'color.background.selected.bold.hovered': 7,
      'color.background.selected.bold.pressed': 8,
      'color.text.brand': 6,
      'color.icon.brand': 6,
      'color.chart.brand': 5,
      'color.chart.brand.hovered': 6,
      'color.text.selected': 6,
      'color.icon.selected': 6,
      'color.border.selected': 6,
      'color.background.selected': 0,
      'color.background.selected.hovered': 1,
      'color.background.selected.pressed': 2,
      'color.link': 6,
      'color.link.pressed': 7
    };
  }
  if (mode === 'light') {
    return {
      light: customThemeTokenMapLight
    };
  }

  /**
   * Generate dark mode values using rule of symmetry
   */
  Object.entries(customThemeTokenMapLight).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    customThemeTokenMapDark[key] = 9 - (typeof value === 'string' ? closestColorIndex : value);
  });

  /**
   * If the input brand color < 4.5, and it meets 4.5 contrast again inverse text color
   * in dark mode, shift color.background.brand.bold to the brand color
   */
  if (inputContrast < 4.5) {
    var inverseTextColor = _atlassianDarkTokenValueForContrastCheck.default['color.text.inverse'];
    if ((0, _colorUtils.getContrastRatio)(inverseTextColor, brandColor) >= 4.5 && closestColorIndex >= 2) {
      customThemeTokenMapDark['color.background.brand.bold'] = closestColorIndex;
      customThemeTokenMapDark['color.background.brand.bold.hovered'] = closestColorIndex - 1;
      customThemeTokenMapDark['color.background.brand.bold.pressed'] = closestColorIndex - 2;
    }
  }
  if (mode === 'dark') {
    return {
      dark: customThemeTokenMapDark
    };
  }
  return {
    light: customThemeTokenMapLight,
    dark: customThemeTokenMapDark
  };
};
var generateTokenMapWithContrastCheck = exports.generateTokenMapWithContrastCheck = function generateTokenMapWithContrastCheck(brandColor, mode, themeRamp) {
  var colors = themeRamp || generateColors(brandColor).ramp;
  var tokenMaps = generateTokenMap(brandColor, mode, colors);
  var result = {};
  Object.entries(tokenMaps).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
      mode = _ref4[0],
      map = _ref4[1];
    if (mode === 'light' || mode === 'dark') {
      result[mode] = _objectSpread(_objectSpread({}, map), (0, _customThemeTokenContrastCheck.additionalContrastChecker)({
        customThemeTokenMap: map,
        mode: mode,
        themeRamp: colors
      }));
    }
  });
  return result;
};