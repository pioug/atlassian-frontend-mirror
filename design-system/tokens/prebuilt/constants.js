"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TOKEN_NOT_FOUND_CSS_VAR = exports.THEME_DATA_ATTRIBUTE = exports.DEFAULT_THEME = exports.CUSTOM_THEME_ATTRIBUTE = exports.CURRENT_SURFACE_CSS_VAR = exports.CSS_VAR_FULL = exports.CSS_PREFIX = exports.CONTRAST_MODE_ATTRIBUTE = exports.COLOR_MODE_ATTRIBUTE = void 0;
var THEME_DATA_ATTRIBUTE = exports.THEME_DATA_ATTRIBUTE = 'data-theme';
var COLOR_MODE_ATTRIBUTE = exports.COLOR_MODE_ATTRIBUTE = 'data-color-mode';
var CONTRAST_MODE_ATTRIBUTE = exports.CONTRAST_MODE_ATTRIBUTE = 'data-contrast-mode';
var CUSTOM_THEME_ATTRIBUTE = exports.CUSTOM_THEME_ATTRIBUTE = 'data-custom-theme';
var DEFAULT_THEME = exports.DEFAULT_THEME = 'light';
var CSS_PREFIX = exports.CSS_PREFIX = 'ds';
var CSS_VAR_FULL = exports.CSS_VAR_FULL = ['opacity', 'font', 'space', 'border'];
var TOKEN_NOT_FOUND_CSS_VAR = exports.TOKEN_NOT_FOUND_CSS_VAR = "--".concat(CSS_PREFIX, "-token-not-found");
var CURRENT_SURFACE_CSS_VAR = exports.CURRENT_SURFACE_CSS_VAR = "--".concat(CSS_PREFIX, "-elevation-surface-current");