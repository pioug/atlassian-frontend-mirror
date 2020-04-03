"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Question16Icon = function Question16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#6554C0\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm9.751 5.75a3.75 3.75 0 0 0-7.5 0 1 1 0 0 0 2 0 1.75 1.75 0 1 1 2.687 1.476l-1.48.957a1 1 0 0 0-.457.84V10a1 1 0 0 0 2 0v-.454l.873-.565c1.117-.65 1.877-1.846 1.877-3.231zM8.001 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Question16Icon.displayName = 'Question16Icon';
var _default = Question16Icon;
exports.default = _default;