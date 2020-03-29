"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ArrowLeftCircleIcon = function ArrowLeftCircleIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><circle fill=\"currentColor\" cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M16 10.995h-5.586l1.272-1.279a1.01 1.01 0 0 0 0-1.421.996.996 0 0 0-1.415 0l-2.978 2.994a1.01 1.01 0 0 0 0 1.423l2.978 2.993a.999.999 0 0 0 1.415 0 1.01 1.01 0 0 0 0-1.421l-1.272-1.279H16c.552 0 1-.45 1-1.005 0-.555-.448-1.005-1-1.005\" fill=\"inherit\"/></svg>"
  }, props));
};

ArrowLeftCircleIcon.displayName = 'ArrowLeftCircleIcon';
var _default = ArrowLeftCircleIcon;
exports.default = _default;