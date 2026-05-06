"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = void 0;
Object.defineProperty(exports, "getCustomThemeStyles", {
  enumerable: true,
  get: function get() {
    return _getCustomThemeStyles.getCustomThemeStyles;
  }
});
exports.loadAndAppendCustomThemeCss = loadAndAppendCustomThemeCss;
var _getCustomThemeStyles = require("./get-custom-theme-styles");
var _limitSizeOfCustomStyleElements = require("./utils/limit-size-of-custom-style-elements");
var CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = exports.CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = 10;
function loadAndAppendCustomThemeCss(themeState) {
  var themes = (0, _getCustomThemeStyles.getCustomThemeStyles)(themeState);
  (0, _limitSizeOfCustomStyleElements.limitSizeOfCustomStyleElements)(CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD);
  themes.map(function (theme) {
    var styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
    styleTag.dataset.theme = theme.attrs['data-theme'];
    styleTag.dataset.customTheme = theme.attrs['data-custom-theme'];
    styleTag.textContent = theme.css;
  });
}