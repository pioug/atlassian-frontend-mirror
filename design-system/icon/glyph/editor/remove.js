"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorRemoveIcon = function EditorRemoveIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M7 7h10a1 1 0 0 1 0 2H7a1 1 0 1 1 0-2zm2.78 11a1 1 0 0 1-.97-.757L7.156 10.62A.5.5 0 0 1 7.64 10h8.72a.5.5 0 0 1 .485.621l-1.656 6.622a1 1 0 0 1-.97.757H9.781zM11 6h2a1 1 0 0 1 1 1h-4a1 1 0 0 1 1-1z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorRemoveIcon.displayName = 'EditorRemoveIcon';
var _default = EditorRemoveIcon;
exports.default = _default;