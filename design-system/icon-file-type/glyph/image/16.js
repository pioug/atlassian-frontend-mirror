"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Image16Icon = function Image16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#FFAB00\" fill-rule=\"evenodd\" d=\"M2 0h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm4.75 11.75l-.543-.543a1 1 0 0 0-1.414 0L3 13h10v-2.25l-1.795-1.974a1 1 0 0 0-1.447-.034L6.75 11.75zM4.667 6.333a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Image16Icon.displayName = 'Image16Icon';
var _default = Image16Icon;
exports.default = _default;