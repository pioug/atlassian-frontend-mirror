"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiNatureIcon = function EmojiNatureIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M13 16h3.625l-2.5-4h1.208L12 7l-3.333 5h1.208l-2.5 4H11v2h2v-2zm4.33-2.06l1.527 2.546A1 1 0 0 1 18 18h-3c-.003 1.105-.9 2-1.998 2h-2.004A1.999 1.999 0 0 1 9 18H6a1 1 0 0 1-.857-1.514L6.67 13.94c-.6-.23-.888-1.068-.484-1.697l5-7.778c.4-.62 1.229-.62 1.628 0l5 7.778c.404.629.117 1.467-.484 1.697z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EmojiNatureIcon.displayName = 'EmojiNatureIcon';
var _default = EmojiNatureIcon;
exports.default = _default;