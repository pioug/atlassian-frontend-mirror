"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Sketch16Icon = function Sketch16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF8B00\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm6.02 13.333a.669.669 0 0 0 .502-.228L13.17 7.77a.667.667 0 0 0 .063-.79l-1.657-2.666A.668.668 0 0 0 11.01 4H5.116a.669.669 0 0 0-.554.296L2.779 6.963a.667.667 0 0 0 .054.81l4.686 5.334a.665.665 0 0 0 .5.226z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Sketch16Icon.displayName = 'Sketch16Icon';
var _default = Sketch16Icon;
exports.default = _default;