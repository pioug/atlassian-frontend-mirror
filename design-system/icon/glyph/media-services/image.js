"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var MediaServicesImageIcon = function MediaServicesImageIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><rect fill=\"currentColor\" x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><circle fill=\"inherit\" cx=\"8.667\" cy=\"8.667\" r=\"2\"/><path fill=\"inherit\" d=\"M6.667 17.333l2.666-2.666L12 17.333z\"/><path fill=\"inherit\" d=\"M14.667 12l2.666 2.933v2.4h-8z\"/></g></svg>"
  }, props));
};

MediaServicesImageIcon.displayName = 'MediaServicesImageIcon';
var _default = MediaServicesImageIcon;
exports.default = _default;