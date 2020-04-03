"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorDateIcon = function EditorDateIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M6 8.51c0-.282.229-.51.5-.51h11c.276 0 .5.228.5.51v8.98c0 .282-.229.51-.5.51h-11a.505.505 0 0 1-.5-.51V8.51zm2 2.995v.99c0 .291.226.505.505.505h.99a.497.497 0 0 0 .505-.505v-.99A.497.497 0 0 0 9.495 11h-.99a.497.497 0 0 0-.505.505zm3 0v.99c0 .291.226.505.505.505h.99a.497.497 0 0 0 .505-.505v-.99a.497.497 0 0 0-.505-.505h-.99a.497.497 0 0 0-.505.505zm-3 3v.99c0 .291.226.505.505.505h.99a.497.497 0 0 0 .505-.505v-.99A.497.497 0 0 0 9.495 14h-.99a.497.497 0 0 0-.505.505zM7.5 8v1h3V8h-3zm6 0v1h3V8h-3zm.5-1.495c0-.279.214-.505.505-.505h.99c.279 0 .505.214.505.505V8h-2V6.505zm-6 0C8 6.226 8.214 6 8.505 6h.99c.279 0 .505.214.505.505V8H8V6.505z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorDateIcon.displayName = 'EditorDateIcon';
var _default = EditorDateIcon;
exports.default = _default;