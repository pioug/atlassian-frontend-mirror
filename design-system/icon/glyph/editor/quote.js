"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorQuoteIcon = function EditorQuoteIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M15.698 17C16.97 17 18 15.982 18 14.727c0-1.255-1.03-2.273-2.302-2.273-2.301 0-.767-4.393 2.302-4.393V7c-5.478 0-7.624 10-2.302 10zm-4.33-2.273c0-1.255-1.031-2.273-2.301-2.273-2.302 0-.768-4.393 2.301-4.393V7C5.891 7 3.744 17 9.067 17c1.27 0 2.301-1.018 2.301-2.273z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorQuoteIcon.displayName = 'EditorQuoteIcon';
var _default = EditorQuoteIcon;
exports.default = _default;