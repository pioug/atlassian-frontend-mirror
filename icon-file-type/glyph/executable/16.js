"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Executable16Icon = function Executable16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#5E6C84\" fill-rule=\"evenodd\" d=\"M0 1.994C0 .893.895 0 1.994 0h12.012C15.107 0 16 .895 16 1.994v12.012A1.995 1.995 0 0 1 14.006 16H1.994A1.995 1.995 0 0 1 0 14.006V1.994zm3 6.72v3.572c0 .394.32.714.714.714h8.572c.394 0 .714-.32.714-.714V8.714H3zM4.345 3a.714.714 0 0 0-.709.626L3 8.714h10l-.636-5.088A.714.714 0 0 0 11.655 3h-7.31zm.798 7.143h5.714a.714.714 0 0 1 0 1.428H5.143a.714.714 0 1 1 0-1.428z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Executable16Icon.displayName = 'Executable16Icon';
var _default = Executable16Icon;
exports.default = _default;