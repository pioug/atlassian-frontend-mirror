"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EmojiFrequentIcon = function EmojiFrequentIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M12 4c-4.412 0-8 3.588-8 8s3.588 8 8 8 8-3.588 8-8-3.588-8-8-8zm0 14.222A6.23 6.23 0 0 1 5.778 12 6.23 6.23 0 0 1 12 5.778 6.23 6.23 0 0 1 18.222 12 6.23 6.23 0 0 1 12 18.222zm.889-6.59V8.448c0-.489-.4-.889-.889-.889s-.889.4-.889.89v3.555c0 .248.103.471.268.633l2.195 2.194a.891.891 0 0 0 1.257 0 .891.891 0 0 0 0-1.256l-1.942-1.943z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EmojiFrequentIcon.displayName = 'EmojiFrequentIcon';
var _default = EmojiFrequentIcon;
exports.default = _default;