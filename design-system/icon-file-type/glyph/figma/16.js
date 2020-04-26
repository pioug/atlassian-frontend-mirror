"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Figma16Icon = function Figma16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M2.165 0C.97 0 0 .97 0 2.165v11.67C0 15.03.97 16 2.165 16h11.67C15.03 16 16 15.03 16 13.835V2.165C16 .97 15.03 0 13.835 0H2.165zm5.837 11.342a1.67 1.67 0 1 1-1.67-1.671 1.67 1.67 0 0 1 0-3.342 1.67 1.67 0 0 1 0-3.342h3.34a1.67 1.67 0 0 1 0 3.342h-1.67v1.667a1.67 1.67 0 1 1 0 .008v3.338z\" fill=\"#5243AA\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Figma16Icon.displayName = 'Figma16Icon';
var _default = Figma16Icon;
exports.default = _default;