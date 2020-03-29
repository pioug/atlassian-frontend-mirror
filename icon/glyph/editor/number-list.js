"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorNumberListIcon = function EditorNumberListIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M11 7h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm0 4h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm0 4h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm-5 0h3v1H6v-1zm0 2h3v1H6v-1zm1-9H6V7h2v3H7V8zm-1 3h3v1.333h-.6V13H7.2v-.667H6V11zm0 2h3v1H6v-1zm2 3h2v1H8v-1z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorNumberListIcon.displayName = 'EditorNumberListIcon';
var _default = EditorNumberListIcon;
exports.default = _default;