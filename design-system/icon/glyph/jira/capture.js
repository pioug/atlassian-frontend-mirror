"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var JiraCaptureIcon = function JiraCaptureIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm1-12h6c1.136 0 2 1 2 2v6l-2-2V5h-4l-2-2zM3 11V5c0-1.136 1-2 2-2h6L9 5H5v4l-2 2zm8 10H5c-1.136 0-2-1-2-2v-6l2 2v4h4l2 2zm10-8v6c0 1.136-1 2-2 2h-6l2-2h4v-4l2-2z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

JiraCaptureIcon.displayName = 'JiraCaptureIcon';
var _default = JiraCaptureIcon;
exports.default = _default;