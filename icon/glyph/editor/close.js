"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditorCloseIcon = function EditorCloseIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M15.185 7.4l-3.184 3.185-3.186-3.186a.507.507 0 0 0-.712.003l-.7.701a.496.496 0 0 0-.004.712l3.185 3.184L7.4 15.185a.507.507 0 0 0 .004.712l.7.7c.206.207.516.2.712.004l3.186-3.185 3.184 3.185a.507.507 0 0 0 .712-.004l.701-.7a.496.496 0 0 0 .003-.712l-3.186-3.186 3.186-3.184a.507.507 0 0 0-.003-.712l-.7-.7a.508.508 0 0 0-.36-.153.5.5 0 0 0-.353.15z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

EditorCloseIcon.displayName = 'EditorCloseIcon';
var _default = EditorCloseIcon;
exports.default = _default;