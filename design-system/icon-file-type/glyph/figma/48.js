"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Figma48Icon = function Figma48Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"48\" height=\"64\" viewBox=\"0 0 48 64\" focusable=\"false\" role=\"presentation\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 .5h28.007a3.5 3.5 0 0 1 2.52 1.072l11.994 12.45a3.5 3.5 0 0 1 .979 2.429V60a3.5 3.5 0 0 1-3.5 3.5H4A3.5 3.5 0 0 1 .5 60V4A3.5 3.5 0 0 1 4 .5z\" fill=\"#fff\" stroke=\"#091E42\" stroke-opacity=\".08\"/><path d=\"M21.493 39.52A2.508 2.508 0 0 0 24 37.013v-2.506h-2.507a2.508 2.508 0 0 0 0 5.013zM18.987 32a2.508 2.508 0 0 1 2.506-2.507H24v5.014h-2.507A2.508 2.508 0 0 1 18.987 32zm0-5.013a2.508 2.508 0 0 1 2.506-2.507H24v5.013h-2.507a2.508 2.508 0 0 1-2.506-2.506zM24 24.48h2.507a2.508 2.508 0 0 1 0 5.013H24V24.48z\" fill=\"#5243AA\"/><path d=\"M29.013 32A2.508 2.508 0 0 1 24 32a2.508 2.508 0 0 1 5.013 0z\" fill=\"#5243AA\"/></svg>"
  }, props, {
    size: "xlarge"
  }));
};

Figma48Icon.displayName = 'Figma48Icon';
var _default = Figma48Icon;
exports.default = _default;