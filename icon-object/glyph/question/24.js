"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Question24Icon = function Question24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#6554C0\" fill-rule=\"evenodd\" d=\"M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm9 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-2a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm3.238-8.88a3.12 3.12 0 0 0-6.238 0 1 1 0 1 0 2 0 1.119 1.119 0 0 1 2.238 0 1.1 1.1 0 0 1-.329.775l-1.499.994a.999.999 0 0 0-.448.834v.022h-.002v.753a1 1 0 0 0 2 0v-.228l.717-.464a3.106 3.106 0 0 0 1.561-2.687zm-3.285 4.882a.998.998 0 1 0 0 1.997.998.998 0 0 0 0-1.997z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Question24Icon.displayName = 'Question24Icon';
var _default = Question24Icon;
exports.default = _default;