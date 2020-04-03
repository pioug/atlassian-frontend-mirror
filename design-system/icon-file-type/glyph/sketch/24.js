"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Sketch24Icon = function Sketch24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#FF8B00\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm9.03 20h.001c.29-.001.562-.126.752-.343l6.971-8a1 1 0 0 0 .095-1.185l-2.485-4a1.003 1.003 0 0 0-.85-.472h-8.84c-.334 0-.646.167-.832.444l-2.674 4a1 1 0 0 0 .081 1.216l7.03 8c.188.216.462.34.75.34z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Sketch24Icon.displayName = 'Sketch24Icon';
var _default = Sketch24Icon;
exports.default = _default;