"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Generic16Icon = function Generic16Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" focusable=\"false\" role=\"presentation\"><path fill=\"#5E6C84\" fill-rule=\"evenodd\" d=\"M8 3H5.333C4.597 3 4 3.617 4 4.378v7.244C4 12.382 4.597 13 5.333 13h5.334c.736 0 1.333-.617 1.333-1.378V8h-1.333v3.622H5.333V4.378H8v1.414c0 .736.597 1.333 1.333 1.333h2.334c.184 0 .333-.15.333-.333v-.903a.333.333 0 0 0-.093-.231l-2.164-2.25A1.333 1.333 0 0 0 8.782 3H8zM0 1.994C0 .893.895 0 1.994 0h12.012C15.107 0 16 .895 16 1.994v12.012A1.995 1.995 0 0 1 14.006 16H1.994A1.995 1.995 0 0 1 0 14.006V1.994z\"/></svg>"
  }, props, {
    size: "small"
  }));
};

Generic16Icon.displayName = 'Generic16Icon';
var _default = Generic16Icon;
exports.default = _default;