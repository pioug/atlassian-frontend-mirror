"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ImageResizeIcon = function ImageResizeIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M5 14v3.89a1.1 1.1 0 0 0 1.1 1.1H10a1 1 0 1 0 0-2H7V14a1 1 0 1 0-2 0z\" fill=\"inherit\"/><path d=\"M5.707 18.121c.39.39 1.027.388 1.41.004L18.125 7.117a.995.995 0 0 0-.004-1.41 1.001 1.001 0 0 0-1.41-.004L5.703 16.711a.995.995 0 0 0 .004 1.41z\" fill=\"inherit\"/><path d=\"M17 7v2.99a1 1 0 0 0 2 0V6.1A1.1 1.1 0 0 0 17.9 5H14a1 1 0 0 0 0 2h3z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

ImageResizeIcon.displayName = 'ImageResizeIcon';
var _default = ImageResizeIcon;
exports.default = _default;