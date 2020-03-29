"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiSymbolsIcon = function EmojiSymbolsIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 9.44l1.76-1.744a2.505 2.505 0 0 1 3.52 0 2.451 2.451 0 0 1 0 3.488L12 16.417l-5.28-5.232a2.451 2.451 0 0 1 0-3.49 2.505 2.505 0 0 1 3.52 0v.001L12 9.44zm-6.684 3.143l.003.004 6.322 6.266a.508.508 0 0 0 .718 0l6.322-6.266.003-.004.004-.003a4.412 4.412 0 0 0 0-6.28 4.509 4.509 0 0 0-6.336 0l-.003.004-.004.003L12 6.65l-.345-.342-.004-.003-.003-.003a4.509 4.509 0 0 0-6.336 0 4.412 4.412 0 0 0 0 6.279l.004.003z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EmojiSymbolsIcon.displayName = 'EmojiSymbolsIcon';
var _default = EmojiSymbolsIcon;
exports.default = _default;