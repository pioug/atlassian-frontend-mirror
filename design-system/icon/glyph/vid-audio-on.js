"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidAudioOnIcon = function VidAudioOnIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><rect x=\"9\" y=\"3\" width=\"6\" height=\"12\" rx=\"3\"/><path d=\"M13 17.917c2.833-.476 5-2.941 5-5.91V9a1 1 0 0 0-2 0v3.006A4.001 4.001 0 0 1 12 16c-2.205 0-4-1.795-4-3.994V9a1 1 0 1 0-2 0v3.006c0 2.96 2.162 5.433 5 5.91v2.075a1 1 0 1 0 2 0v-2.074z\" fill-rule=\"nonzero\"/></g></svg>"
  }, props));
};

VidAudioOnIcon.displayName = 'VidAudioOnIcon';
var _default = VidAudioOnIcon;
exports.default = _default;