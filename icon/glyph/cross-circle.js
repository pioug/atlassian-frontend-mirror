"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var CrossCircleIcon = function CrossCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><g fill-rule=\"evenodd\"><circle fill=\"currentColor\" cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M13.477 9.113l-4.36 4.386a1 1 0 1 0 1.418 1.41l4.36-4.386a1 1 0 0 0-1.418-1.41z\" fill=\"inherit\"/><path d=\"M9.084 10.501l4.358 4.377a1 1 0 1 0 1.418-1.411L10.5 9.09a1 1 0 0 0-1.417 1.411z\" fill=\"inherit\"/></g></svg>"
  }, props));
};

CrossCircleIcon.displayName = 'CrossCircleIcon';
var _default = CrossCircleIcon;
exports.default = _default;