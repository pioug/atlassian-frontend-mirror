"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Blog16Icon = function Blog16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#2684FF\" fill-rule=\"evenodd\" d=\"M6.972 6.128a2.5 2.5 0 1 0-2.37 2.87c-.277.394-.616.815-1.016 1.265a.916.916 0 0 0-.058 1.147.607.607 0 0 0 .948.043c1.939-2.221 2.77-3.996 2.496-5.325zm7 0a2.5 2.5 0 1 0-2.37 2.87c-.277.394-.616.815-1.016 1.265a.916.916 0 0 0-.058 1.147.607.607 0 0 0 .948.043c1.939-2.221 2.77-3.996 2.496-5.325zM2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Blog16Icon.displayName = 'Blog16Icon';
var _default = Blog16Icon;
exports.default = _default;