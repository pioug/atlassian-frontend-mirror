"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorBoldIcon = function EditorBoldIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M8 6h4.832C13.908 6 16 6.5 16 9c0 1.333-.333 2.167-1 2.5 1.333.333 2 1.333 2 3 0 .5 0 3.5-4 3.5H8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm1 10h3.5c1 0 2-.25 2-1.5s-1.104-1.5-2-1.5H9v3zm0-4.975h3c.504 0 2 0 2-1.525S12 8 12 8H9v3.025z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorBoldIcon.displayName = 'EditorBoldIcon';
var _default = EditorBoldIcon;
exports.default = _default;