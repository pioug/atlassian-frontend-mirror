"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiTravelIcon = function EmojiTravelIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M15.584 17H8.416l-2.708 2.709a1.004 1.004 0 0 1-1.415 0l-.002-.002a1.004 1.004 0 0 1 0-1.415l1.618-1.617A1.998 1.998 0 0 1 5 14.997V6.003C5 4.897 5.897 4 7.006 4h9.988C18.102 4 19 4.894 19 6.003v8.994a2 2 0 0 1-.909 1.678l1.618 1.617a1.004 1.004 0 0 1 0 1.415 1.004 1.004 0 0 1-1.417.002L15.584 17zM17 10V6H7v4h10zm0 2v3H7v-3h10zm-1.5 6.997c0 .55-.45 1-1 1h-5c-.55 0-1-.45-1-1s.45-1 1-1h5c.55 0 1 .45 1 1zm.2-5.517a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-6.691 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EmojiTravelIcon.displayName = 'EmojiTravelIcon';
var _default = EmojiTravelIcon;
exports.default = _default;