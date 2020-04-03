"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorUnderlineIcon = function EditorUnderlineIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M7 7a1 1 0 1 1 2 0v4c0 1.884.93 3 3 3s3-1.116 3-3V7a1 1 0 0 1 2 0v4c0 2.916-1.737 5-5 5s-5-2.084-5-5V7zm0 10h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorUnderlineIcon.displayName = 'EditorUnderlineIcon';
var _default = EditorUnderlineIcon;
exports.default = _default;