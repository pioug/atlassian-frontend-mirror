"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiIcon = function EmojiIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 16.071c3.9 0 7.071-3.171 7.071-7.071S15.9 4.929 12 4.929A7.079 7.079 0 0 0 4.929 12c0 3.9 3.171 7.071 7.071 7.071zm-1.929-7.714a1.286 1.286 0 1 1 .001-2.572 1.286 1.286 0 0 1 0 2.572zm3.858 0a1.286 1.286 0 1 1 0-2.572 1.286 1.286 0 0 1 0 2.572zm.347 2.035a.805.805 0 0 1 1.198 1.073A4.668 4.668 0 0 1 12 16.018a4.666 4.666 0 0 1-3.469-1.548.804.804 0 0 1 1.196-1.074c1.158 1.29 3.393 1.29 4.549-.004z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EmojiIcon.displayName = 'EmojiIcon';
var _default = EmojiIcon;
exports.default = _default;