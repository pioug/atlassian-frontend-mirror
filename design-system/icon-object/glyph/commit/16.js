"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Commit16Icon = function Commit16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#FFAB00\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-.986 1.834a3.001 3.001 0 0 1 0-5.668A1.007 1.007 0 0 1 7 5V3a1 1 0 1 1 2 0v2c0 .057-.005.112-.014.166a3.001 3.001 0 0 1 0 5.668c.01.054.014.11.014.166v2a1 1 0 0 1-2 0v-2c0-.057.005-.112.014-.166z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Commit16Icon.displayName = 'Commit16Icon';
var _default = Commit16Icon;
exports.default = _default;