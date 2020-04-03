"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var VidFullScreenOnIcon = function VidFullScreenOnIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M6 18h3a1 1 0 0 1 0 2H6a2 2 0 0 1-2-2v-3a1 1 0 0 1 2 0v3zm12 2h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3a2 2 0 0 1-2 2zM6 4h3a1 1 0 1 1 0 2H6v3a1 1 0 1 1-2 0V6a2 2 0 0 1 2-2zm12 2h-3a1 1 0 0 1 0-2h3a2 2 0 0 1 2 2v3a1 1 0 0 1-2 0V6z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

VidFullScreenOnIcon.displayName = 'VidFullScreenOnIcon';
var _default = VidFullScreenOnIcon;
exports.default = _default;