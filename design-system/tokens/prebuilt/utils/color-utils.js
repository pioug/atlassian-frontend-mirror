"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HSLToRGB = HSLToRGB;
exports.deltaE = deltaE;
exports.getAlpha = getAlpha;
exports.getContrastRatio = getContrastRatio;
exports.hexToHSL = hexToHSL;
exports.hexToRgb = hexToRgb;
exports.hexToRgbA = hexToRgbA;
exports.isValidBrandHex = void 0;
exports.relativeLuminanceW3C = relativeLuminanceW3C;
exports.rgbToHex = rgbToHex;
// valid hex color with 6 digits
var isValidBrandHex = exports.isValidBrandHex = function isValidBrandHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

// valid hex color with 4, 6 or 8 digits
var isValidHex = function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
};
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function getAlpha(hex) {
  if (hex.length === 9) {
    var int = parseInt(hex.slice(7, 9), 16) / 255;
    return Number(parseFloat(int.toString()).toFixed(2));
  }
  return 1;
}
function hexToRgbA(hex) {
  if (!isValidHex(hex)) {
    throw new Error('Invalid HEX');
  }
  var c;
  c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return [c >> 16 & 255, c >> 8 & 255, c & 255, getAlpha(hex)];
}
function hexToRgb(hex) {
  if (!isValidHex(hex)) {
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
function hexToHSL(hex) {
  if (!isValidHex(hex)) {
    throw new Error('Invalid HEX');
  }
  var r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  var cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = (g - b) / delta % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}
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
function relativeLuminanceW3C(r, g, b) {
  var RsRGB = r / 255;
  var GsRGB = g / 255;
  var BsRGB = b / 255;
  var R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
  var G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
  var B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

  // For the sRGB colorspace, the relative luminance of a color is defined as:
  var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return L;
}
function getContrastRatio(foreground, background) {
  if (!isValidHex(foreground) || !isValidHex(background)) {
    throw new Error('Invalid HEX');
  }
  var foregroundRgb = hexToRgb(foreground);
  var backgroundRgb = hexToRgb(background);
  var foregroundLuminance = relativeLuminanceW3C(foregroundRgb[0], foregroundRgb[1], foregroundRgb[2]);
  var backgroundLuminance = relativeLuminanceW3C(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
  // calculate the color contrast ratio
  var brightest = Math.max(foregroundLuminance, backgroundLuminance);
  var darkest = Math.min(foregroundLuminance, backgroundLuminance);
  return (brightest + 0.05) / (darkest + 0.05);
}
function deltaE(rgbA, rgbB) {
  var labA = rgbToLab(rgbA);
  var labB = rgbToLab(rgbB);
  var deltaL = labA[0] - labB[0];
  var deltaA = labA[1] - labB[1];
  var deltaB = labA[2] - labB[2];
  var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  var deltaC = c1 - c2;
  var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  var sc = 1.0 + 0.045 * c1;
  var sh = 1.0 + 0.015 * c1;
  var deltaLKlsl = deltaL / 1.0;
  var deltaCkcsc = deltaC / sc;
  var deltaHkhsh = deltaH / sh;
  var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}
function rgbToLab(rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}