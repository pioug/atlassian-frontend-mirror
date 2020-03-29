"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var PdfDocument24Icon = function PdfDocument24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF5630\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm1.846 12.17h.483c1.116 0 1.203-.322 1.203-.776 0-.518-.268-.771-.817-.771h-.869v1.546zm6.29 2.183h.664c.742 0 1.501-.22 1.501-1.855 0-1.65-.802-1.86-1.501-1.86h-.665v3.715zM4.462 15.99h-1.08A.384.384 0 0 1 3 15.606V9.383c0-.21.171-.383.383-.383h2.494c1.483 0 2.52.984 2.52 2.394 0 1.43-1.015 2.39-2.525 2.39H4.846v1.822a.384.384 0 0 1-.383.384zm7.45 0h-2.24a.384.384 0 0 1-.384-.384V9.383c0-.21.172-.383.383-.383h2.242c2.107 0 3.268 1.237 3.268 3.484 0 2.26-1.16 3.506-3.268 3.506zm5.776 0h-1.08a.384.384 0 0 1-.384-.384V9.383c0-.21.172-.383.383-.383h4.009c.21 0 .383.172.383.383v.88a.383.383 0 0 1-.383.383h-2.545v1.14h2.292c.212 0 .383.172.383.383v.867c0 .21-.171.383-.383.383h-2.292v2.187a.384.384 0 0 1-.383.384z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

PdfDocument24Icon.displayName = 'PdfDocument24Icon';
var _default = PdfDocument24Icon;
exports.default = _default;