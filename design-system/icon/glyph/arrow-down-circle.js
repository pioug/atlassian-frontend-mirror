"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ArrowDownCircleIcon = function ArrowDownCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><circle fill=\"currentColor\" fill-rule=\"nonzero\" cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M10.994 8v5.586l-1.279-1.272a1.01 1.01 0 0 0-1.421 0 .998.998 0 0 0 0 1.416l2.994 2.977a1.01 1.01 0 0 0 1.423 0l2.994-2.977a.998.998 0 0 0 0-1.416 1.01 1.01 0 0 0-1.421 0l-1.279 1.272V8c0-.552-.45-1-1.005-1-.555 0-1.006.448-1.006 1z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

ArrowDownCircleIcon.displayName = 'ArrowDownCircleIcon';
var _default = ArrowDownCircleIcon;
exports.default = _default;