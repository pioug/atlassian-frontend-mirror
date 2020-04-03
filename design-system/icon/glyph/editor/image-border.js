"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorImageBorderIcon = function EditorImageBorderIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M17 9h1v3h-1V9zm0 4h1v2h-1v-2zM6 9h1v2H6V9zm0 3h1v3H6v-3zm3 5h2v1H9v-1zm3 0h3v1h-3v-1zM9 6h3v1H9V6zm4 0h2v1h-2V6zm-7 .505C6 6.226 6.214 6 6.505 6H8v1H7v1H6V6.505zm12 0V8h-1V7h-1V6h1.495c.291 0 .505.226.505.505zM6 17.495V16h1v1h1v1H6.505A.497.497 0 0 1 6 17.495zm12 0a.497.497 0 0 1-.505.505H16v-1h1v-1h1v1.495z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorImageBorderIcon.displayName = 'EditorImageBorderIcon';
var _default = EditorImageBorderIcon;
exports.default = _default;