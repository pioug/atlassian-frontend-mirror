"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.additionalChecks = void 0;
var additionalChecks = exports.additionalChecks = [{
  foreground: 'color.text.brand',
  backgroundLight: 'elevation.surface.sunken',
  backgroundDark: 'elevation.surface.overlay',
  desiredContrast: 4.5,
  updatedTokens: [
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base token
  'color.text.brand', 'color.text.selected', 'color.link', 'color.link.pressed', 'color.icon.brand', 'color.icon.selected']
}, {
  foreground: 'color.text.brand',
  backgroundLight: 'color.background.selected',
  backgroundDark: 'color.background.selected',
  desiredContrast: 4.5,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base toke
  updatedTokens: ['color.text.brand', 'color.link', 'color.link.pressed']
}, {
  foreground: 'color.text.selected',
  backgroundLight: 'color.background.selected',
  backgroundDark: 'color.background.selected',
  desiredContrast: 4.5,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base token
  updatedTokens: ['color.text.selected', 'color.icon.selected']
}, {
  foreground: 'color.border.brand',
  backgroundLight: 'elevation.surface.sunken',
  backgroundDark: 'elevation.surface.overlay',
  desiredContrast: 3,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base toke
  updatedTokens: ['color.border.brand', 'color.border.selected']
}, {
  foreground: 'color.chart.brand',
  backgroundLight: 'elevation.surface.sunken',
  backgroundDark: 'elevation.surface.overlay',
  desiredContrast: 3,
  // In light mode: darken the following tokens by one base token
  // In dark mode: lighten the following tokens by one base token
  updatedTokens: ['color.chart.brand', 'color.chart.brand.hovered']
}];