"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var AttachmentIcon = function AttachmentIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11.643 17.965c-1.53 1.495-4.016 1.496-5.542.004a3.773 3.773 0 0 1 .002-5.412l7.147-6.985a2.316 2.316 0 0 1 3.233-.003c.893.873.895 2.282.004 3.153l-6.703 6.55a.653.653 0 0 1-.914-.008.62.62 0 0 1 0-.902l6.229-6.087a.941.941 0 0 0 0-1.353.995.995 0 0 0-1.384 0l-6.23 6.087a2.502 2.502 0 0 0 0 3.607 2.643 2.643 0 0 0 3.683.009l6.703-6.55a4.074 4.074 0 0 0-.003-5.859 4.306 4.306 0 0 0-6.002.003l-7.148 6.985a5.655 5.655 0 0 0-.001 8.118c2.29 2.239 6.015 2.238 8.31-.005l6.686-6.533a.941.941 0 0 0 0-1.353.995.995 0 0 0-1.384 0l-6.686 6.534z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

AttachmentIcon.displayName = 'AttachmentIcon';
var _default = AttachmentIcon;
exports.default = _default;