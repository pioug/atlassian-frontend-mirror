"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorDoneIcon = function EditorDoneIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M7.356 10.942a.497.497 0 0 0-.713 0l-.7.701a.501.501 0 0 0-.003.71l3.706 3.707a.501.501 0 0 0 .705.003l7.712-7.712a.493.493 0 0 0-.006-.708l-.7-.7a.504.504 0 0 0-.714 0l-6.286 6.286a.506.506 0 0 1-.713 0l-2.288-2.287z\" fill=\"currentColor\"/></svg>"
  }, props));
};

EditorDoneIcon.displayName = 'EditorDoneIcon';
var _default = EditorDoneIcon;
exports.default = _default;