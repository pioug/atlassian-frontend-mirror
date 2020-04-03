"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Problem24Icon = function Problem24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF5630\" fill-rule=\"evenodd\" d=\"M7.654 17.488l9.834-9.834a7 7 0 0 1-9.834 9.834zM6.28 16.035a7 7 0 0 1 9.756-9.756L6.28 16.035zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm9 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Problem24Icon.displayName = 'Problem24Icon';
var _default = Problem24Icon;
exports.default = _default;