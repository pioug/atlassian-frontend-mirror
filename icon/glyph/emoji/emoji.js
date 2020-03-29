"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiEmojiIcon = function EmojiEmojiIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zm0-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-3.95-4.803c-.167-.477.102-.991.601-1.15.5-.159 1.039.099 1.205.575.06.174.225.487.495.796.426.488.956.764 1.649.764.693 0 1.223-.276 1.65-.764.27-.31.433-.622.494-.796.166-.476.706-.734 1.205-.575.499.159.768.673.602 1.15a4.38 4.38 0 0 1-.839 1.385C14.348 16.458 13.306 17 12 17s-2.348-.542-3.112-1.418a4.382 4.382 0 0 1-.839-1.385zM9.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EmojiEmojiIcon.displayName = 'EmojiEmojiIcon';
var _default = EmojiEmojiIcon;
exports.default = _default;