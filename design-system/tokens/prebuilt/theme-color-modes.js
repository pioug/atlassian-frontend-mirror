"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeColorModes = void 0;
/**
 * Theme modes: The general purpose of a theme.
 * This attr is used to apply the appropriate system-preference option
 * It may also be used as a selector for mode-specific overrides such as light/dark images.
 * The idea is there may exist many color themes, but every theme must either fit into light or dark.
 */
var themeColorModes = exports.themeColorModes = ['light', 'dark', 'auto'];