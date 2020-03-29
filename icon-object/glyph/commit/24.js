"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Commit24Icon = function Commit24Icon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path fill=\"#FFAB00\" fill-rule=\"evenodd\" d=\"M11.008 8.124a4.002 4.002 0 0 0 0 7.752A1.01 1.01 0 0 0 11 16v4a1 1 0 0 0 2 0v-4a1.01 1.01 0 0 0-.008-.124 4.002 4.002 0 0 0 0-7.752A1.01 1.01 0 0 0 13 8V4a1 1 0 0 0-2 0v4c0 .042.003.083.008.124zM3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm9 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z\"/></svg>"
  }, props, {
    size: "medium"
  }));
};

Commit24Icon.displayName = 'Commit24Icon';
var _default = Commit24Icon;
exports.default = _default;