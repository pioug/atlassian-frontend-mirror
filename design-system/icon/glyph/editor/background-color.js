"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorBackgroundColorIcon = function EditorBackgroundColorIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M7.818 12.56l4.243 4.243 4.242-4.242-4.242-4.243-4.243 4.243zm-1.414 1.415a1.995 1.995 0 0 1 0-2.828l4.243-4.243a1.995 1.995 0 0 1 2.828 0l4.243 4.243c.78.78.786 2.041 0 2.828l-4.243 4.243a1.996 1.996 0 0 1-2.828 0l-4.243-4.243zM6.5 13h11l-5.44 5.218L6.5 13zm2.732-8.925a1 1 0 0 1 1.414 0l3.536 3.536-1.414 1.414L9.232 5.49a1 1 0 0 1 0-1.415zM18 16s1.5 2 1.5 3.5c0 1-1 1.5-1.5 1.5s-1.5-.4-1.5-1.5C16.5 18 18 16 18 16z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorBackgroundColorIcon.displayName = 'EditorBackgroundColorIcon';
var _default = EditorBackgroundColorIcon;
exports.default = _default;