"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesLineThicknessIcon = function MediaServicesLineThicknessIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M4 4.495C4 4.222 4.226 4 4.496 4h15.008c.274 0 .496.216.496.495v2.01a.498.498 0 0 1-.496.495H4.496A.492.492 0 0 1 4 6.505v-2.01zm0 8.01c0-.279.226-.505.496-.505h15.008c.274 0 .496.214.496.505v.99a.503.503 0 0 1-.496.505H4.496A.493.493 0 0 1 4 13.495v-.99zm0 6.747c0-.139.102-.252.251-.252H19.75c.138 0 .251.107.251.252v.496a.245.245 0 0 1-.251.252H4.25a.248.248 0 0 1-.25-.252v-.496z\" fill=\"currentColor\"/></svg>"
  }, props));
};

MediaServicesLineThicknessIcon.displayName = 'MediaServicesLineThicknessIcon';
var _default = MediaServicesLineThicknessIcon;
exports.default = _default;