"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var SourceCode16Icon = function SourceCode16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#00B8D9\" fill-rule=\"evenodd\" d=\"M0 1.994C0 .893.895 0 1.994 0h12.012C15.107 0 16 .895 16 1.994v12.012A1.995 1.995 0 0 1 14.006 16H1.994A1.995 1.995 0 0 1 0 14.006V1.994zm6.639 8.417L4.253 8.1l2.589-2.51a.924.924 0 1 0-1.288-1.328L2.281 7.435a.925.925 0 0 0 0 1.328l3.07 2.976a.925.925 0 1 0 1.288-1.328zm7.203-3.173L10.77 4.26a.924.924 0 1 0-1.286 1.33l2.385 2.313-2.588 2.51a.924.924 0 1 0 1.287 1.327l3.274-3.173a.925.925 0 0 0 0-1.328z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

SourceCode16Icon.displayName = 'SourceCode16Icon';
var _default = SourceCode16Icon;
exports.default = _default;